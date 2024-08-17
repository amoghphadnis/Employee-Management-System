const path = require('path');
const Employee = require(path.resolve(__dirname, 'models/Employee'));
const moment = require('moment');

const resolvers = {
  Query: {
    getEmployees: async (_, { employeeType }) => {
      const filter = employeeType ? { employeeType } : {};
      return await Employee.find(filter);
    },
    getEmployee: async (_, { id }) => {
      return await Employee.findById(id);
    },
    getUpcomingRetirements: async (_, { employeeType }) => {
      try {
        const filter = employeeType ? { employeeType } : {};
        const employees = await Employee.find(filter);

        return employees.map(employee => {
          const retirementDate = moment(employee.dateOfBirth).add(65, 'years');
          console.log(retirementDate)
          const remainingTime = moment.duration(retirementDate.diff(moment()));

          return {
            ...employee._doc,
            retirementDate: retirementDate.format('YYYY-MM-DD'), // Format as needed
            remainingTime: {
              years: remainingTime.years(),
              months: remainingTime.months(),
              days: remainingTime.days()
            }
          };
        }).filter(employee => {
          return moment(employee.retirementDate).isBefore(moment().add(6, 'months'));
        });
      } catch (error) {
        console.error("Error fetching upcoming retirements:", error);
        throw new Error("Failed to fetch upcoming retirements");
      }
    }
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      const employee = new Employee(input);
      await employee.save();
      return employee;
    },
    updateEmployee: async (_, { id, input }) => {
      console.log('Updating Employee:', id, input);

      const updatedEmployee = await Employee.findByIdAndUpdate(id, input, { new: true });
      console.log('Updated Employee:', updatedEmployee);
      return updatedEmployee;
    },


    deleteEmployee: async (_, { id }) => {
      const employee = await Employee.findById(id);

      if (!employee) {
        throw new Error(`Employee with id: ${id} not found`);
      }

      if (employee.currentStatus) {
        throw new Error("CAN’T DELETE EMPLOYEE – STATUS ACTIVE");
      }

      await Employee.findByIdAndDelete(id);
      return employee;
    },
  }
};

module.exports = resolvers;
