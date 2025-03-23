const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const HR = require('../models/hr.model');

// @desc    Get all employees
// @route   GET /api/employer/employees
// @access  Private (Employer Only)
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

// @desc    Get all HRs
// @route   GET /api/employer/hrs
// @access  Private (Employer Only)
const getAllHRs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const searchQuery = search
      ? {
          $or: [
            { 'userData.name': { $regex: search, $options: 'i' } },
            { 'userData.email': { $regex: search, $options: 'i' } },
            { position: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find({ role: 'hr' });
    const userIds = users.map(user => user._id);

    const hrs = await HR.find({
      user: { $in: userIds },
      ...searchQuery
    })
      .populate('user', 'name email profileImage')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await HR.countDocuments({
      user: { $in: userIds },
      ...searchQuery
    });

    res.json({
      hrs,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/employer/users/:id
// @access  Private (Employer Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is employee, delete employee profile
    if (user.role === 'employee') {
      await Employee.findOneAndDelete({ user: user._id });
    }

    // If user is HR, delete HR profile
    if (user.role === 'hr') {
      await HR.findOneAndDelete({ user: user._id });
    }

    // Delete user
    await user.remove();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/employer/users/:id
// @access  Private (Employer Only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };

    // If user is employee, get employee data
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ user: user._id });
      if (employee) {
        profileData.employeeData = employee;
      }
    }

    // If user is HR, get HR data
    if (user.role === 'hr') {
      const hr = await HR.findOne({ user: user._id });
      if (hr) {
        profileData.hrData = hr;
      }
    }

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getAllHRs,
  deleteUser,
  getUserById
};