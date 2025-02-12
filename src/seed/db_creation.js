// Import native 'node.js' modules
import path from "path";
import fs from "fs";

// Import db connection creation from own file 'app-config.js'
import { con_createDb } from "./../config/app-config.js";

// Alternative to '__dirname' when using ES6 modules (import)
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Connect to the database
con_createDb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql connected...");

  // Drop the database if it exists
  con_createDb.query('DROP DATABASE IF EXISTS eCommerce;', (err, res) => {
    if (err) {
      console.error("Error dropping database:", err);
      return;
    }
    console.log("Database dropped (if existed).");

    // Create the database
    con_createDb.query('CREATE DATABASE eCommerce;', (err, res) => {
      if (err) {
        console.error("Error creating database:", err);
        return;
      }
      console.log("Database created successfully.");

      // Switch to the 'eCommerce' database
      con_createDb.query('USE eCommerce;', (err, res) => {
        if (err) {
          console.error("Error switching to eCommerce database:", err);
          return;
        }
        console.log("Using eCommerce database...");

        // Define the path to the SQL file
        const filePath = path.resolve(__dirname, "demo_db.sql");

        // Read file and execute its queries sequentially
        fs.readFile(filePath, 'utf8', async (err, data) => {
          if (err) throw err;

          // Remove all comment lines (those starting with "--") before splitting
          const cleanedData = data
            .split("\n")
            .filter(line => !line.trim().startsWith("--"))
            .join("\n");

          // Split the cleaned data into individual SQL queries by semicolon
          let sqlQueries = cleanedData
            .split(";")
            .map(query => query.trim())
            .filter(query => query !== "");

          console.log("Executing queries sequentially...");

          // Execute each query sequentially
          for (let sqlQuery of sqlQueries) {
            const lowerCaseQuery = sqlQuery.toLowerCase();
            // Skip duplicate DB management commands already executed
            if (
              lowerCaseQuery.startsWith("drop schema") ||
              lowerCaseQuery.startsWith("create schema") ||
              lowerCaseQuery.startsWith("use ecommerce")
            ) {
              console.log("Skipping query:", sqlQuery);
              continue;
            }
            try {
              await new Promise((resolve, reject) => {
                con_createDb.query(sqlQuery, (err, res) => {
                  if (err) return reject(err);
                  resolve(res);
                });
              });
              console.log("Executed query:", sqlQuery);
            } catch (err) {
              console.error("Error executing query:", sqlQuery, err);
              return;
            }
          }

          console.log("Database created successfully!");

          // Close the database connection
          con_createDb.end((err) => {
            if (err) console.error("Error closing connection:", err);
            console.log("Connection ended...");
          });
        });
      });
    });
  });
});
