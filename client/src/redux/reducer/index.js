// client/src/redux/reducer/index.js

// Central point for combining multiple reducers into a single root reducer, facilitating organized 
// and efficient state management in Redux applications.
import { combineReducers } from "redux";

import handleCart from "./handleCart";

const rootReducers = combineReducers({ handleCart });

export default rootReducers;