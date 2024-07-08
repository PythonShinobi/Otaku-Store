// server/api/router.js
import { Router } from "express";

import {
  createProduct, 
  upload
} from "./productHandler.js";

const router = Router();

// Message to check if the server is working as expected.
router.get("/", (req, res) => {
  res.send("Backend server is running🙂");
});

// POST endpoint to add products to the database.
router.post("/add-product", upload, createProduct);

export default router;