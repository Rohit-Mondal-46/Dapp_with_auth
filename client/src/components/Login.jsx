import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { account, contract, setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setUserRole(userRole);

        if (userRole.toString().charAt(0) === "0") {
          navigate("/patient-dashboard");
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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
  );
}

export default Login;
