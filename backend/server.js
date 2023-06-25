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
//+++++++++++++++++
//REQUESTS
//+++++++++++++++++

//GET - Get all customer from customers table
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

//POST - Add 1 customer
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




//PUT - Change 1 customer's details

app.put('/updateCustomerName', async (req, res) => {
    try {
    // variables
        const { customerId, field, newValue } = req.body;
        const values = [ customerId, field, newValue ];
    // sql statement
        const updateQuery = `
            UPDATE customers
            SET ${field} = $3
            WHERE customer_id = $1
            RETURNING customer_id, customer_full_name, customer_email, customer_join_date;
        `;
    // send postgre request
        const result = await pool.query(updateQuery, values);
    // if error statement
        if (result.rowCount === 0){
            return res.status(404).json({error: 'Customer not found.'});
        }
        res.json({message: "Customer successfully updated"})
    // if successful return given result
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//DELETE - Delete 1 customer - PARAMETER VERSION
app.delete('/deleteCustomer/:customer_id', async (req, res) => {
    try {
        const customer_id = req.params.customer_id;
        const deleteCustomerQuery = `DELETE FROM customers WHERE customer_id = $1 RETURNING *;`;
        const result = await pool.query(deleteCustomerQuery, [customer_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Customer not found' });
        }

        res.json({message: 'Customer deleted successfully'});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//DELETE - Delete 1 customer - BODY VERSION
app.delete('/deleteCustomer', async (req, res) => {
    try {
        const { customer_id } = req.body;
        const deleteCustomerQuery = `DELETE FROM customers WHERE customer_id = $1 RETURNING *;`;
        const result = await pool.query(deleteCustomerQuery, [customer_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Customer not found' });
        }

        res.json({message: 'Customer deleted successfully'});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

//+++++++++++++++++
//FOR TESTING
//+++++++++++++++++

//GET ALL
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

//Start the server
const port = 3001; //Choose port here
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});