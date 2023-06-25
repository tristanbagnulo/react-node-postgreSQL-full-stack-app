
import './App.css';
import React, {useEffect, useState} from 'react';

function App() {
  
//+++++++++++++++++++
// FIXED VARIABLES
//+++++++++++++++++++

  const cellStyle = {
    border: '1px solid black',
    padding: '8px',
  };

//+++++++++++++++++++
// STATEFUL VARIABLES
//+++++++++++++++++++

  const [customersData, setCustomersData] = useState([]);
  
  //Add Customer
  const [addCustomerInputValueFullName, setAddCustomerInputValueFullName] = useState('');
  const [addCustomerInputValueEmail, setAddCustomerInputValueEmail] = useState('');
  
  const [buttonAddCustomerDisabledFullName, setButtonAddCustomerDisabledFullName] = useState(true);
  const [buttonAddCustomerDisabledEmail, setButtonAddCustomerDisabledEmail] = useState(true);
  const [buttonAddCustomerDisabled, setButtonAddCustomerDisabled] = useState(true);

  //Delete Customer
  const [customerSelectedForDeletion, setCustomerSelectedForDeletion] = useState('');
  // const [buttonDeleteCustomerDisabled, setButtonDeleteCustomerDisabled] = useState(true);
  //Update Customer

//+++++++++++++++++++
// FUNCTIONS - non-request
//+++++++++++++++++++
  
  //PUT Add Customer
  const handleAddCustomerInputChangeFullName = event => {
    const value = event.target.value;
    setAddCustomerInputValueFullName(value);
    if (value !== ''){
      setButtonAddCustomerDisabledFullName(false);
    } else {
      setButtonAddCustomerDisabledFullName(true);
    }
  };

  const handleAddCustomerInputChangeEmail = event => {
    const value = event.target.value;
    setAddCustomerInputValueEmail(value);
    if (value !== ''){
      setButtonAddCustomerDisabledEmail(false);
    } else {
      setButtonAddCustomerDisabledEmail(true);
    }
  };

  //DELETE - Delete 1 customer
  const handleCustomerToDeleteChanged = event => {
    const customerId = event.target.value;
    const customer = customersData.find(cust => cust.customer_id === Number(customerId));
    setCustomerSelectedForDeletion(customer);
    console.log("Set Customer for Deletion: ", customerSelectedForDeletion);
  };


//+++++++++++++++++++
// FUNCTIONS - HTTP Requests
//+++++++++++++++++++

  //GET - Get all customers - HTTP request
  const getAllCustomerData = () => {
    fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => {
        setCustomersData(data)
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  };

  //POST - Add Customert
  const handleSubmitAddCustomer = async () => {
    try {
      const newCustomerData = {
        customer_full_name: addCustomerInputValueFullName,
        customer_email: addCustomerInputValueEmail,
      }
      const response = await fetch('http://localhost:3001/addCustomers', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomerData)
      });

      if (!response.ok) {
        throw new Error('Error:', response.statusText);
      }

      const result = await response.json();
      console.log('New customer added:', result);
      getAllCustomerData()
      setAddCustomerInputValueFullName(''); 
      setAddCustomerInputValueEmail('');
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  //DELETE - Delete 1 selected customer - PARAMETER
  const handleDeleteCustomer = async () => {
    const customerId = customerSelectedForDeletion.customer_id;
    console.log("Customer ID: ", customerId);
    try {
      const response = await fetch(`http://localhost:3001/deleteCustomer/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Error:", response.statusText);
      }

      const result = await response.json();
      console.log('Customer deleted: ', result);
      getAllCustomerData();

    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  //DELETE - Delete 1 selected customer - BODY
  const handleDeleteCustomerOLD = async () => {
    const customerId = customerSelectedForDeletion;
    
    try {
      const response = await fetch('http://localhost:3001/deleteCustomer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerId)
      });

      if (!response.ok) {
        throw new Error("Error:", response.statusText);
      }

      const result = await response.json();
      console.log('Customer deleted: ', result);
      getAllCustomerData();

    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

//++++++++++++++++++
// USE-EFFECTS
//++++++++++++++++++

  //Get all customer data on start
  useEffect(() => {
    getAllCustomerData()
  }, [])

  //Conditionally enable "Add Customer" button 
  useEffect(() => {
    if (buttonAddCustomerDisabledFullName === false && 
      buttonAddCustomerDisabledEmail === false){
      setButtonAddCustomerDisabled(false)
    } else {
      setButtonAddCustomerDisabled(true)
    }
  }, [buttonAddCustomerDisabledFullName, buttonAddCustomerDisabledEmail])
  
  return (
    <div className="App">
      <h1>Customer Table:</h1>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Customer ID</th>
            <th style={cellStyle}>Full Name</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {customersData.map(item => (
            <tr key={item.customer_id}>
              <td style={cellStyle}>{item.customer_id}</td>
              <td style={cellStyle}>{item.customer_full_name}</td>
              <td style={cellStyle}>{item.customer_email}</td>
              <td style={cellStyle}>{item.customer_join_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Add customer</h2>
        <p>Full Name</p>
        <input
          type="text"
          value={addCustomerInputValueFullName}
          onChange={handleAddCustomerInputChangeFullName}
        />
        <p>Email</p>
        <input
          type="text"
          value={addCustomerInputValueEmail}
          onChange={handleAddCustomerInputChangeEmail}
        />
        <div>
          <button
            onClick={handleSubmitAddCustomer}
            disabled={buttonAddCustomerDisabled}
          >
            Add Customer
          </button>
        </div>
      </div>
      <div>
        <h2>Delete customer</h2>
        <div>
          <select value={customerSelectedForDeletion ? customerSelectedForDeletion.customer_id : ''} onChange={handleCustomerToDeleteChanged}>
            <option value="">Select a customer to delete</option>
            {customersData.map(customer => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_full_name}
              </option>
            ))}
          </select>
          {customerSelectedForDeletion && (
            <div>
              <div>
                <h3>Selected Customer to Delete:</h3>
                <p>ID: {customerSelectedForDeletion.customer_id}</p>
                <p>Name: {customerSelectedForDeletion.customer_full_name}</p>
                <p>Email: {customerSelectedForDeletion.customer_email}</p>
                <p>Join Date: {customerSelectedForDeletion.customer_join_date}</p>
              </div>
              <div>
              <button
                onClick={handleDeleteCustomer}
                disabled={customerSelectedForDeletion === null}
              >
                Delete Customer
              </button>
            </div>
          </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;
