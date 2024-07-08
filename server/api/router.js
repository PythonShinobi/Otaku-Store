// server/api/router.js
import { Router } from "express";

import {
  createProduct, 
  upload,
  getProducts,
} from "./productHandler.js";
import { sendEmail } from "./emailHandler.js";

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

export default router;