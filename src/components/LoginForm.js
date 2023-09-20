import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

const LoginForm = ({ setAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", JSON.stringify(data.user));
        setAuthenticated(true);
        console.log("Login successful:", data);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <div
          style={{
            display: "flex",
          }}
        >
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Sign Up
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default LoginForm;
