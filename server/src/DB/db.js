const { Pool } = require('pg');

const pool = new Pool({
  user: 'warehouse',
  host: 'localhost',
  database: 'warehouse_db',
  password: 'warehouse123',
  port: 5432,
});

module.exports = pool;
