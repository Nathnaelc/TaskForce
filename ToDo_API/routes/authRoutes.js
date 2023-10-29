// Desc: This file contains the routes for user registration and login
// Path: ToDo_API/routes/authRoutes.js
// import express and create a router
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../db/db");
const { BYCRYPT_SALT_ROUNDS } = require("../db/db");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback-secret-key";

/**
 * Endpoint for handling user registration
 * @param {string} email - The email of the user to be registered
 * @param {string} password - The password of the user to be registered
 * @param {string} fullName - The full name of the user to be registered
 * @returns {object} - A JSON object containing a message, user data, and token
 */
router.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // using bcrypt to hash the password before storing
    const salt = await bcrypt.genSalt(BYCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    // query for adding the user to the database
    const createUserQuery = `INSERT INTO users (
          email,
          password,
          full_name
        )
        VALUES ($1, $2, $3) RETURNING *;`;
    const values = [email.toLowerCase(), hashedPassword, fullName];
    const result = await pool.query(createUserQuery, values);
    const user = result.rows[0];

    // JWT (JSON Web Token) is used for authentication. The token includes the user details
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // Returning a successful registration response along with the user data and token
    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
      token: token,
    });
  } catch (err) {
    console.log("Error registering user: " + err);
    res.status(500).json({
      message: "Error registering user",
      error: err.stack,
    });
  }
});

/**
 * Endpoint for handling user login using email and password
 * @param {string} email - The email of the user attempting to log in
 * @param {string} password - The password of the user attempting to log in
 * @returns {object} - A JSON object containing a token and user data
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUserQuery = `SELECT * FROM users WHERE email = $1`;
  try {
    const result = await pool.query(getUserQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      // If the user is not found, return an error message
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // If the password is incorrect, return an error message
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    // JWT (JSON Web Token) is used for authentication. The token includes the user details
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // Return a successful login response along with the user data and token
    res.status(200).json({
      token: token,
      user: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
      },
    });
  } catch (err) {
    console.log("Error logging in user:", err);
    res.status(500).json({
      message: "Error logging in user",
      error: err.stack,
    });
  }
});

// export the router
module.exports = router;
