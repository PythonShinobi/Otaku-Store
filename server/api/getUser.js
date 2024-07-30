// server/api/getUser.js

import { getLoginSession } from "./auth/auth.js";
import { findUser } from "./auth/user.js";

/**
 * Retrieves the user associated with the authenticated session.
 * @param {object} req - The request object containing authentication token.
 * @param {object} res - The response object to send user data or error.
 * @returns {Promise<void>} Sends a JSON response with user data or an error status.
 */
const getUser = async (req, res) => {
  try {
    // Attempt to retrieve the login session from the request.
    const session = await getLoginSession(req);    

    // If a session is found, attempt to find the user associated with the session; otherwise, set user to null.
    const user = (session && (await findUser(session))) ?? null;
    console.log(user);

    // Send a JSON response with the user data and status 200 (OK).
    res.status(200).json({ user });
  } catch (error) {
    // Log any errors to the server console.
    console.error('Error retrieving user:', error);
    // Send a response with status 500 (Internal Server Error) and an error message.
    res.status(500).send('Authentication token is invalid, please log in');
  }
};

export default getUser;