const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  age: Number,
  dateOfJoining: Date,
  title: { type: String, enum: ['Employee', 'Manager', 'Director', 'VP'] },
  department: { type: String, enum: ['IT', 'Marketing', 'HR', 'Engineering'] },
  employeeType: { type: String, enum: ['FullTime', 'PartTime', 'Contract', 'Seasonal'] },
  currentStatus: { type: Boolean, default: true }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
