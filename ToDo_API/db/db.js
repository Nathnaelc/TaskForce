// Load environment variables from a .env file
require("dotenv").config();

// Import the Pool class from the pg package
const { Pool } = require("pg");

// The number of salt rounds for bcrypt hashing
const BYCRYPT_SALT_ROUNDS = 10;

/**
 * Returns the database URL based on environment variables or default values.
 * @returns {{connectionString: string, ssl: {rejectUnauthorized: boolean}}}
 */
function getDatabaseUrl() {
  // Get the database user from the DATABASE_USER environment variable or use "postgres" as the default
  const dbUser = process.env.DATABASE_USER || "postgres";

  // Get the database password from the DATABASE_PASS environment variable or use "postgres" as the default
  const dbPassword = process.env.DATABASE_PASS
    ? encodeURI(process.env.DATABASE_PASS)
    : "postgres";

  // Get the database host from the DATABASE_HOST environment variable or use "localhost" as the default
  const dbHost = process.env.DATABASE_HOST || "localhost";

  // Get the database port from the DATABASE_PORT environment variable or use 5432 as the default
  const dbPort = process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : 5432;

  // Get the database name from the DATABASE_NAME environment variable or use "todo_app" as the default
  const dbName = process.env.DATABASE_NAME || "todo_app";

  // Return an object with the database URL and SSL options
  return {
    connectionString: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
    ssl: { rejectUnauthorized: false },
  };
}

// Create a new Pool object with the database URL from getDatabaseUrl
const pool = new Pool({
  connectionString: getDatabaseUrl().connectionString,
});

// Log the database URL to the console
console.log("Database URL: " + getDatabaseUrl().connectionString);
console.log(
  "Environment Variables:",
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,
  process.env.DATABASE_HOST,
  process.env.DATABASE_PORT,
  process.env.DATABASE_NAME
);

// Export the BYCRYPT_SALT_ROUNDS constant, getDatabaseUrl function, pool object, and query function
module.exports = {
  BYCRYPT_SALT_ROUNDS,
  getDatabaseUrl,
  pool,
  query: (text, params) => pool.query(text, params),
};
