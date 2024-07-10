// server/api/router.js
import { Router } from "express";

import {
  createProduct, 
  upload,
  getProducts,
  getProductById,
  deleteProductById,
  getProductsByCategory
} from "./productHandler.js";
import { sendEmail } from "./emailHandler.js";
import getUser from "./getUser.js";
import register from "./auth/register.js";
import logout from "./auth/logout.js";
import login from "./auth/login.js";

/**
 * Initializes the Express router for defining API routes.
*/
const router = Router();

// Message to check if the server is working as expected.
router.get("/", (req, res) => {
  res.send("Backend server is running🙂");
});

// POST endpoint to add products to the database.
router.post("/add-product", upload, createProduct);

// POST endpoint to send emails.
router.post("/send-email", sendEmail);

// GET endpoint to retrieve products.
router.get("/products", getProducts);

// GET endpoint to retrieve products in similar categories.
router.get("/products/category/:category", getProductsByCategory);

// GET enpoint to retrieve products by id.
router.get("/products/:id", getProductById);

// DELETE endpoint to delete a product by id.
router.delete("/products/:id", deleteProductById);

// Define the route for fetching user data.
router.get('/user', getUser);

// Define the POST /register endpoint
router.post('/register', register);

// Define the GET /logout endpoint.
router.get("/logout", logout);

// Define the POST /login endpoint
router.post("/login", login);

export default router;