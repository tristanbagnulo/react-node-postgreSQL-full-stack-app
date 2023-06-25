const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

//Middleware
app.use(express.json()); 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

app.post('/addCustomers', async (req, res) => {
    try {
        console.log("Request Body: ", req.body);
        const { customer_full_name, customer_email } = req.body;
        const customer_join_date = new Date().toISOString();
        const values = [customer_full_name, customer_email, customer_join_date];

        const insertCustomerQuery = `
            INSERT INTO customers (customer_full_name, customer_email, customer_join_date)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        
        const result = await pool.query(insertCustomerQuery, values);
        
        const insertedRow = result.rows[0];
        res.json(insertedRow);
    } catch (error) {
        console.error('Error inserting customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// const customerData = {
//     customer_full_name: 'Jane Yo!',
//     customer_email: 'jane.yizzle@exemplary.com',
//     customer_join_date: new Date().toISOString(),
// };

// pool.query(insertCustomerQuery, [
// customerData.customer_full_name,
// customerData.customer_email,
// customerData.customer_join_date,
// ])
// .then(result => {
//     const insertedRow = result.rows[0];
//     console.log('New row inserted:', insertedRow);
// })
// .catch(error => {
//     console.error('Error inserting row:', error);
// });

//Query
const getAllRows = async () => {
    try {
        const query = `SELECT * FROM customers;`;
        const result = await pool.query(query);
    
        console.log("All rows: ", result.rows);
    } catch (error) {
        console.error('Error:', error);
    }
}

getAllRows();

//Query endpoint for frontend app
app.get('/customers', async (req, res) => {
    try {
        const query = 'SELECT * FROM customers;';
        const result = await pool.query(query);

        res.setHeader('Content-Type', 'application/json');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  




//Routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
})

//Start the server
const port = 3001; //Choose port here
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});