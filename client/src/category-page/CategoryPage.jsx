// client/src/category/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Grid, Card, CardMedia, CardContent, Fab } from "@mui/material";
import Skeleton from 'react-loading-skeleton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import "./CategoryPage.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import config from "../config";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button  

  useEffect(() => {
    // Scroll to the top of the page when the component mounts.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);  

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/products/category/${category}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error.message);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [category]);

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="category-page-container">
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          {loading ? <Skeleton width={200} /> : category}
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
            products.map((product) => (
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

export default CategoryPage;