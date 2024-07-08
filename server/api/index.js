// server/api/index.js
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";

import router from "./router.js";

env.config();

// Create an express application.
const app = express();
const PORT = process.env.SERVER_PORT || 5001

const allowedOrigins = [ process.env.LOCALHOST, process.env.ALL_NETWORKS ]

// Create CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is included in the allowedOrigins array or 
    // if it's undefined (which happens with same-origin requests).
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request.
    } else {
      callback(new Error("Not allowed by CORS")); // Deny the request.
    }
  },
  credentials: true, // Allow cookies to be sent along with the request.
  exposedHeaders: ['Set-Cookie'], // Expose the Set-Cookie header to the client.
  optionsSuccessStatus: 200, // Sets the status code for successful OPTIONS requests.
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // HTTP methods allowed for CORS requests.
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in the request.
};

// Configure CORS middleware using the corsOptions object.
app.use(cors(corsOptions));

// Logging middleware: Log HTTP requests to the console in a development-friendly format.
app.use(logger('dev'));

// Parse incoming JSON requests.
app.use(bodyParser.json());

// Set up body-parser middleware to parse URL-encoded request bodies.
app.use(bodyParser.urlencoded({ extended: true }));

// Parse cookies attached to the HTTP requests.
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Use the router.
app.use("/", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;