import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const handleCreateCustomer = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/create-customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCustomerId(data.id);
      alert("Customer created successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleGetCustomerDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customer/${customerId}`);
      const data = await response.json();
      setCustomerDetails(data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleFetchPaymentMethods = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/payment-methods/${customerId}`
      );
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  return (
    <div className="App">
      <h1>Stripe Customer Management</h1>
      <section className="section">
        <h2>Create Customer</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleCreateCustomer}>Create Customer</button>
        </div>
      </section>

      <section className="section">
        <h2>Get Customer Details</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button onClick={handleGetCustomerDetails}>Get Details</button>
        </div>
        {customerDetails && (
          <table className="details-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{customerDetails.id}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{customerDetails.email}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{customerDetails.name}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <h2>Payment Methods</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button onClick={handleFetchPaymentMethods}>
            Fetch Payment Methods
          </button>
        </div>
        {paymentMethods.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Last 4 Digits</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method) => (
                <tr key={method.id}>
                  <td>{method.card.brand}</td>
                  <td>{method.card.last4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payment methods found.</p>
        )}
      </section>
    </div>
  );
}

export default App;
