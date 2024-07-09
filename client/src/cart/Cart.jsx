// client/src/cart/Cart.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Container, Typography, Grid, Card, CardContent, CardMedia, Divider, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

import './Cart.css';
import Navbar from "../navbar/Navbar";
import { addCart, delCart, removeCart } from "../redux/action";
import config from "../config";

const Cart = () => {
  const cart = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => (
    <Container className="empty-cart" sx={{ py: 5, textAlign: 'center', bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="div" gutterBottom>Your Cart is Empty</Typography>
      <Button variant="outlined" component={Link} to="/products">
        <i className="fa fa-arrow-left" /> Continue Shopping
      </Button>
    </Container>
  );

  const addItem = (product) => dispatch(addCart(product));
  const removeItem = (product) => dispatch(delCart(product));
  const deleteCartItem = (product) => dispatch(removeCart(product)); // New function to remove item in cart completely.

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    cart.forEach((product) => {
      subtotal += product.price * product.qty;
      totalItems += product.qty;
    });

    return (
      <Container sx={{ py: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((product) => (
              <Card key={product.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={4} md={3}>
                      <CardMedia
                        component="img"
                        alt={product.name}
                        height="240"                        
                        image={`${config.serverEndpoint}/uploads/${product.image}`}
                        title={product.name}
                      />
                    </Grid>
                    <Grid item xs={8} md={9}>
                      <Typography variant="h6" component="div">{product.name}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <IconButton onClick={() => removeItem(product)}>
                            <Remove />
                          </IconButton>
                          <Typography variant="body1" component="span">{product.qty}</Typography>
                          <IconButton onClick={() => addItem(product)}>
                            <Add />
                          </IconButton>
                          <IconButton onClick={() => deleteCartItem(product)} sx={{ color: 'red' }}>
                            <Delete />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" component="div">${product.price} x {product.qty}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">Order Summary</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" component="div">Products ({totalItems}): ${Math.round(subtotal)}</Typography>
                <Typography variant="body1" component="div">Shipping: ${shipping}</Typography>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  Total: ${Math.round(subtotal + shipping)}
                </Typography>
                <Button variant="contained" color="primary" fullWidth component={Link} to="/checkout" sx={{ mt: 2 }}>
                  Go to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

  return (
    <div className="cart-container">
      <Navbar />
      <Container className="cart-page" sx={{ mt: 3 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Cart
        </Typography>
        <Divider />
        {cart.length > 0 ? <ShowCart /> : <EmptyCart />}
      </Container>      
    </div>
  );
};

export default Cart;