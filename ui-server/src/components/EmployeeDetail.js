import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const GET_EMPLOYEE = gql`
  query getEmployee($id: ID!) {
    getEmployee(id: $id) {
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
      retirementCountdown {
        years
        months
        days
      }
    }
  }
`;

function EmployeeDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_EMPLOYEE, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const employee = data.getEmployee;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate; // Format as "yyyy-mm-dd"
  };

  return (
    <div>
      <h1>{employee.firstName} {employee.lastName}</h1>
      <p>Age: {employee.age}</p>
      <p>Date of Birth: {formatDate(employee.dateOfBirth)}</p>
      <p>Date of Joining: {formatDate(employee.dateOfJoining)}</p>
      <p>Title: {employee.title}</p>
      <p>Department: {employee.department}</p>
      <p>Employee Type: {employee.employeeType}</p>
      <p>Current Status: {employee.currentStatus ? 'Working' : 'Retired'}</p>
      {employee.retirementCountdown && (
        <p>Retirement Countdown: {employee.retirementCountdown.years} years, {employee.retirementCountdown.months} months, {employee.retirementCountdown.days} days</p>
      )}
    </div>
  );
}

export default EmployeeDetail;
