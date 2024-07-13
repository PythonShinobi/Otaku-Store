// server/api/db.js
import pg from "pg";
import env from "dotenv";

env.config();

/**
 * This code initializes a new PostgreSQL client using the `pg` library in Node.js.
 * The client is configured to connect to a PostgreSQL database with credentials 
 * and connection details sourced from environment variables. This setup allows 
 * for secure and flexible database connection management.
 */
const db = new pg.Client({
  connectionString: process.env.POSTGRES_URL
});

db.connect((err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the database');
  }
});

export default db;