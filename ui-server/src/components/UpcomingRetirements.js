import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import moment from 'moment-timezone'; // Import moment-timezone
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import ModalViewEmployee from './ModalViewEmployee'; // Adjust the import path as necessary

const GET_EMPLOYEES = gql`
  query getEmployees($employeeType: String) {
    getEmployees(employeeType: $employeeType) {
      id
      firstName
      lastName
      age
      dateOfBirth
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

const convertToISODate = (dateOfBirth) => {
  const [day, month, year] = dateOfBirth.split('-');
  return `${year}-${month}-${day}`; // Convert to ISO format YYYY-MM-DD
};

const calculateRetirementDate = (dateOfBirth) => {

  const dateFormat = (timestamp) => {
    if (!timestamp) return 'N/A'; // Handle undefined or null timestamp
    const date = new Date(parseInt(timestamp, 10));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const BirthDate = dateFormat(dateOfBirth);
  const isoDateStr = convertToISODate(BirthDate);
  const birthDate = moment(isoDateStr, 'YYYY-MM-DD'); // Use moment to parse ISO format

  // Calculate retirement date (65 years from birth date)
  const retirementDate = birthDate.clone().add(65, 'years');

  return retirementDate;
};

const UpcomingRetirements = ({ employeeType }) => {
  const { loading, error, data } = useQuery(GET_EMPLOYEES, {
    variables: { employeeType }
  });

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleViewOpen = (employee) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedEmployee(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const sixMonthsFromNow = moment.tz('America/New_York').add(6, 'months'); // Set the current time zone to Eastern Time

  const employees = data.getEmployees
    .filter(employee => employee.id && employee.currentStatus) // Ensure id is not null or undefined and currentStatus is true
    .map(employee => {
      const retirementDate = calculateRetirementDate(employee.dateOfBirth);
      const remainingTime = moment.duration(retirementDate.diff(moment.tz('America/New_York')));

      const isRetiringSoon = retirementDate.isBefore(sixMonthsFromNow);

      return {
        ...employee,
        retirementDate,
        remainingTime: {
          years: remainingTime.years(),
          months: remainingTime.months(),
          days: remainingTime.days(),
        },
        isRetiringSoon,
      };
    })
    .filter(employee => employee.isRetiringSoon); // Filter employees retiring within the next 6 months

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Retirement Date</TableCell>
              <TableCell>Remaining Time</TableCell>
              <TableCell>Actions</TableCell> {/* Added Actions column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.retirementDate.format('YYYY-MM-DD')}</TableCell>
                  <TableCell>
                    {employee.remainingTime.years} years, {employee.remainingTime.months} months, {employee.remainingTime.days} days
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleViewOpen(employee)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No employees retiring within the next 6 months.</TableCell>
              </TableRow>
            )}
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
    </>
  );
};

export default UpcomingRetirements;
