import Web3 from 'web3';
import Auth from "./contracts/Auth.json";

let web3 = null;
let isInitializing = false;
let contract = null;
let currentAccount = null;

const initWeb3 = async () => {
  // Return existing instance if already initialized
  if (web3) {
    return web3;
  }

  // Prevent multiple simultaneous initialization attempts
  if (isInitializing) {
    throw new Error('Web3 initialization already in progress');
  }

  isInitializing = true;

  try {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      // Request account access using MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create Web3 instance using the ethereum provider
      web3 = new Web3(window.ethereum);

      // Fetch accounts and set the current account
      const accounts = await web3.eth.getAccounts();
      currentAccount = accounts[0];
      
      // Add provider event listeners
      window.ethereum.on('accountsChanged', (newAccounts) => {
        console.log('MetaMask accounts changed:', newAccounts);
        currentAccount = newAccounts[0];
      });

      window.ethereum.on('chainChanged', () => {
        // Handle chain change by refreshing the page as recommended by MetaMask
        window.location.reload();
      });

      console.log('Connected to MetaMask:', currentAccount);
      return web3;
    } else {
      throw new Error('Please install MetaMask!');
    }
  } catch (error) {
    console.error("Failed to connect to MetaMask:", error);
    web3 = null; // Reset web3 instance on error
    throw error;
  } finally {
    isInitializing = false;
  }
};

// Function to load the smart contract
const getContract = async () => {
  if (!web3) {
    throw new Error('Web3 has not been initialized yet. Call initWeb3 first.');
  }

  try {
    const networkId = await web3.eth.net.getId(); // Get the current network ID

    // Get the contract address for the current network
    const deployedNetwork = Auth.networks[networkId];
    
    if (deployedNetwork) {
      // Create a new contract instance
      contract = new web3.eth.Contract(Auth.abi, deployedNetwork.address);
    } else {
      throw new Error(`Contract not deployed on network with ID ${networkId}`);
    }

    return contract;
  } catch (error) {
    console.error('Error loading contract:', error);
    throw error;
  }
};

const getCurrentAccount = () => currentAccount;

export { initWeb3, getContract, getCurrentAccount, web3 };
