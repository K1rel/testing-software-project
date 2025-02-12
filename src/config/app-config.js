// Import native 'node.js' modules
import path from "path";

// Import dependencies
import {} from "dotenv/config.js";
import mysql from 'mysql2';


// Application port for express
const APP_PORT = process.env.APP_PORT;

// Views folder path
const VIEWS = path.resolve(process.cwd(), "src", "views");

// Salt rounds for password encryption
const SALT_ROUNDS = process.env.SALT_ROUNDS;

// Secrets
const isTest = process.env.NODE_ENV === 'test';
// Database credentials
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;


// Create connection
const con = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: isTest ? process.env.TEST_DB_NAME : "eCommerce",
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: "utf8mb4" 
});

const con_createDb = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD
  
});

// MySQL Session
let options = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: isTest ? process.env.DB_DATABASE : DB_DATABASE
}

// Cookie name and secret
const cookie = {
  name: process.env.COOKIE_NAME,
  secret: process.env.COOKIE_SECRET
}

// Export all constants
export {
  APP_PORT,
  VIEWS,
  SALT_ROUNDS,
  con,
  con_createDb,
  options,
  cookie
};

