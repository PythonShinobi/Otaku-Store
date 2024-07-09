// client/src/redux/store.js

// Initialize the Redux store and makes it available for use throughout the application.

import { configureStore } from "@reduxjs/toolkit";

import rootReducers from "./reducer";

const store = configureStore({ reducer: rootReducers });

export default store;