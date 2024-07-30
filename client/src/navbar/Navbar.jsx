// client/src/navbar/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';

import "./Navbar.css";
import { useUser } from "../redux/hooks";
import { clearCart } from "../redux/action";
import config from "../config";

const Navbar = () => {
  const cartItemsCount = useSelector(state => state.handleCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useUser(); // Use the useUser hook to get the current user
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Logout a user.
  const handleLogout = async () => {
    try {
      await axios.get(`${config.serverEndpoint}/logout`, { withCredentials: true });
      dispatch(clearCart());  // Clear items from the cart when user logs out.
      navigate('/'); // Redirect to home page after logout.
      window.location.href = "/"; // Redirect to home page immediately.
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // console.log("User object:", user?.isadmin);
  // console.log("User object:", user?.username);
  // console.log("User object:", user?.email);

  // Show a logged in user their profile.
  const showProfile = async () => {
    navigate("/profile");
  };

  const drawerItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItem component={NavLink} to="/">
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Home" />
        </ListItem>
        <ListItem component={NavLink} to="/products">
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Products" />
        </ListItem>
        <ListItem component={NavLink} to="/about">
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="About" />
        </ListItem>
        <ListItem component={NavLink} to="/contact">
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Contact" />
        </ListItem>
        {!user && (
          <>
            <ListItem component={NavLink} to="/login">
              <LoginIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Login" />
            </ListItem>
            <ListItem component={NavLink} to="/register">
              <HowToRegIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Register" />
            </ListItem>
          </>
        )}
        {user && (
          <>
            {user?.isadmin && (
              <ListItem component={NavLink} to="/admin">
                <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Add Items" />
              </ListItem>
            )}
            <ListItem onClick={showProfile}>
              <AccountCircleIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary={`Hi ${user?.username}`} />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <PersonIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Logout" />
            </ListItem>
          </>
        )}
        <ListItem component={NavLink} to="/cart">
          <ShoppingCartIcon sx={{ mr: 1, color: "black" }} />
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary={`Cart (${cartItemsCount.length})`} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" className="navbar">
      <Container>
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={NavLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Otaku-Store
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button component={NavLink} to="/" color="inherit" activeClassName="active">
              Home
            </Button>
            <Button component={NavLink} to="/products" color="inherit" activeClassName="active">
              Products
            </Button>
            <Button component={NavLink} to="/about" color="inherit" activeClassName="active">
              About
            </Button>
            <Button component={NavLink} to="/contact" color="inherit" activeClassName="active">
              Contact
            </Button>
            {user && user?.isadmin && ( // Show "Add Items" in Toolbar for admin
              <Button component={NavLink} to="/admin" color="inherit" sx={{ ml: 2 }} activeClassName="active">
                Add Items
              </Button>
            )}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {!user && (
              <>
                <Button component={NavLink} to="/login" color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <LoginIcon sx={{ mr: 1, color: "black" }} />
                  Login
                </Button>
                <Button component={NavLink} to="/register" color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <HowToRegIcon sx={{ mr: 1, color: "black" }} />
                  Register
                </Button>
              </>
            )}
            {user && (
              <>
                <Button onClick={showProfile} color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <AccountCircleIcon sx={{ mr: 1, color: "black" }} />
                  Hi, {user?.username}
                </Button>
                <Button onClick={handleLogout} color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <PersonIcon sx={{ mr: 1 }} />
                  Logout
                </Button>
              </>
            )}
            <Button component={NavLink} to="/cart" color="inherit" sx={{ m: 1 }} activeClassName="active">
              <ShoppingCartIcon sx={{ mr: 1 }} />
              Cart ({cartItemsCount.length})
            </Button>
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerItems}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;