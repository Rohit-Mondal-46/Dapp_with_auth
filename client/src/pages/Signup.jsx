// src/pages/Signup.js
import React, { useState } from 'react';
import { initWeb3, getContract } from '../web3';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const web3 = await initWeb3();
    const contract = await getContract();
    const accounts = await web3.eth.getAccounts();

    await contract.methods.register(email, password).send({ from: accounts[0] });
    alert('Registration successful!');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
