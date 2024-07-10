// server/api/auth/user.js
import bcrypt from "bcrypt";

import db from "../db.js";

/**
 * Creates a new user with a hashed password and stores the user object in the database.
 *
 * @param {Object} param0 - The user information.
 * @param {string} param0.username - The username of the user.
 * @param {string} param0.email - The email of the user.
 * @param {string} param0.password - The password of the user.
 * @returns {Object} - Returns the user object from the database.
 * @throws {Error} - Throws an error if user creation fails.
 */
export const createUser = async ({ username, email, password }) => {
  try {
    // Check if username already exists in the database.
    const existingUser = await findUser({ username });
    if (existingUser) {
      throw new Error("Username is already taken.");
    }

    // Check if email already exists in the database.
    const existingEmail = await findUserByEmail({ email });
    if (existingEmail) {
      throw new Error("Email is already registered.");
    }

    // Generate a salt and hash the password using bcrypt.
    const salt = await bcrypt.genSalt(14);  // Generate a salt with 14 rounds.
    const passwordHash = await bcrypt.hash(password, salt);   // Hash the password with the salt.

    // SQL query to insert a new user into the users table.
    const query = `
      INSERT INTO users (username, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING username, created_at
    `;

    // Values to insert into the users table.
    const values = [username, email, passwordHash];

    // Execute the SQL query to insert the user and return the new user.
    const result = await db.query(query, values);

    // Return an object containing the username and created_at timestamp of the new user.
    return {
      username: result.rows[0].username,
      created_at: result.rows[0].created_at,
    }
  } catch (error) {
    console.error("Error creating user:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Could not create user");
  }
};

/**
 * Finds a user by their username in the database.
 *
 * @param {Object} param0 - The user information.
 * @param {string} param0.username - The username of the user.
 * @returns {Object} - Returns the user object if found, otherwise returns undefined.
 */
export const findUser = async ({ username }) => {
  // SQL query to find a user by username
  const query = `
    SELECT * FROM users
    WHERE username = $1
  `;

  try {
    // Execute the SQL query to find the user
    const result = await db.query(query, [username]);
    // Return the user object if found, otherwise return undefined
    return result.rows[0]; // Assuming username is unique, return the first match
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Could not find user');
  }
};

/**
 * Finds a user by their email in the database.
 *
 * @param {Object} param0 - The user information.
 * @param {string} param0.email - The email of the user.
 * @returns {Object} - Returns the user object if found, otherwise returns undefined.
 */
export const findUserByEmail = async ({ email }) => {
  // SQL query to find a user by email.
  const query = `
    SELECT * FROM users
    WHERE email = $1
  `;

  try {
    // Execute the SQL query to find the user.
    const result = await db.query(query, [email]);
    // Return the user object if found, otherwise return undefined
    return result.rows[0]; // Assuming email is unique, return the first match.
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Could not find user by email.");
  }
};