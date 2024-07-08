-- server/api/server.sql

-- Create the user table.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  isadmin BOOLEAN NOT NULL DEFAULT FALSE,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the products table.
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50),
  image VARCHAR(255),
  rating JSONB
);

-- Delete all records from the users table.
DELETE FROM users;

-- Reset the id sequence to start from 1.
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Create the orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  postal_code VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

-- Delete all records from the order_items table.
DELETE FROM order_items;

-- Reset the id sequence to start from 1.
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Delete all records from the orders table.
DELETE FROM orders;

-- Reset the id sequence to start from 1.
ALTER SEQUENCE orders_id_seq RESTART WITH 1;