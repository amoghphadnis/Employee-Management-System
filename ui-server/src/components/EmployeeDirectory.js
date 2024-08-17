import React, { useState } from 'react';
// import EmployeeCreate from './EmployeeCreate';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';

const EmployeeDirectory = ({ setSelectedEmployee, setTabValue }) => {
  const [employees, setEmployees] = useState([]);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setTabValue(2); // Switch to Employee Details tab
  };

  return (
    <div>
      <h1>Employee Directory</h1>
      {/* <EmployeeCreate setEmployees={setEmployees} /> */}
      <EmployeeSearch setEmployees={setEmployees} />
      <EmployeeTable employees={employees} setEmployees={setEmployees} onSelectEmployee={handleEmployeeSelect} />
    </div>
  );
};

export default EmployeeDirectory;
