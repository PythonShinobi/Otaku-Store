// client/src/home/Home.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Fab } from "@mui/material";
import { Carousel } from "react-bootstrap";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import "./Home.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import config from "../config"

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button

  useEffect(() => {
    // Scroll to the top of the page when the component mounts.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/products`);
        const productsData = response.data;
        setProducts(productsData);

        // Extract unique categories from the products, trimming whitespace.
        //  Since `Set` only keeps unique values, any duplicate categories,
        // (even if they differ by whitespace) are automatically removed.
        // The unique, trimmed categories are then converted back to an array using the 
        // spread operator (...) and stored in the categories state.
        const uniqueCategories = [...new Set(productsData.map(product => product.category.trim()))];
        setCategories(uniqueCategories);

        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle scrolling to the top of the page.
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Function to handle showing/hiding the Back to Top button based on scroll position.
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <Container>
        <div className="hero-section">
          {loading ? (
            <Skeleton height={800} style={{ marginBottom: "20px" }} />
          ) : (
            <Carousel>
              {products.map((product) => (
                <Carousel.Item key={product.id}>
                  <img
                    className="d-block w-100"
                    src={product.image}
                    alt={product.name}
                    style={{ maxHeight: "800px", objectFit: "cover", objectPosition: "top" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>

        {/* Categories Section */}
        {loading ? (
          <Skeleton height={50} style={{ marginBottom: "20px" }} />
        ) : (
          categories.map((category) => (
            <CategorySection key={category} category={category} />
          ))
        )}

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

// Component for rendering products within a specific category.
const CategorySection = ({ category }) => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state.

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/products/category/${category}`);
        setCategoryProducts(response.data);
        setLoading(false); // Set loading to false when data is fetched.
      } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error.message);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <>
      <div className="category-section" style={{ marginBottom: "50px" }}>
        <Typography variant="h4" gutterBottom>
          {loading ? (
            <Skeleton width={200} />
          ) : (
            <Typography variant="h4" component="div" className="category-title-link">
              <NavLink                 
                to={`/category/${category}`}                 
                style={{ textDecoration: 'none', color: 'inherit' }} 
              >
                {category}
              </NavLink>
            </Typography>
          )}
        </Typography>
        <Grid container spacing={4}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} className="product-grid-item">
                <Card className="product-card" style={{ height: "100%" }}>
                  <Skeleton height={370} />
                </Card>
              </Grid>
            ))
          ) : (
            categoryProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} className="product-grid-item">
                <Card className="product-card" style={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="370"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {product.name}
                    </Typography>                  
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>      
      </div>
    </>
  );
};

export default Home;