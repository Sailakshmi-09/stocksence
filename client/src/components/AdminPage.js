// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/AdminPanel.css';

// function AdminPanel() {
//   const [users, setUsers] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [usersResponse, transactionsResponse] = await Promise.all([
//         axios.get('http://localhost:5000/api/admin/users'),
//         axios.get('http://localhost:5000/api/admin/transactions')
//       ]);
//       setUsers(usersResponse.data);
//       setTransactions(transactionsResponse.data);
//     } catch (err) {
//       console.error("Error fetching admin data:", err);
//       setError("Failed to load data. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="admin-panel">
//       <h1>SB Stocks Admin Panel</h1>
//       <div className="tab-buttons">
//         {/* <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button> */}
//         {/* <button onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? 'active' : ''}>Transactions</button> */}
//       </div>
//       {activeTab === 'users' && (
//         <div className="users-table">
//           <h2>All Users</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>User ID</th>
//                 <th>Username</th>
//                 <th>Email</th>
//                 <th>Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(user => (
//                 <tr key={user._id}>
//                   <td>{user._id}</td>
//                   <td>{user.username}</td>
//                   <td>{user.email}</td>
//                   <td>${user.balance.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {activeTab === 'transactions' && (
//         <div className="transactions-table">
//           <h2>All Transactions</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Transaction ID</th>
//                 <th>User ID</th>
//                 <th>Amount</th>
//                 <th>Action</th>
//                 <th>Payment Mode</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map(transaction => (
//                 <tr key={transaction._id}>
//                   <td>{transaction._id}</td>
//                   <td>{transaction.userId}</td>
//                   <td>${transaction.amount.toFixed(2)}</td>
//                   <td>{transaction.action}</td>
//                   <td>{transaction.paymentMode}</td>
//                   <td>{new Date(transaction.time).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminPanel;