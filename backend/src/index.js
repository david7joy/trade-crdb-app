const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// CockroachDB connection pool
const pool = new Pool({
  connectionString: 'postgres://root@localhost:26257/trade_db?sslmode=disable&application_name=birdtrade',
  ssl: {
    rejectUnauthorized: false,
  },
});

// Define a simple route to fetch data
app.get('/api/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT symbol,current_price FROM instruments LIMIT 5');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
