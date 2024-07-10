// server/api/orders.js
import db from "./db.js";

/**
 * Retrieves all order items from the database.
 * 
 * This function handles HTTP GET requests to fetch the details of all order items 
 * from the `order_items` table. It constructs and executes an SQL query to 
 * retrieve the user ID, product name, quantity, and price for each order item. 
 * The results are then sent back to the client in a JSON response. If an error 
 * occurs during the process, it logs the error and responds with a 500 status code 
 * and an error message.
 * 
 * @param {object} req - The request object from the client.
 * @param {object} res - The response object to send the result or error.
 * @returns {Promise<void>} Sends a JSON response with order items or an error status.
 */
const Orders = async (req, res) => {
  try {
    // SQL query to get product_name, quantity, and price from the order_items table.
    const orderItemsQuery = `
      SELECT user_id, product_name, quantity, price 
      FROM order_items;
    `;

    // Execute the SQL query.
    const result = await db.query(orderItemsQuery);
    // console.log(result.rows);

    // Send the result back to the frontend.
    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export default Orders;