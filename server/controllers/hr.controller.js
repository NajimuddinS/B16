const HR = require('../models/hr.model');
const Employee = require('../models/employee.model');
const User = require('../models/user.model');
const Leave = require('../models/leave.model');

// @desc    Get HR profile
// @route   GET /api/hr/profile
// @access  Private
const getHRProfile = async (req, res) => {
  try {
    const hr = await HR.findOne({ user: req.user._id }).populate('user', 'name email profileImage');

    if (!hr) {
      return res.status(404).json({ message: 'HR profile not found' });
    }

    res.json(hr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update HR profile
// @route   PUT /api/hr/profile
// @access  Private
const updateHRProfile = async (req, res) => {
  try {
    let hr = await HR.findOne({ user: req.user._id });

    if (!hr) {
      return res.status(404).json({ message: 'HR profile not found' });
    }

    const { position, phoneNumber } = req.body;

    hr.position = position || hr.position;
    hr.phoneNumber = phoneNumber || hr.phoneNumber;

    await hr.save();

    res.json({
      message: 'HR profile updated successfully',
      hr
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private (HR Only)
const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const searchQuery = search
      ? {
          $or: [
            { 'userData.name': { $regex: search, $options: 'i' } },
            { 'userData.email': { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { position: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find({ role: 'employee' });
    const userIds = users.map(user => user._id);

    const employees = await Employee.find({
      user: { $in: userIds },
      ...searchQuery
    })
      .populate('user', 'name email profileImage')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await Employee.countDocuments({
      user: { $in: userIds },
      ...searchQuery
    });

    res.json({
      employees,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/hr/employees/:id
// @access  Private (HR Only)
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email profileImage');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave requests
// @route   GET /api/hr/leaves
// @access  Private (HR Only)
const getAllLeaves = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const statusQuery = status ? { status } : {};

    const leaves = await Leave.find(statusQuery)
      .populate({
        path: 'employee',
        populate: {
          path: 'user',
          select: 'name email profileImage'
        }
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await Leave.countDocuments(statusQuery);

    res.json({
      leaves,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject leave request
// @route   PUT /api/hr/leaves/:id
// @access  Private (HR Only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status' });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: `Leave request has already been ${leave.status}` });
    }

    const hr = await HR.findOne({ user: req.user._id });

    if (!hr) {
      return res.status(404).json({ message: 'HR profile not found' });
    }

    leave.status = status;
    leave.approvedBy = hr._id;
    leave.approvedAt = Date.now();

    await leave.save();

    res.json({
      message: `Leave request ${status} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHRProfile,
  updateHRProfile,
  getAllEmployees,
  getEmployeeById,
  getAllLeaves,
  updateLeaveStatus
};
