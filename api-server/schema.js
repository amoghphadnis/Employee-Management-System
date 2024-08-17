const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    age: Int!
    dateOfJoining: String!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Boolean!
    retirementDate: String!
    remainingTime: RemainingTime
  }

  type RemainingTime {
    years: Int
    months: Int
    days: Int
  }

  input EmployeeInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    age: Int!
    dateOfJoining: String!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Boolean!
  }

  type Query {
    getEmployees(employeeType: String): [Employee]
    getEmployee(id: ID!): Employee
    getUpcomingRetirements(employeeType: String): [Employee]
  }

  type Mutation {
    createEmployee(input: EmployeeInput): Employee
    updateEmployee(id: ID!, input: EmployeeInput): Employee
    deleteEmployee(id: ID!): Employee
  }
`;

module.exports = typeDefs;