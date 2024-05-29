const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const Decimal = require('decimal.js');

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
    const result = await client.query(`SELECT symbol,current_price, details FROM instruments where symbol in ('NVDA','JPM','NFLX','GOOGL','DIS','MSFT','AAPL')`);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Define a POST route to handle order submission
app.post('/api/submitOrder', async (req, res) => {
  const { stock, orderType, shares, currentPrice, estimatedCost } = req.body;

  // Basic validation
  if (!stock || !orderType || !shares || !currentPrice || !estimatedCost) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Generate unique IDs and order number
  const orderId = generateUUID();
  const orderNbr = generateOrderNumber();
  const activityId = generateUUID();
  const executionId = generateUUID();
  const tradeId = generateUUID();
  const newactivityId = generateUUID();

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Insert the order into the orders table
    const orderResult = await client.query(
      `INSERT INTO orders 
       (order_id, order_nbr, account_nbr, symbol, order_entry_ts, total_qty, order_type, unit_price) 
       VALUES ($1, $2, $3, $4, now(), $5, $6, $7) 
       RETURNING order_id`,
      [orderId, orderNbr, '0005821112', stock,  shares, orderType, currentPrice]
    );

    console.log('Order received:', req.body);

    // Insert into the order_activity table
    await client.query(
      `INSERT INTO order_activity 
       (activity_id, order_id, order_nbr, order_status, activity_entry_ts, symbol, total_qty, order_type, unit_price) 
       VALUES ($1, $2, $3, 'order_received', now(), $4, $5, $6, $7)`,
      [activityId, orderId, orderNbr, stock, shares, orderType, currentPrice]
    );

    const convertedCurrentPrice = new Decimal(currentPrice);
    let newPrice;

    // Update the instruments table (assuming some logic here, e.g., updating the current price)
    if (orderType === 'buy') {
      newPrice = convertedCurrentPrice.plus(new Decimal('0.10'));
      await client.query(
        `UPDATE instruments SET current_price = $1 WHERE symbol = $2`,
        [newPrice.toFixed(2), stock]
      );
    }
    else {
      newPrice = convertedCurrentPrice.minus(new Decimal('0.10'));
      await client.query(
        `UPDATE instruments SET current_price = $1 WHERE symbol = $2`,
        [newPrice.toFixed(2), stock]
      );
    }

    console.log('newPrice:', newPrice.toFixed(2));

    await client.query('COMMIT');
    client.release();

    // Wait for 250ms before processing the order further
    setTimeout(async () => {
      try {
        const client = await pool.connect();

        await client.query('BEGIN');

        // Insert into the order_processing table
        await client.query(
          `INSERT INTO order_processing 
           (execution_id, order_id, order_status, order_nbr, order_executed_ts, symbol, total_qty, unit_price) 
           VALUES ($1, $2, 'order_processed', $3, now(), $4, $5, $6)`,
          [executionId, orderId, orderNbr, stock, shares, currentPrice]
        );

       // Insert into the order_activity table
        await client.query(
          `INSERT INTO order_activity 
           (activity_id, order_id, order_nbr, order_status, activity_entry_ts, symbol, total_qty, order_type, unit_price) 
           VALUES ($1, $2, $3, 'order_processed', now(), $4, $5, $6, $7)`,
          [newactivityId, orderId, orderNbr, stock, shares, orderType, currentPrice]
        );

        // Insert into the trades table
        await client.query(
          `INSERT INTO trades 
           (trade_id, execution_id, symbol, order_type, trade_price, quantity, trade_ts) 
           VALUES ($1, $2, $3, $4, $5, $6, now())`,
          [tradeId, executionId, stock, orderType, currentPrice, shares]
        );

        await client.query('COMMIT');
        client.release();

        console.log('Order processed and trades recorded');
      } catch (err) {
        console.error('Error processing order:', err);
      }
    }, 250);



    // Send a success response
    res.status(200).json({ message: 'Order submitted successfully', orderId: orderResult.rows[0].order_id });
  } catch (err) {
    console.error('Error submitting order:', err);
    res.status(500).send('Server Error');
  }
});

// Utility function to generate a random order number (for demo purposes)
function generateOrderNumber() {
  return 'ORD' + Math.floor(Math.random() * 1000000);
}

// Utility function to generate a UUID (for demo purposes)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
