require("dotenv").config();
const { Pool } = require("pg");
const BYCRYPT_SALT_ROUNDS = 10;

function getDatabaseUrl() {
  const dbUser = process.env.DATABASE_USER || "postgres";
  const dbPassword = process.env.DATABASE_PASS
    ? encodeURI(process.env.DATABASE_PASS)
    : "postgres";
  const dbHost = process.env.DATABASE_HOST || "localhost";
  const dbPort = process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : 5432;
  const dbName = process.env.DATABASE_NAME || "todo_app";

  return {
    connectionString: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
    ssl: { rejectUnauthorized: false },
  };
}

const pool = new Pool({
  connectionString: getDatabaseUrl().connectionString,
});
console.log("Database URL: " + getDatabaseUrl().connectionString);

module.exports = {
  BYCRYPT_SALT_ROUNDS,
  getDatabaseUrl,
  pool,
  query: (text, params) => pool.query(text, params),
};
