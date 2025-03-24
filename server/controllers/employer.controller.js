const Employee = require('../models/employee.model.js');
const User = require('../models/user.model.js');
const cloudinary = require('../config/cloudinary');

// @desc    Create employee
// @route   POST /api/employer/employees
// @access  Private/Employer
exports.createEmployee = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      position,
      department,
      contactNumber,
      address,
      salary,
      dateOfJoining
    } = req.body;

    // Create user account
    const user = await User.create({
      email,
      password,
      role: 'employee'
    });

    // Create employee profile
    const employeeData = {
      user: user._id,
      firstName,
      lastName,
      position,
      department,
      contactNumber,
      address,
      salary
    };

    if (dateOfJoining) {
      employeeData.dateOfJoining = dateOfJoining;
    }

    const employee = await Employee.create(employeeData);

    res.status(201).json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all employees
// @route   GET /api/employer/employees
// @access  Private/Employer
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get employee by ID
// @route   GET /api/employer/employees/:id
// @access  Private/Employer
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// @desc    Update employee
// @route   PUT /api/employer/employees/:id
// @access  Private/Employer
exports.updateEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      department,
      contactNumber,
      address,
      salary,
      dateOfJoining
    } = req.body;

    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Update fields
    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (position) employee.position = position;
    if (department) employee.department = department;
    if (contactNumber) employee.contactNumber = contactNumber;
    if (address) employee.address = address;
    if (salary) employee.salary = salary;
    if (dateOfJoining) employee.dateOfJoining = dateOfJoining;

    await employee.save();

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// @desc    Delete employee
// @route   DELETE /api/employer/employees/:id
// @access  Private/Employer
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Remove profile image from cloudinary if not default
    if (employee.profileImage.public_id !== 'default_profile') {
      await cloudinary.uploader.destroy(employee.profileImage.public_id);
    }

    // Delete employee
    await employee.remove();
    
    // Delete user account
    await User.findByIdAndDelete(employee.user);

    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    res.status(500).send('Server Error');
  }
};
