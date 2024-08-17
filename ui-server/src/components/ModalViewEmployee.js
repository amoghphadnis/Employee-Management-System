import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ModalViewEmployee = ({ open, handleClose, employee }) => {
  if (!employee) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'; // Handle undefined or null timestamp
    const date = new Date(parseInt(timestamp, 10));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Employee Details</DialogTitle>
      <DialogContent>
        <p><strong>First Name:</strong> {employee.firstName || 'N/A'}</p>
        <p><strong>Last Name:</strong> {employee.lastName || 'N/A'}</p>
        <p><strong>Age:</strong> {employee.age || 'N/A'}</p>
        <p><strong>Date of Joining:</strong> {formatDate(employee.dateOfJoining) || 'N/A'}</p>
        <p><strong>Title:</strong> {employee.title || 'N/A'}</p>
        <p><strong>Department:</strong> {employee.department || 'N/A'}</p>
        <p><strong>Employee Type:</strong> {employee.employeeType || 'N/A'}</p>
        <p><strong>Current Status:</strong> {employee.currentStatus ? 'Working' : 'Retired'}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewEmployee;
