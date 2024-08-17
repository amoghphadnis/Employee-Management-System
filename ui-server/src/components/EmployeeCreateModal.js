import React, { useState } from 'react';
import { Modal, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { gql, useMutation } from '@apollo/client';

const CREATE_EMPLOYEE = gql`
  mutation createEmployee(
    $firstName: String!,
    $lastName: String!,
    $age: Int!,
    $dateOfJoining: String!,
    $title: String!,
    $department: String!,
    $employeeType: String!,
    $dateOfBirth: String!,
    $currentStatus: Boolean!
  ) {
    createEmployee(
      input: {
        firstName: $firstName,
        lastName: $lastName,
        age: $age,
        dateOfJoining: $dateOfJoining,
        title: $title,
        department: $department,
        employeeType: $employeeType,
        dateOfBirth: $dateOfBirth,
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
      dateOfBirth
      currentStatus
    }
  }
`;

const EmployeeCreateModal = ({ open, onClose, refetch }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: 0,
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
    currentStatus: true,
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      if (refetch) {
        refetch(); // Re-fetch employee data to update the list
      }
      handleClose(); // Close modal after successful creation
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
    }
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'dateOfBirth') {
      newValue = value;
      setFormData(prevData => ({
        ...prevData,
        [name]: newValue,
        age: calculateAge(newValue),
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmployee({ 
      variables: { 
        ...formData,
        age: parseInt(formData.age, 10),
        currentStatus: formData.currentStatus
      } 
    });
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      age: 0,
      dateOfJoining: '',
      title: 'Employee',
      department: 'IT',
      employeeType: 'FullTime',
      currentStatus: true,
    });
    if (onClose) {
      onClose(); // Call onClose to close the modal
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{
        width: '90%',
        maxWidth: 600,
        maxHeight: '80vh',  // Limit the maximum height of the modal
        overflowY: 'auto',  // Add vertical scrolling if content overflows
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        outline: 'none',
      }}>
        <h2 id="modal-title">Create Employee</h2>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              readOnly
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="title-label">Title</InputLabel>
            <Select
              labelId="title-label"
              id="title"
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="employeeType-label">Employee Type</InputLabel>
            <Select
              labelId="employeeType-label"
              id="employeeType"
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              <MenuItem value="FullTime">FullTime</MenuItem>
              <MenuItem value="PartTime">PartTime</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Seasonal">Seasonal</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.currentStatus}
                onChange={handleChange}
                name="currentStatus"
              />
            }
            label="Currently Working"
          />
          <Button type="submit" variant="contained" color="primary">
            Create Employee
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EmployeeCreateModal;
