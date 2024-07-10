// server/api/auth/register.js
import { createUser } from "./user.js";

/**
 * Register handler for user registration.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
  try {
    // Attempt to create a new user with the data provided in the request body.
    await createUser(req.body);  
    // If successful, send a 200 status response with a success message.
    res.status(200).send({ message: "Registration successful" });
  } catch (error) {
    // If an error occurs, log the error to the console
    console.error('Error during registration:', JSON.stringify(error, null, 2));
    // Send the error message to the client
    res.status(400).send({ message: error.message });
  }
};

export default register;