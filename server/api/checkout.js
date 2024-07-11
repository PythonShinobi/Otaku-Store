// server/api/checkout.js
import env from "dotenv";

import db from "./db.js";
import { findUserByEmail } from "./auth/user.js";
import { transporter } from "./emailHandler.js";

env.config();

/**
 * Handles the checkout process when an order is placed.
 * - Validates the user's email.
 * - Retrieves the user ID from the database.
 * - Inserts order details into the `orders` table.
 * - Inserts each item from the cart into the `order_items` table.
 * - Sends an order confirmation email to the user.
 * - Returns a JSON response indicating the success or failure of the order placement.
 */
const Checkout = async (req, res) => {
  const { firstName, lastName, email, address, city, postalCode, cartItems } = req.body;

  try {
    // Find user by email to get the user ID.
    const user = await findUserByEmail({ email });
    if (!user) {
      return res.status(404).json({ message: "Incorrect Email" });
    }

    const userId = user.id;  // Get the user id.

    // Insert order details into the orders table.
    const query = `
      INSERT INTO orders (user_id, first_name, last_name, email, address, city, postal_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const orderValues = [userId, firstName, lastName, email, address, city, postalCode];  // Values to be inserted in the table.
    const orderResult = await db.query(query, orderValues);  // Execute the query.
    const orderId = orderResult.rows[0].id;  // Get the id of the order.

    // Map over each item in the cartItems array to create an array of promises.
    const orderItems = cartItems.map(async (item) => {  // For each item, an asynchronous function is executed.
      // Define the SQL query to insert an order item into the order_items table.
      const query = `
      INSERT INTO order_items (order_id, user_id, product_id, product_name, quantity, price)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

      // Create an array of values corresponding to the placeholders in the SQL query.
      const orderItemValues = [orderId, userId, item.id, item.name, item.quantity, item.price];

      // Execute the SQL query with the provided values, inserting the order item into the database.
      await db.query(query, orderItemValues);
    });

    // Use `Promise.all` to wait for all the promises (database insertions) to complete.
    await Promise.all(orderItems);

    // Send an email to the user after the order is placed successfully.
    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: "Order Confirmation",
      text: `Dear ${firstName} ${lastName},\n\nThank you for placing your order!\n\nOrder ID: ${orderId}\n\nShipping Address:\n${address}, ${city}, ${postalCode}\n\nWe will notify you once your order is shipped.\n\nThank you for shopping with us!\n\nBest regards,\nOtaku-Store.`
    };

    // Send the email.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error });
  }
};

export default Checkout;