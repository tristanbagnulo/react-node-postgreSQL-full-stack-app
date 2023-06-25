
import './App.css';
import React, {useEffect, useState} from 'react';

function App() {
  const cellStyle = {
    border: '1px solid black',
    padding: '8px',
  };

  const [data, setData] = useState([]);
  //Add Customer - VARIABLES
  const [addCustomerInputValueFullName, setAddCustomerInputValueFullName] = useState('');
  const [addCustomerInputValueEmail, setAddCustomerInputValueEmail] = useState('');
  
  const [buttonAddCustomerDisabledFullName, setButtonAddCustomerDisabledFullName] = useState(true);
  const [buttonAddCustomerDisabledEmail, setButtonAddCustomerDisabledEmail] = useState(true);
  const [buttonAddCustomerDisabled, setButtonAddCustomerDisabled] = useState(true);

  //Delete Customer - VARIABLES

  //Update Customer - VARIABLES

  //Add Customer - FUNCTIONS
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

  //Enable "Add Customer" Button
  useEffect(() => {
    if (buttonAddCustomerDisabledFullName === false && 
      buttonAddCustomerDisabledEmail === false){
      setButtonAddCustomerDisabled(false)
    } else {
      setButtonAddCustomerDisabled(true)
    }
  }, [buttonAddCustomerDisabledFullName, buttonAddCustomerDisabledEmail])

  //Add Customer - HTTP request
  const handleSubmitAddCustomer = async () => {
    console.log('Submitted value:', addCustomerInputValueFullName, addCustomerInputValueEmail);

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

  const getAllCustomerData = () => {
    fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => {
        setData(data)
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }
  
  useEffect(() => {
    getAllCustomerData()
  }, [])

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
          {data.map(item => (
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
      </div>
    </div>
  );
}

export default App;
