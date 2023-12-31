import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("userInfo", JSON.stringify(data.user));
        Cookies.set("token", JSON.stringify(data.token));
        navigate("/Home");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" type="submit">
        Sign Up
      </Button>
    </form>
  );
};

export default Signup;
