import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getUserProfile();
  }, []);
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Hide message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching user profile with token:', token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // const response = await axios.get('http://localhost:3000/api/users/profile', config);
      const response = await axios.get('/api/users/profile', config);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      setError('Failed to fetch user profile');
    }
  };

  const handleTransaction = async (type) => {
    try {
      setError('');
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      console.log(`Attempting to ${type} funds:`, amount);
      const response = await axios.post(`api/users/${type}Funds`, 
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`${type} funds response:`, response.data);
      setUser(response.data.user);
      setAmount('');
      setSuccessMessage(`Successfully ${type === 'add' ? 'added' : 'withdrawn'} funds`);
      getUserProfile(); // Refresh user data
    } catch (error) {
      console.error(`Error ${type}ing funds:`, error.response?.data || error.message);
      setError(error.response?.data?.message || `Failed to ${type} funds`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <h6 className='navbar-brand'>SB Stocks</h6>
        <nav>
          <a href="/landing">Home</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/profile">Profile</a>
          <a href="/login">Logout</a>
        </nav>
      </header>
      <div className="profile-container">
        {/* <h1>Profile</h1> */}
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Balance: ${user.balance || 0}</p>

        <div className="fund-management">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={() => handleTransaction('add')}>Add Funds</button>
          <button onClick={() => handleTransaction('withdraw')}>Withdraw Funds</button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="transaction-history">
  <h2>Transaction History</h2>
  <div className="transaction-table-container">
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {user.transactions && user.transactions.map((transaction, index) => (
          <tr key={index} className={`transaction-item ${transaction.type}`}>
            <td className={`transaction-type ${transaction.type}`}>{transaction.type}</td>
            <td className="transaction-amount">
              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
            </td>
            <td className="transaction-date">{transaction.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</div>
</div>
  );
}

// Helper functions
function getTransactionColor(type) {
  if (!type) return 'black';
  return type.toLowerCase().includes('deposit') ? 'green' : 'red';
}

function getTransactionType(type) {
  if (!type) return 'Transaction';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default ProfilePage;
