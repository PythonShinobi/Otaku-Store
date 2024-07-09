// client/src/404-page/PageNotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Typography, Button } from '@mui/material';

import "./PageNotFound.css";
import Navbar from "../navbar/Navbar";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              404: Page Not Found
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              The page you are looking for does not exist.
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button component={Link} to="/" variant="outlined" color="primary">
              <i className="fa fa-arrow-left"></i> Go Back to Home
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default PageNotFound;