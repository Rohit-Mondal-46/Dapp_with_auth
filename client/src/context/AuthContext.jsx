import React, { useState, createContext, useEffect } from 'react';
import { initWeb3, getContract, getCurrentAccount } from '../web3';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState('User'); // Can be 'User' or 'Doctor'

  // Load user data from localStorage when the component initializes
  useEffect(() => {
    const savedAccount = localStorage.getItem('account');
    const savedBalance = localStorage.getItem('balance');
    const savedRole = localStorage.getItem('role');
    const savedAuthStatus = localStorage.getItem('isAuthenticated');

    if (savedAccount && savedAuthStatus === 'true') {
      setAccount(savedAccount);
      setBalance(savedBalance);
      setRole(savedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async () => {
    try {
      const web3 = await initWeb3();
      const userAccount = getCurrentAccount();
      setAccount(userAccount);

      // Fetch user balance
      const userBalance = await web3.eth.getBalance(userAccount);
      const formattedBalance = web3.utils.fromWei(userBalance, 'ether');
      setBalance(formattedBalance);

      // Check user's role from the contract (if registered)
      const contract = await getContract();
      const isDoctor = await contract.methods.isDoctor(userAccount).call();
      const userRole = isDoctor ? 'Doctor' : 'User';
      setRole(userRole);

      // Store user data in localStorage
      localStorage.setItem('account', userAccount);
      localStorage.setItem('balance', formattedBalance);
      localStorage.setItem('role', userRole);
      localStorage.setItem('isAuthenticated', 'true');

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccount('');
    setBalance(0);
    setRole('User');

    // Clear localStorage on logout
    localStorage.removeItem('account');
    localStorage.removeItem('balance');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, account, balance, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
