import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControlLabel, Checkbox, MenuItem} from '@mui/material';


// Mutation for updating employee details
const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee(
    $id: ID!,
    $firstName: String!,
    $lastName: String!,
    $dateOfBirth: String!,
    $dateOfJoining: String!,
    $title: String!,
    $department: String!,
    $employeeType: String!,
    $currentStatus: Boolean!,
    $age: Int!
  ) {
    updateEmployee(
      id: $id,
      input: {
        firstName: $firstName,
        lastName: $lastName,
        dateOfBirth: $dateOfBirth,
        dateOfJoining: $dateOfJoining,
        title: $title,
        department: $department,
        employeeType: $employeeType,
        currentStatus: $currentStatus,
        age: $age
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

// Function to calculate age based on date of birth
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

// Modal component for editing employee details
const ModalEditEmployee = ({ open, onClose, employee }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dateOfJoining: '',
    title: '',
    department: '',
    employeeType: '',
    currentStatus: true,
    age: '', // Added age in state
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        dateOfBirth: employee.dateOfBirth || '',
        dateOfJoining: employee.dateOfJoining || '',
        title: employee.title || '',
        department: employee.department || '',
        employeeType: employee.employeeType || '',
        currentStatus: employee.currentStatus !== undefined ? employee.currentStatus : true,
        age: employee.dateOfBirth ? calculateAge(employee.dateOfBirth) : '', // Initialize age based on employee data
      });
    }
  }, [employee]);

  // Mutation hook for updating employee
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      alert('Employee Updated Successfully');
      onClose(); // Ensure this is called to close the modal
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
      alert('Error Updating Employee: ' + error.message);
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Update age when dateOfBirth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      setFormData((prevData) => ({
        ...prevData,
        age,
      }));
    }
  }, [formData.dateOfBirth]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEmployee({
        variables: {
          id: employee.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          dateOfJoining: formData.dateOfJoining,
          title: formData.title,
          department: formData.department,
          employeeType: formData.employeeType,
          currentStatus: formData.currentStatus,
          age: formData.age, // Include age in the mutation
        },
      });
    } catch (error) {
      console.error('Error during mutation:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee Details</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          readOnly
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Joining"
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select // Add select to use MenuItem
        >
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Director">Director</MenuItem>
          <MenuItem value="VP">VP</MenuItem>
        </TextField>
        <TextField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select // Add select to use MenuItem
        >
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
        </TextField>
        <TextField
          label="Employee Type"
          name="employeeType"
          value={formData.employeeType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select // Add select to use MenuItem
        >
          <MenuItem value="FullTime">FullTime</MenuItem>
          <MenuItem value="PartTime">PartTime</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="Seasonal">Seasonal</MenuItem>
        </TextField>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditEmployee;
