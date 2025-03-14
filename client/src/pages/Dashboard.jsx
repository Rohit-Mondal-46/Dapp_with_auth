import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { account, balance, role, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h1>Welcome to your Dashboard</h1>
      
      <div className="user-info">
        <p><strong>Ethereum Address:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance} ETH</p>
        <p><strong>Role:</strong> {role}</p>
      </div>
      
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
