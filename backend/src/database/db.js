require("dotenv").config();
const { Pool } = require("pg");
const { DB_USER, DB_HOST, DB_NAME, DB_PWD, DB_PORT } = require("../config/db");

const DB_CONFIG = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PWD,
  port: DB_PORT,
};
const pool = new Pool(DB_CONFIG);

module.exports = { pool };
