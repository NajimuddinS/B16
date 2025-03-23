const Employee = require('../models/employee.model');
const User = require('../models/user.model');
const Leave = require('../models/leave.model');

// @desc    Get employee profile
// @route   GET /api/employees/profile
// @access  Private
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id }).populate('user', 'name email profileImage');

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/profile
// @access  Private
const updateEmployeeProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { department, position, phoneNumber, address } = req.body;

    employee.department = department || employee.department;
    employee.position = position || employee.position;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.address = address || employee.address;

    await employee.save();

    res.json({
      message: 'Employee profile updated successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request leave
// @route   POST /api/employees/leave
// @access  Private
const requestLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { startDate, endDate, reason } = req.body;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const leave = await Leave.create({
      employee: employee._id,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee leaves
// @route   GET /api/employees/leave
// @access  Private
const getEmployeeLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const leaves = await Leave.find({ employee: employee._id }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployeeProfile,
  updateEmployeeProfile,
  requestLeave,
  getEmployeeLeaves
};