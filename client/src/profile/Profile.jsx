// client/src/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, Grid, Divider } from '@mui/material';

import "./Profile.css";
import { useUser } from "../redux/hooks";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import config from "../config";

const UserProfile = () => {
  const user = useUser(); // Use the useUser hook to get the current user.
  const [orders, setOrders] = useState([]); // State to hold order items.

  useEffect(() => {
    // Fetch the order items from the backend when the component mounts.
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.serverEndpoint}/orders`, { withCredentials: true });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders to display only those belonging to the logged-in user.
  const userOrders = orders.filter(order => order.user_id === user?.id);

  return (
    <div className="profile-container">
      <Navbar />
      <Container maxWidth="sm">
        <Card className="user-profile-card" sx={{ mt: 5, p: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Account Details
            </Typography>
            <Divider sx={{ borderBottomWidth: 1, mb: 2, bgcolor: 'black' }} />
            <Grid container spacing={2} direction="column" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography variant="h5">
                  {user?.username}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
          Order Items
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {userOrders.map((order, index) => (
            <Grid item xs={12} sm={12} md={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ textAlign: 'center' }}>
                    {order.product_name}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Quantity: {order.quantity}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Price: ${order.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default UserProfile;