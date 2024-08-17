import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import '../App.css';

const GET_EMPLOYEE = gql`
  query getEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee(
    $id: ID!,
    $firstName: String!,
    $lastName: String!,
    $age: Int!,
    $dateOfJoining: String!,
    $title: String!,
    $department: String!,
    $employeeType: String!,
    $currentStatus: Boolean!
  ) {
    updateEmployee(
      id: $id,
      input: {
        firstName: $firstName,
        lastName: $lastName,
        age: $age,
        dateOfJoining: $dateOfJoining,
        title: $title,
        department: $department,
        employeeType: $employeeType,
        currentStatus: $currentStatus
      }
    ) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const EmployeeUpdate = ({ setEmployees }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_EMPLOYEE, { variables: { id } });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: 0,
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: (data) => {
      setEmployees(prevEmployees =>
        prevEmployees.map(emp => emp.id === data.updateEmployee.id ? data.updateEmployee : emp)
      );
      navigate('/');
    }
  });

  useEffect(() => {
    if (data) {
      setFormData(data.getEmployee);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmployee({ variables: { ...formData, id, age: parseInt(formData.age, 10) } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Age"
            variant="outlined"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            inputProps={{ min: 20, max: 70 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date of Joining"
            variant="outlined"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Title</InputLabel>
            <Select
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            >
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Director">Director</MenuItem>
              <MenuItem value="VP">VP</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Employee Type</InputLabel>
            <Select
              label="Employee Type"
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              <MenuItem value="FullTime">Full Time</MenuItem>
              <MenuItem value="PartTime">Part Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Seasonal">Seasonal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.currentStatus}
                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.checked })}
                name="currentStatus"
                color="primary"
              />
            }
            label="Currently Working"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Update Employee
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EmployeeUpdate;
