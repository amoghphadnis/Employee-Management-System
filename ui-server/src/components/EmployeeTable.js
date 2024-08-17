import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ModalViewEmployee from './ModalViewEmployee';
import ModalEditEmployee from './ModalEditEmployee';

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

const EmployeeTable = ({ employees, setEmployees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: (data) => {
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== data.deleteEmployee.id));
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee({ variables: { id } });
      } catch (error) {
        // Display the error message in an alert
        window.alert(error.message);
      }
    }
  };


  const handleViewOpen = (employee) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  const handleEditOpen = (employee) => {
    setSelectedEmployee(employee);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedEmployee(null);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedEmployee(null);
  };

  const convertToISODate = (dateOfBirth) => {
    const [day, month, year] = dateOfBirth.split('-');
    return `${year}-${month}-${day}`; // Convert to ISO format YYYY-MM-DD
  };

  const calculateCountdownToRetirement = (dateOfBirth) => {
    if (!dateOfBirth) return 'No date provided';

    // Convert DD-MM-YYYY to ISO format YYYY-MM-DD
    const isoDateStr = convertToISODate(dateOfBirth);

    // Create Date object
    const birthDate = new Date(isoDateStr);

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) return 'Invalid date';

    // Calculate retirement date (65 years from birth date)
    const retirementDate = new Date(Date.UTC(
      birthDate.getUTCFullYear() + 65,
      birthDate.getUTCMonth(),
      birthDate.getUTCDate()
    ));

    // Get current UTC date
    const now = new Date();
    const todayUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    // Check if the person is already retired
    if (todayUTC > retirementDate) {
      return 'Already retired';
    }

    // Calculate the difference in time
    const diffTime = retirementDate - todayUTC;

    // Calculate difference in days, months, and years
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);

    return `${years} years, ${months} months, ${days} days`;
  };

  // Example usage
  const dateOfBirth = '14-02-1960'; // DD-MM-YYYY format
  console.log(calculateCountdownToRetirement(dateOfBirth));





  const dateFormat = (timestamp) => {
    if (!timestamp) return 'N/A'; // Handle undefined or null timestamp
    const date = new Date(parseInt(timestamp, 10));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const employeeList = employees || [];

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>date Of Birth</TableCell>
              <TableCell>Date of Joining</TableCell>
              <TableCell>Employee Type</TableCell>
              <TableCell>Countdown to Retirement</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeList.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                <TableCell>{employee.age}</TableCell>
                <TableCell>{dateFormat(employee.dateOfBirth)}</TableCell>
                <TableCell>{dateFormat(employee.dateOfJoining)}</TableCell>
                <TableCell>{employee.employeeType}</TableCell>
                <TableCell>{calculateCountdownToRetirement(dateFormat(employee.dateOfBirth))}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewOpen(employee)} variant="contained" color="primary">View</Button>
                  <Button onClick={() => handleEditOpen(employee)} variant="contained" color="warning">Edit</Button>
                  <Button onClick={() => handleDelete(employee.id)} variant="contained" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {viewOpen && (
        <ModalViewEmployee
          open={viewOpen}
          handleClose={handleViewClose}
          employee={selectedEmployee}
        />
      )}
      {editOpen && (
        <ModalEditEmployee
          open={editOpen}
          handleClose={handleEditClose}
          employee={selectedEmployee}
          setEmployees={setEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
