// server/api/auth/logout.js
import { removeTokenCookie } from "./auth-cookies.js";

/**
 * Handles user logout by removing the authentication token cookie and redirecting to the home page.
 * 
 * This function performs the following steps:
 * 1. Calls `removeTokenCookie` to remove the authentication token cookie from the response.
 * 2. Sets the HTTP status code to 302 (Found) and redirects the client to the home page ("/") using Express's `redirect` method.
 * 3. If an error occurs during the process, logs the error and sends an internal server error response with the error message.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a redirect response to the client or an error response if logout fails.
 */
const logout = async (req, res) => {
  try {
    // Remove the authentication token cookie from the response.
    removeTokenCookie(res);
    // Set the HTTP status code to 302 (Found) and redirect the client to the home page ("/").
    res.redirect(302, '/'); // Using Express's redirect method.
  } catch (error) {
    console.error("Error during logout", error);
    // Send an internal server error response with the error message
    res.status(500).send('Logout failed');
  }
};

export default logout;