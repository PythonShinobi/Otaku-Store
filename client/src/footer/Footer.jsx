// client/src/footer/Footer.jsx
import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          mb: 0,
          pb: 5,
          borderTop: "1px solid #ddd",
          pt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Made by{" "}
              <Link
                href="https://github.com/PythonShinobi"
                underline="hover"
                color="inherit"
                target="_blank"
                rel="noreferrer"
                fontSize="1.25rem"
              >
                Philip
              </Link>
            </Typography>
            <IconButton
              href="https://github.com/PythonShinobi"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              <GitHubIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Footer;