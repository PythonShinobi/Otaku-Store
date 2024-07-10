// server/api/auth/auth.js

// This module manages user login sessions using @hapi/iron for secure token handling.

import Iron from "@hapi/iron";
import env from "dotenv";

import { MAX_AGE, setTokenCookie, getTokenCookie } from "./auth-cookies.js";

env.config();

const TOKEN_SECRET = process.env.SESSION_SECRET;

if (!TOKEN_SECRET) {
  throw new Error('TOKEN_SECRET environment variable is not defined');
};

/**
 * Sets the login session for the user by encrypting session data and setting it as a cookie.
 * @param {object} res - The response object to set the cookie.
 * @param {object} session - The session data to be encrypted and stored.
 * @returns {Promise<void>} Sets the encrypted session data as a cookie in the response.
 */
export const setLoginSession = async (res, session) => {
  const createdAt = Date.now();
  // Create a session object with a max age for validation.
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  // Seal (encrypt) the session data using Iron.
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token)
};

/**
 * Retrieves the login session from the request cookies and validates it.
 * @param {object} req - The request object containing cookies.
 * @returns {Promise<object|null>} The session object if valid, otherwise null.
 * @throws {Error} If the session token is missing or invalid.
 */
export const getLoginSession = async (req) => {
  // Retrieve the token from the request cooikes.
  const token = getTokenCookie(req);

  if (!token) {
    console.log("No token found in cookies");
    return null;
  }

  try {
    // Unseal (decrypt) the token to get the session data.
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
    // Calculate the expiration time of the session.
    const expiresAt = session.createdAt + session.maxAge * 1000;
    // Check if the current time is past the session expiration time.
    if (Date.now() > expiresAt) {
      throw new Error("Session expired");
    }

    // Return the session data if it is still valid.
    return session;
  } catch (error) {
    console.log(`Error unsealing token: ${error}`);
    throw new Error("Invalid session");
  }
};