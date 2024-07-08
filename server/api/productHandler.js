// server/api/productHandler.js
import multer from 'multer';

import db from "./db.js";
import cloudinary from "./cloudinary.js";

// Configure multer for in-memory storage.
const storage = multer.memoryStorage();

/**
 * Middleware to handle single file uploads with multer.
 * Uses in-memory storage for storing file temporarily.
 */
export const upload = multer({ storage }).single('image');

/**
 * Creates a new product in the database with image upload to Cloudinary.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves once the product is created and a response is sent.
 */
export const createProduct = async (req, res) => {
  // Extracting data from the request body
  const { name, description, price, category, rating } = req.body;

  try {
    // Ensure 'name' is not empty
    if (!name || !description || !price || !category || !rating) {
      return res.status(400).json({ error: "Name field is required" });
    }

    let imageUrl = null;

    // Check if an image file was uploaded.
    if (req.file) {
      // Upload the image to Cloudinary.
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: "image",
          folder: "otaku-store"
        }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });

      // Contains the URL of the uploaded image.
      imageUrl = result.secure_url;
    }
    // Insert a new product(row) into the database and return the inserted row.
    const newProduct = await db.query(
      'INSERT INTO products (name, description, price, category, image, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category, imageUrl, rating]
    );
    // Extracting the inserted product data from the database response
    const product = newProduct.rows[0];
    // Sending a JSON response back to the client with the details of the newly created product data
    res.json({
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating,
    });

  } catch (error) {
    // Handling errors by logging them and sending a server error response
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}