import path from "path";
import fs from "fs";
import mysql from "mysql2/promise";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES6
const __dirname = dirname(fileURLToPath(import.meta.url));

// Database credentials (adjust if needed)
const DB_HOST = "localhost";
const DB_USER = "root"; // Change if using a different user
const DB_PASSWORD = "Kiril123!@#"; // Change if your MySQL has a password
const DB_NAME = "eCommerce_test";

// Path to the SQL seed file
const SQL_FILE_PATH = path.resolve(__dirname, "../../src/seed/demo_db.sql");

// Function to seed the test database
const seedDatabase = async () => {
  let connection;

  try {
    // Connect to MySQL (without specifying a database)
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });

    console.log("Connected to MySQL server...");

    // Drop and recreate the test database
    await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
    console.log(`Database '${DB_NAME}' dropped (if existed).`);

    await connection.query(`CREATE DATABASE ${DB_NAME};`);
    console.log(`Database '${DB_NAME}' created.`);

    await connection.query(`USE ${DB_NAME};`);
    console.log(`Switched to database '${DB_NAME}'.`);

    // Read the SQL file
    const sqlFileContent = fs.readFileSync(SQL_FILE_PATH, "utf8");

    // Split SQL commands and remove empty ones
    const sqlQueries = sqlFileContent
      .split(";")
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    console.log(`Executing ${sqlQueries.length} SQL queries...`);

    // Execute each query sequentially
    for (let query of sqlQueries) {
      if (query.toLowerCase().startsWith("use ")) continue; // Skip "USE" statements
      await connection.query(query);
      console.log("Executed query:", query.split("\n")[0]); // Show the first line of each query
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
};

// Run the seeding function
seedDatabase();
