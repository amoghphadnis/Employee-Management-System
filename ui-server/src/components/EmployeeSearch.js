import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

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

const EmployeeSearch = ({ setEmployees }) => {
  const [employeeType, setEmployeeType] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { employeeType }
  });

  useEffect(() => {
    if (data) {
      setEmployees(data.getEmployees);
    }
  }, [data, setEmployees]);

  const handleSearch = () => {
    refetch({ employeeType });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <label>
          Employee Type:
          <select value={employeeType} onChange={(e) => setEmployeeType(e.target.value)}>
            <option value="">All</option>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </label>
        {/* <button type="submit">Search Employees</button> */}
      </form>
    </div>
  );
};

export default EmployeeSearch;
