import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";
axios.defaults.headers.common["Authorization"] = Cookies.get("token");

axios.defaults.headers.post["Content-Type"] = "application/json";
console.log(axios);
const ExpenseForm = ({
  expenses,
  setExpenses,
  userInfo,
  fetchExpenses,
  setExpanded,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Food",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = userInfo.id;
    formData.user_id = userId;
    console.log(formData);

    try {
      const response = await axios.post("http://localhost:5000/api/expenses", {
        ...formData,
      });

      if (response.statusText === "OK") {
        const data = await response.data;

        console.log("Expense Added:", data);

        fetchExpenses();
        setExpanded("panel2");
      } else {
        const errorData = await response.data;
        console.error("Error:", errorData.message);
      }
      setFormData({
        amount: "",
        description: "",
        category: "Food",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount Spent"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              select
              name="category"
              value={formData.category}
              onChange={handleChange}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
            >
              <option value="Food">Food</option>
              <option value="Petrol">Petrol</option>
              <option value="Salary">Salary</option>
              {/* Add more categories as needed */}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Expense
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ExpenseForm;
