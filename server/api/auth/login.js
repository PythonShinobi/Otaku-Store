// server/api/auth/login.js
import passport from 'passport';

import localStrategy from "./passport-local.js";
import { setLoginSession } from "./auth.js";
import setAdmin from "../middleware/setAdmin.js";

// Register the local authentication strategy with Passport.
// This tells Passport how to authenticate users using a username and password 
// stored locally (e.g., in a database).
passport.use(localStrategy);

/**
 * Helper function to handle Passport authentication and return a Promise.
 *
 * @param {string} strategy - The name of the Passport strategy to use.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A promise that resolves with the authenticated user object.
 */
const authenticate = (strategy, req, res) =>
  new Promise((resolve, reject) => {
    // Use Passport to authenticate with the specified method (strategy).
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      // If there's an error or the user is not authenticated, reject the promise with the specific error message.
      if (error || !user) {
        reject(info.message || 'Authentication Failed.');
      } else {
        // If authentication is successful, resolve the promise with the user object.
        resolve(user);
      }
    })(req, res); // Invoke the Passport authentication method with the request and response objects.
  });

  /**
 * This function handles the login process for users.
 * 
 * - It attempts to authenticate the user using a local strategy.
 * - If authentication is successful, it sets the user as an admin if applicable.
 * - It creates a session object with the authenticated user's information.
 * - It sets the login session, typically by setting a cookie or JWT.
 * - It sends a success response if login is successful.
 * - If any errors occur during the process, they are logged and an unauthorized response is sent.
 * 
 * Detailed steps:
 * 
 * 1. The function tries to authenticate the user using the local strategy.
 *    - The `authenticate` function is likely part of the Passport.js library or a similar authentication library.
 *    - It takes the strategy name ('local'), the request object (req), and the response object (res) as arguments.
 * 
 * 2. If the authentication is successful, the user object is returned and assigned to the `user` variable.
 * 
 * 3. The function then updates the user to set them as an admin if applicable using the `setAdmin` function.
 *    - The `setAdmin` function takes the user object and returns an updated user object.
 * 
 * 4. A session object is created with the updated user information.
 * 
 * 5. The `setLoginSession` function sets the login session, likely by setting a cookie or a JWT.
 *    - The function takes the response object (res) and the session object as arguments.
 * 
 * 6. If all the above steps are successful, a success response is sent with a status code of 200 and a message indicating the login was successful.
 * 
 * 7. If any errors occur during the authentication or session setup, they are caught in the catch block.
 *    - The error is logged to the console.
 *    - An unauthorized response is sent with a status code of 401 and the error message.
 */
const Login = async (req, res) => {
  try {    
    // Attempt to authenticate the user using the local strategy.
    const user = await authenticate('local', req, res);        

    const updatedUser = await setAdmin(user);    

    // Create a session object with user information.
    const session = { ...updatedUser };    
    console.log(session);

    // Set the login session using a custom function (likely setting a cookie or JWT)
    await setLoginSession(res, session);

    // Send a success response indicating the login was successful
    res.status(200).send("Login successful");
  } catch (error) {
    // Log any errors that occur during authentication or session setup
    console.error(error);
    // Send an unauthorized response with the error message
    res.status(401).json({ message: error });
  }
};

export default Login;