// client/src/product/ProductsDetailsPage.jsx
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./styles.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { addCart } from "../redux/action";
import { useUser } from "../redux/hooks"; // Import useUser hook to check user's authentication status
import config from "../config";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilarProducts, setLoadingSimilarProducts] = useState(true);

  const dispatch = useDispatch();
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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    // Function to fetch similar products based on category
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/products/category/${product.category}`);
        setSimilarProducts(response.data);
        setLoadingSimilarProducts(false);
      } catch (error) {
        console.error('Error fetching similar products:', error);
        setLoadingSimilarProducts(false);
      }
    };
    
    fetchProduct();
    fetchSimilarProducts();
  }, [id, product]);

  if (loading || !product) { // Added !product to handle initial loading state
    return (
      <Container>
        <Skeleton height={400} />
        <Skeleton count={3} style={{ marginBottom: '20px' }} />
        <Skeleton count={3} style={{ marginBottom: '20px' }} />
      </Container>
    );
  }

  return (
    <div className="products-details-container">
      <Navbar />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="550"
              image={product.image}
              alt={product.name}
              style={{ objectFit: 'cover', width: '100%', border: '1px solid #ccc' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography gutterBottom variant="h4">{product.name}</Typography>
                <Typography variant="h6">KSh {product.price}</Typography>
                <Typography variant="body1">{product.description}</Typography>
                <Typography variant="body2">Rating: {product.rating.rate} ({product.rating.count} reviews)</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => addProduct(product)}
                  disabled={!user} // Disable button if user is not authenticated
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Similar Products */}
        <Typography 
          variant="h5" 
          gutterBottom 
          style={{ marginTop: '50px', marginBottom: '20px', fontSize: '2rem' }}
          >
            You may also like
        </Typography>
        {loadingSimilarProducts ? (
          <Skeleton height={200} count={4} />
        ) : (
          <Marquee
            pauseOnHover={true}
            pauseOnClick={true}
            speed={50}
          >
            {similarProducts
              .filter(similarProduct => similarProduct.id !== product.id) // Filter out the current product
              .map(similarProduct => (
                <Card key={similarProduct.id} style={{ width: '200px', margin: '0 10px' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={similarProduct.image}
                    alt={similarProduct.name}
                    style={{ objectFit: 'cover', width: '100%' }}
                  />
                  <CardContent style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <Typography variant="body1" gutterBottom>{similarProduct.name.substring(0, 32)}...</Typography>
                    <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>KSh {similarProduct.price}</Typography>
                    <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                      <Link to={`/products/${similarProduct.id}`} onClick={() => window.scrollTo(0, 0)}>
                        <Button variant="contained" color="primary">
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </Marquee>
        )}

      </Container>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;