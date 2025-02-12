import { config } from 'dotenv';
config({ path: '../../.env.test' });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../app.js'); // Ensure app.js exports correctly
const { con, con_createDb } = require('../../config/app-config.js'); // Ensure app-config.js exp

chai.use(chaiHttp);
const { expect } = chai;

// Test database setup
const createTestDatabase = async () => {
  return new Promise((resolve, reject) => {
    con_createDb.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`,
      (err) => err ? reject(err) : resolve()
    );
  });
};

// Global hooks
before(async () => {
  await createTestDatabase();
  // Add any database migrations/seeds here
});

after(async () => {
  await new Promise((resolve) => con.end(resolve));
  await new Promise((resolve) => con_createDb.end(resolve));
});

export { expect, chai, app };