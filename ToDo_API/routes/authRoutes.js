// Router endpoints for handling [login, registration, google login, logout]
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool } = require("../db/db");
const { BYCRYPT_SALT_ROUNDS } = require("../db/db");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback-secret-key";

// Register endpoint for handling user registration
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

// Login endpoint for handling user login using email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUserQuery = `SELECT * FROM users WHERE email = $1`;
  try {
    const result = await pool.query(getUserQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

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

module.exports = router;
