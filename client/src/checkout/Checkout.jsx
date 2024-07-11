// client/src/checkout/Checkout.jsx
import React, { useState } from "react";
import axios from "axios";
import { Container, Grid, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./Checkout.css";
import Navbar from "../navbar/Navbar";
import { clearCart } from "../redux/action";
import { useUser } from "../redux/hooks";
import config from "../config";

/**
 * Checkout Component
 * 
 * This component handles the checkout process for users on the e-commerce platform. It allows users to enter their
 * shipping information, including first name, last name, email, address, city, and postal code. The component also 
 * ensures that the email entered matches the email of the currently logged-in user to avoid errors and confusion.
 * 
 * Features:
 * - Displays a form for users to enter their shipping information.
 * - Validates that the entered email matches the logged-in user's email.
 * - Displays a success message upon successful order placement and redirects the user to the home page.
 * - Displays an error message if the email entered is incorrect or if there is an issue placing the order.
 * - Clears the cart upon successful order placement.
 * 
 * Dependencies:
 * - React, useState, useNavigate from "react-router-dom"
 * - Axios for making HTTP requests
 * - MUI components: Container, Grid, TextField, Button, Typography, Card, CardContent
 * - React-Redux for state management
 * - A Navbar component
 * - A Redux action for clearing the cart
 * - Configuration for the server endpoint
 * 
 * Usage:
 * - This component should be used within the context of a user who is logged in and ready to complete their purchase.
 * - The component assumes that the cart items and user information are managed by a Redux store.
 */
const Checkout = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [successMessage, setSuccessMessage] = useState("");  // State for success message.
  const [errorMessage, setErrorMessage] = useState("");  // State for error message.

  const cart = useSelector((state) => state.handleCart); // Get cart items from Redux store.
  const user = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== user?.email) {
      setErrorMessage("The email entered does not match your account email.");
      return;
    }
    
    const orderData = {
      firstName,
      lastName,
      email,
      address,
      city,
      postalCode,
      cartItems: cart.map((item) => ({  // Send all the orders in the cart in a single request.
        id: item.id,
        name: item.name,
        quantity: item.qty,
        price: item.price,
      })), // Add cart items
      // Add additional fields as needed for your backend
    };

    try {
      const checkoutUrl = `${config.serverEndpoint}/checkout`;
      // Send order data to backend API
      const response = await axios.post(checkoutUrl, orderData, { withCredentials: true });
      console.log("Order placed successfully:", response.data);

      if (response.status === 200) {        
        setSuccessMessage("Order placed successfully!"); // Set success message.
        setErrorMessage("");  // Clear the error message.
        dispatch(clearCart());  // Clear items from the cart when order has been placed.
        setTimeout(() => {
          navigate("/"); // Navigate to home page after a delay
        }, 1500); // Delay for 1.5 seconds before redirecting (adjust as needed).
      }    
    } catch (error) {
      console.error("Error placing order:", error);      
      if (error.response && error.response.status === 404) {
        setErrorMessage("Incorrect Email");
      } else {
        setErrorMessage("Error placing order");
      }
    }
  };

  return (
    <div className="checkout-container">
      <Navbar />
      <Container maxWidth="sm">
        <Card className="checkout-card" sx={{ mt: 5, p: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              Checkout
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    variant="outlined"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" color="primary">
                    Place Order
                  </Button>
                </Grid>
                <Grid item xs={12} className="text-center mt-2">
                  <Typography variant="body2">
                    <Link to="/cart">Back to Cart</Link>
                  </Typography>
                </Grid>
              </Grid>
              {/* Display success or error message */}
              {successMessage && <Typography style={{ color: 'green' }}>{successMessage}</Typography>}
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Checkout;