// client/src/components/Form.js
import { Link as RouterLink } from "react-router-dom";
import { Button, TextField, Typography, Box, Link } from "@mui/material";

// Define the Form component, which receives props: isLogin, errorMessage, and onSubmit.
const Form = ({ isLogin, errorMessage, successMessage, onSubmit }) => (
  <Box
    component="form"
    onSubmit={onSubmit}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '400px',
      margin: '0 auto',
    }}
  >
    {/* Username input field */}
    <TextField
      label="Username"
      name="username"
      type="text"
      variant="outlined"
      margin="normal"
      required
    />    

    {/* Conditional rendering for the email field (shown only if not in login mode) */}
    {!isLogin && (
      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        margin="normal"
        required
      />
    )}

    {/* Password input field */}
    <TextField
      label="Password"
      name="password"
      type="password"
      variant="outlined"
      margin="normal"
      required
    />

    {/* Conditional rendering for the repeat password field (shown only if not in login mode) */}
    {!isLogin && (
      <TextField
        label="Repeat Password"
        type="password"
        name="rpassword"
        variant="outlined"
        margin="normal"
        required
      />
    )}

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
      }}
    >
      {/* Conditional rendering for login or signup mode */}
      {isLogin ? (
        <>
          <Link component={RouterLink} to="/register">
            I don't have an account
          </Link>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </>
      ) : (
        <>
          <Link component={RouterLink} to="/login">
            I already have an account
          </Link>
          <Button type="submit" variant="contained" color="primary">
            Signup
          </Button>
        </>
      )}
    </Box>

    {/* Conditional rendering for displaying error messages */}
    {errorMessage && (
      <Typography color="error" variant="body2" sx={{ mt: 2 }}>
        {errorMessage}
      </Typography>
    )}

    {/* Conditional rendering for displaying success messages */}
    {successMessage && (
      <Typography style={{ color: "green" }} variant="body2" sx={{ mt: 2 }}>
        {successMessage}
      </Typography>
    )}
  </Box>
);

// Export the Form component as the default export
export default Form;