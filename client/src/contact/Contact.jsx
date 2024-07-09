// client/src/contact/Contact.jsx
import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

import "./Contact.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import config from "../config";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.serverEndpoint}/send-email`, formData, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      alert(response.data);      
      setFormData({       // Clear the form fields
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("There was an error sending the email!", error);
    }
  };

  return (
    <div className="contact-container">
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h2" gutterBottom>Contact Us</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="message"
                name="message"
                label="Message"
                multiline
                rows={6}
                variant="outlined"
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Footer />
    </div>
  );
};

export default ContactPage;