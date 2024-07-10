// server/api/middleware/setAdmin.js
import db from "../db.js";

/**
 * Sets the isadmin flag to true if the username is "admin".
 * @param {Object} user - User object.
 * @returns {Object} Updated user object with isAdmin flag.
 */
const setAdmin = async (user) => {
  try {
    // Check if the user's username is "admin".
    if (user.username === "admin") {
      // SQL query to update the isadmin flag to true for the admin user.
      const query = `
        UPDATE users
        SET isadmin = true
        WHERE username = $1
        RETURNING *;
      `;

      // Execute the query with the admin's username.
      const result = await db.query(query, [user.username]);

      // If the query returns a result, update the user object.
      if (result.rows.length > 0) {
        user = result.rows[0];   // Update the user object with the returned row.
      }
    }

    // Return the user object (updated if admin, unchanged if not admin).
    return user;
  } catch (error) {
    console.error(`Error setting admin status: ${error}`);
    throw error;
  }
};

export default setAdmin;