// client/src/admin/AdminForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Grid } from "@mui/material";

import "./AdminForm.css";
import config from "../config";

const AdminForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    rating: { rate: "", count: "" },
  });

  // Store the server's response after a successful product addition.
  const [response, setResponse] = useState(null);

	const handleChange = (e) => {
    // Destructure the 'name' and 'value' properties from the event target.
    const { name, value } = e.target;
  
    // Check if the input field is for 'rate' or 'count'
    if (name === "rate" || name === "count") {
      // If the input field is for 'rate' or 'count', update the 'rating' object in the form data.
      setFormData((prevState) => ({
        ...prevState,
        rating: { ...prevState.rating, [name]: value }, // Update the 'rate' or 'count' property in the 'rating' object.
      }));
    } else {
      // If the input field is not for 'rate' or 'count', update the form data directly.
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // Update the corresponding property in the form data.
      }));
    }
  };  

	// The `handleImageChange` function is separate from the rest because file inputs 
	// in HTML work differently from text inputs.
	const handleImageChange = (e) => {
    // Update the form data with the selected image file.
    setFormData((prevState) => ({
      ...prevState, // Preserve the previous state.
      image: e.target.files[0], // Contains an array-like object with a single file object at index 0.
    }));
  };

	const handleSubmit = async (e) => {
		e.preventDefault();

    // Ensure 'name' is not empty before submitting
    if (!formData.name.trim()) {
      alert("Name field is required");
      return;
    }

		// Handles file uploads along with regular form fields, encoding the form 
		// correctly for the server to process.
		const data = new FormData();
		data.append("name", formData.name);
		data.append("description", formData.description);
		data.append("price", formData.price);
		data.append("category", formData.category);
		data.append("image", formData.image);
		data.append("rating", JSON.stringify(formData.rating));

		console.log(data);

		try {
			const response = await axios.post(`${config.serverEndpoint}/add-product`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
			if (response.status === 200) {
			  setResponse(response.data);
        // Clear the form data upon successful submission
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
          rating: { rate: "", count: "" },
        });
			} else {
			  alert("Failed to add Product❌");
			}
		  } catch (error) {
			  console.error(`Error: ${error}`);
			  alert("Failed to add Product❌");
		  }
	};

	return (
    <div className="admin-container">
		  <Container maxWidth="md">
		  	<h1>Add Product</h1>
		  	<form onSubmit={handleSubmit}>
		  		<Grid container spacing={2}>
		  			<Grid item xs={12}>
		  			<TextField 
		  				fullWidth
		  				label="Name"
		  				name="name"
		  				value={formData.name}
		  				onChange={handleChange}
		  				required
		  			/>
		  			</Grid>
		  			<Grid item xs={12}>
		  			<TextField 
		  				fullWidth
		  				multiline
		  				rows={4}
		  				label="Description"
		  				name="description"
		  				value={formData.description}
		  				onChange={handleChange}
		  				required
		  			/>
		  			</Grid>
		  			<Grid item xs={12}>
		  			<TextField
		  				fullWidth
		  				label="Price"
		  				name="price"
		  				value={formData.price}
		  				onChange={handleChange}
		  				required
		  			/>
		  			</Grid>
		  			<Grid item xs={12}>
		  			<TextField 
		  				fullWidth
		  				label="Category"
		  				name="category"
		  				value={formData.category}
		  				onChange={handleChange}
		  				required
		  			/>
		  			</Grid>
		  			<Grid item xs={12}>
		  				<TextField 
		  					fullWidth
		  					label="Rating Rate"
		  					name="rate"
		  					value={formData.rating.rate}
		  					onChange={handleChange}
		  					required
		  				/>
		  			</Grid>
		  			<Grid item xs={12}>
		  				<TextField 
		  					fullWidth
		  					label="Rating Count"
		  					name="count"
		  					value={formData.rating.count}
		  					onChange={handleChange}
		  					required
		  				/>
		  			</Grid>
		  			<Grid item xs={12}>
		  				<input 
		  					type="file"
		  					name="image"
		  					onChange={handleImageChange}
		  					accept="image/*"
		  					required
		  				/>
		  			</Grid>
		  			<Grid item xs={12}>
		  				<Button variant="contained" color="primary" type="submit">
		  					Add Product
		  				</Button>
		  			</Grid>
		  		</Grid>
		  	</form>

		  	{response && (
		  		<div className="json-response">            
		  			<h3>Product Added</h3>
		  			<pre>{JSON.stringify(response, null, 2)}</pre>
		  		</div>
		  	)}
		  </Container>
    </div>
	);
};

export default AdminForm;