// client/src/product/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch } from "react-redux";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { addCart } from "../redux/action";
import { useUser } from "../redux/hooks"; // Import useUser hook to check user's authentication status
import config from "../config";
import SearchBar from "../search-bar/SearchBar"; // Import SearchBar component

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // State to store products fetched from the API
  const [filter, setFilter] = useState("All"); // State to store the current filter category
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [originalProducts, setOriginalProducts] = useState([]); // State to store the original list of products
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products based on search term

  const dispatch = useDispatch();  // Get the dispatch function from the Redux store.
  const user = useUser(); // Get the user object from Redux store

  const addProduct = (product) => {
    // Dispatch an action to add the product to the cart, only if user is authenticated
    if (user) {
      dispatch(addCart(product));
    } else {
      // Optionally handle not authenticated action (e.g., show a message or redirect)
      console.log("User not authenticated. Redirecting to login page.");
      // Redirect user to login page or show a message
    }
  };

  useEffect(() => {
    // Function to fetch products from the API
    const fetchProducts = async () => {
      try {
        // Fetch products from the API
        const response = await axios.get(`${config.serverEndpoint}/products`);
        console.log(response.data);
        // Update state with fetched products and original products
        setProducts(response.data);
        setOriginalProducts(response.data);
        setFilteredProducts(response.data);
        // Set loading state to false after fetching products
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set loading state to false if there's an error fetching products
        setLoading(false);
      }
    };
    // Call fetchProducts function when the component mounts
    fetchProducts();
  }, []);

  // Function to filter products based on the selected category
  const filterProducts = (category) => {
    // Update the filter state
    setFilter(category);
    // Filter products based on the selected category
    if (category === "All") {
      // If the category is "All", set products to the original list of products
      setFilteredProducts(originalProducts);
    } else {
      // Otherwise, filter the original products based on the selected category
      const filtered = originalProducts.filter(product => product.category === category);
      // Update products state with the filtered list
      setFilteredProducts(filtered);
    }
  };

  // Function to handle scrolling to the top of the page
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Function to handle showing/hiding the Back to Top button based on scroll position
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when component mounts
    window.addEventListener('scroll', handleScroll);
    // Clean up: remove scroll event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to delete a product by ID.
  const deleteProduct = async (productId) => {
    try {
      // Make DELETE request to delete product by ID
      await axios.delete(`${config.serverEndpoint}/products/${productId}`);
      // Filter out the deleted product from the state
      const updatedProducts = products.filter(product => product.id !== productId);
      // Update state with the updated products list
      setProducts(updatedProducts);
      // Optionally: show a success message or handle UI update
      console.log(`Product with ID ${productId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Optionally: handle error state or show error message
    }
  };

  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // JSX rendering
  return (
    <div className="products-container">
      <Navbar />
      <Container>
        <SearchBar onSearch={handleSearch} /> {/* Add the SearchBar component */}
        
        <div style={{ marginBottom: '20px' }}>
          {/* Filter buttons */}
          <Button onClick={() => filterProducts("All")} variant={filter === "All" ? "contained" : "outlined"}>All</Button>
          <Button onClick={() => filterProducts("HOODIES")} variant={filter === "HOODIES" ? "contained" : "outlined"}>Hoodies</Button>
          <Button onClick={() => filterProducts("LED-LAMPS")} variant={filter === "LED-LAMPS" ? "contained" : "outlined"}>LED Lamps</Button>
          <Button onClick={() => filterProducts("ACCESSORIES")} variant={filter === "ACCESSORIES" ? "contained" : "outlined"}>Accessories</Button>
          <Button onClick={() => filterProducts("SHOES")} variant={filter === "SHOES" ? "contained" : "outlined"}>Shoes</Button>
          <Button onClick={() => filterProducts("COSPLAY")} variant={filter === "COSPLAY" ? "contained" : "outlined"}>Cosplay</Button>
          <Button onClick={() => filterProducts("T-SHIRT")} variant={filter === "T-SHIRT" ? "contained" : "outlined"}>T-shirts</Button>
        </div>
        
        {/* Grid to display products */}
        <Grid container spacing={4}>
          {loading
            // If loading, display skeleton loaders
            ? Array(4)
                .fill()
                .map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <Skeleton height={140} />
                      <CardContent>
                        <Skeleton count={3} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            // If not loading, display products
            : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                      {/* Product image */}
                      <CardMedia
                        component="img"
                        height="350"
                        image={product.image}
                        alt={product.name}
                        style={{ objectFit: 'cover', width: '100%' }}
                      />
                      {/* Product details */}
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {product.name.substring(0, 23)}...
                        </Typography>                    
                        {/* Action buttons */}
                        <div className="d-flex justify-content-between mt-2">
                          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary">
                              Buy Now
                            </Button>
                          </Link>
                          {user && user?.isadmin && ( // Only show delete button if user is admin
                            <Button 
                              variant="outlined" 
                              color="secondary" 
                              onClick={() => deleteProduct(product.id)} 
                              style={{ marginLeft: '10px' }}
                            >
                              Delete
                            </Button>
                          )}
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => addProduct(product)} 
                            disabled={!user} // Disable button if user is not authenticated
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            ) : (
              // Display message if no products match the search term
              <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
                No products found with "{searchTerm}"
              </Typography>
            )
          }
        </Grid>

        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="back-to-top">
            <Fab color="primary" size="large" onClick={handleScrollToTop}>
              <KeyboardArrowUpIcon />
            </Fab>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default ProductsPage;
