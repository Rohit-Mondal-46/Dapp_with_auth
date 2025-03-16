import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
  });
  const { account, contract } = useAuth();
  const roles = ["Patient", "Doctor", "Admin"];
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    const roleMap = {
      Patient: 0,
      Doctor: 1,
      Admin: 2,
    };

    try {
      await contract.methods
        .register(name, email, password, roleMap[role])
        .send({ from: account });
      alert("User registered successfully");
      navigate("/login")
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
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
  );
}

export default Signup;
