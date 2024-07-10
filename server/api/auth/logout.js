// server/api/auth/logout.js
import { removeTokenCookie } from "./auth-cookies";

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