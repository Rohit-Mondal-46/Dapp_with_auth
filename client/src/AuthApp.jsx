import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserAuth from "./contracts/UserAuth.json"; // Your contract ABI
import { useNavigate } from "react-router-dom";

function AuthApp() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
  });
  const navigate = useNavigate();
  const roles = ["Patient", "Doctor", "Admin"];

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = UserAuth.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          UserAuth.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    }
    loadWeb3();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
  
    // Map role to uint8 value (Patient = 0, Doctor = 1, Admin = 2)
    const roleMap = {
      Patient: 0,
      Doctor: 1,
      Admin: 2,
    };
  
    try {
      // Use the numeric value for role
      await contract.methods
        .register(name, email, password, roleMap[role])
        .send({ from: account });
      alert("User registered successfully");
    } catch (error) {
      console.error("Registration error", error);
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const isAuthenticated = await contract.methods
        .login(email, password)
        .call({ from: account });

      if (isAuthenticated) {
        
        const userRole = await contract.methods
        .getUserRole(account)
        .call({ from: account });
        
        if (userRole.toString().charAt(0) === "0") {
            navigate("/patient-dashboard")
        } else if (userRole.toString().charAt(0) === "1") {
          navigate("/doctor-dashboard");
        } else if (userRole.toString().charAt(0) === "2") {
            navigate("/admin-dashboard");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div>
      <h1>Signup/Login</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button type="submit">Sign Up</button>
      </form>

      <h2>Already have an account? Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AuthApp;
