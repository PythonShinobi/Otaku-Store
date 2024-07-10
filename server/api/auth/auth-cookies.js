// server/api/auth/auth-cookies.js

// This file manages operations related to HTTP cookies used for authentication tokens.

import { serialize, parse } from "cookie";

// Define the name of the token cookie
const TOKEN_NAME = "auth-token";

// Define the maximum age of the token in seconds (60 days).
export const MAX_AGE = 60 * 60 * 24 * 60;

/**
 * Sets a token cookie in the response header with specified options.
 * @param {object} res - The response object to set the cookie header.
 * @param {string} token - The token value to be set as the cookie.
 * @returns {void} Sets the token cookie in the response header.
 */
export const setTokenCookie = (res, token) => {
  // Create a cookie string with specified options and set it in the response header.
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,   // Cookie expiration time in seconds.
    expires: new Date(Date.now() + MAX_AGE * 1000),  // Exact expiration date.
    httpOnly: true,   // Cookie is accessible only by the web server.
    secure: false,
    path: "/",   // Path where the cookie is accessible.
    sameSite: "lax",   // Restrict cookie to same site context (prevents CSRF attacks). 
  });

  res.cookie(cookie);  // Set the cookie in the response.

  console.log('Setting cookie:', cookie);
};

/**
 * Removes the token cookie by setting an expired cookie in the response header.
 * @param {object} res - The response object to remove the cookie header.
 * @returns {void} Sets an expired cookie in the response header to remove the token cookie.
 */
export const removeTokenCookie = (res) => {
  // Create a cookie string that immediately expires.
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,  // Set maxAge to -1 to delete the cookie.
    path: "/",  // Path where the cookie was accessible.
  });

  res.cookie(cookie);  // Set expired cookie in browser.
};

/**
 * Parses cookies from the request object, prioritizing cookies directly available in req.cookies.
 * Falls back to parsing cookies from the request headers if req.cookies is unavailable.
 * @param {object} req - The request object containing cookies or cookie headers.
 * @returns {object} An object containing parsed cookies.
 */
export const parseCookies = (req) => {
  console.log('Cookies in request:', req.cookies);
  if (req.cookies) {
    return req.cookies;
  } else {
    console.log("No cookies parsed.");
  }

  // Otherwise, parse the cookies from the request headers.
  const cookie = req.headers?.cookie;
  console.log('Cookie header:', cookie);

  return parse(req.cookies || cookie);
};

/**
 * Retrieves the token cookie value from the request cookies.
 * @param {object} req - The request object containing cookies.
 * @returns {string|null} The token cookie value if found, otherwise null.
 */
export const getTokenCookie = (req) => {
  const cookies = parseCookies(req);
  console.log("Parsed cookies", cookies);

  // Return the token cookie.
  return cookies[TOKEN_NAME];
};