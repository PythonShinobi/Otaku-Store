// server/api/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import env from "dotenv";

env.config();

// Configure Cloudinary with credentials.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/**
 * Checks the connection to Cloudinary by pinging its API.
 * Logs whether the connection is successful or if there's an error.
 */
const checkCloudinaryConnection = () => {
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error(`Could not connect to Cloudinary: ${error}`);
    } else {
      console.log(`Connected to Cloudinary`);
    }
  });
};

checkCloudinaryConnection();

export default cloudinary;