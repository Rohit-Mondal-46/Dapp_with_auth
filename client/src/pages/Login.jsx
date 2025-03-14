// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { initWeb3, getContract } from '../web3';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const web3 = await initWeb3();
    const contract = await getContract();
    const accounts = await web3.eth.getAccounts();

    const success = await contract.methods.login(email, password).call({ from: accounts[0] });
    if (success) {
      login();
      alert('Login successful!');
    } else {
      alert('Login failed.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
