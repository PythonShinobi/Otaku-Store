// server/api/auth/passport-local.js

// In the `password-local.js` file, the strategy is created and takes care of finding a user based off of 
// their username and validating their password. If a user object is found it will be returned via the 
// `done callback`. If not, an error will be thrown.

import Local from "passport-local";
import bcrypt from "bcrypt";

import { findUser } from "./user.js";

/**
 * This code defines a local authentication strategy using Passport.js.
 * It verifies a user's username and password against the stored user data.
 * 
 * - The `localStrategy` is an instance of `Local.Strategy`.
 * - It asynchronously checks the username and password provided during login.
 * 
 * 1. It tries to find a user with the given username using the `findUser` function.
 * 2. If the user is not found, it calls `done` with `false` and an appropriate message.
 * 3. If the user is found, it compares the provided password with the stored password using bcrypt.
 * 4. If the password is invalid, it calls `done` with `false` and an appropriate message.
 * 5. If the password is valid, it calls `done` with the user object.
 * 6. If any error occurs during the process, it passes the error to `done`.
 * 
 * This strategy is used in conjunction with Passport.js to authenticate users locally
 * by validating their username and password.
 */
const localStrategy = new Local.Strategy(async (username, password, done) => {
  try {
    const user = await findUser({ username });
    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: "Invalid password" });
    }

    // If authentication is successful, return the user object via done.
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export default localStrategy;