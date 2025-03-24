const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const Employee = require('../models/employee.model.js');
require('dotenv').config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
      const { email, password, role, firstName, lastName, contactNumber, address } = req.body;
  
      // Check if user exists
      let user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create user
      user = await User.create({
        email,
        password,
        role
      });
  
      // If role is 'employee', create an employee profile
      if (role === 'employee') {
        await Employee.create({
          user: user._id,
          firstName,
          lastName,
          position: 'Unassigned', // Default values
          department: 'Unassigned',
          contactNumber, // Use provided contactNumber
          address, // Use provided address
          salary: 0
        });
      }
  
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
