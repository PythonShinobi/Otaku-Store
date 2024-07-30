// client/src/redux/hooks.js

// `hooks.js` provides a reusable mechanism to fetch user data asynchronously, manage authentication 
// state, and handle redirection based on authentication status within your React application.

import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import config from "../config";

// Fetcher function to fetch user data from the given URL and return a user object.
const fetcher = async (url) => {
  try {
    // Make an HTTP GET request using axios incuding cookies in the request header.
    // It captures cookies from the browser's cookie storage associated with the requested 
    // domain and appends them to the request headers.
    const response = await axios.get(url, { withCredentials: true });    

    // Extract the user data from the response and return it.
    const user = response.data || null;

    // Check if there are any cookies in the response header and set them manually
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        document.cookie = cookie;

        console.log(document.cookie);
      });
    }

    // Return the user object.
    return { user };
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error fetching user data:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

/**
 * Custom hook to manage user authentication and redirection logic.
 * @param {Object} options - Options object.
 * @param {string} options.redirectTo - Path to redirect if user is not authenticated.
 * @param {boolean} options.redirectIfFound - Redirect if user is already authenticated.
 * @returns {Object|null} The user object if authenticated and data fetch successful, or null if there's an error or user is not authenticated.
 */
export const useUser = ({ redirectTo, redirectIfFound } = {}) => {
  const navigate = useNavigate();

  // Use the SWR hook to fetch user data from the /user endpoint.
  const { data, error } = useSWR(`${config.serverEndpoint}/user`, fetcher);
  const user = data?.user;  // Extract user data from the response.
  console.log(user)
  const finished = Boolean(data);  // Check if the data fetching is complete.
  const hasUser = Boolean(user);  // Check if a user is present.  

  // useEffect hook to handle redirection based on the user's authentication status.
  useEffect(() => {
    // If redirectTo is not set or data fetching is not finished, do nothing.
    if (!redirectTo || !finished) return;

    // Redirect logic:
    // If redirectTo is set, redirect if the user was not found.
    if (
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found.
      (redirectIfFound && hasUser)
    ) {
      navigate(redirectTo); // Redirect to the specified path.
    }
  }, [redirectTo, redirectIfFound, finished, hasUser, navigate]);

  // Return the user data if no error occurred, otherwise return null.
  return error ? null : user;
};
