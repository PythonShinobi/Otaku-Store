// server/api/db.js
import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the database');
  }
});

export default db;