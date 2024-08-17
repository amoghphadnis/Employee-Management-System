import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@mui/material';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmployeeCreateModal from './components/EmployeeCreateModal';
import UpcomingRetirements from './components/UpcomingRetirements';
// import ModalEditEmployee from './components/ModalEditEmployee';

const App = () => {
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Management System
          </Typography>
          <Button color="inherit" onClick={handleOpenModal}>Create Employee</Button>
        </Toolbar>
      </AppBar>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Employee Directory" />
        <Tab label="Upcoming Retirements" />
      </Tabs>
      {tabValue === 0 && <EmployeeDirectory />}
      {tabValue === 1 && <UpcomingRetirements />}
      <EmployeeCreateModal open={modalOpen} onClose={handleCloseModal} />
      {/* <ModalEditEmployee open={modalOpen} onClose={handleCloseModal}/>. */}
    </Container>
  );
};

export default App;
