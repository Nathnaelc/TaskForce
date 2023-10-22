// server.js
// Importing required modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const debug = require("debug");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/db.js");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");

// Creating an express application
const app = express();

// Enabling Cross-Origin Resource Sharing (CORS) with configuration
const corsOptions = {
  origin: ["http://localhost:5173"], // Update with the frontend app's port
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Setting up morgan for logging HTTP requests
app.use(morgan("dev"));

// Enabling express to parse JSON bodies from HTTP requests
app.use(express.json());

// Enabling express to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todos", todoRoutes);

const listRoutes = require("./routes/listRoutes");
app.use("/api/lists", listRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.toString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🚀`);
});
