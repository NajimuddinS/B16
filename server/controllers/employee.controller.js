const Employee = require('../models/employee.model.js');
const cloudinary = require('../config/cloudinary');

// @desc    Get employee profile
// @route   GET /api/employee/profile
// @access  Private/Employee
exports.getProfile = async (req, res) => {
    try {
      const employee = await Employee.findOne({ user: req.user.id });
  
      if (!employee) {
        return res.status(404).json({ msg: 'Employee profile not found. Please create a profile.' });
      }
  
      res.json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};

// @desc    Update employee profile
// @route   PUT /api/employee/profile
// @access  Private/Employee
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      address
    } = req.body;

    let employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ msg: 'Employee profile not found' });
    }

    // Update fields
    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (contactNumber) employee.contactNumber = contactNumber;
    if (address) employee.address = address;

    await employee.save();

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Upload profile image
// @route   PUT /api/employee/profile/image
// @access  Private/Employee
exports.uploadProfileImage = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ msg: 'Employee profile not found' });
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'employee_profiles',
      width: 300,
      crop: 'scale'
    });

    // If employee already has a profile image, delete the old one
    if (employee.profileImage.public_id !== 'default_profile') {
      await cloudinary.uploader.destroy(employee.profileImage.public_id);
    }

    // Update profile image details
    employee.profileImage = {
      public_id: result.public_id,
      url: result.secure_url
    };

    await employee.save();

    res.json({
      success: true,
      data: employee.profileImage
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createProfile = async (req, res) => {
    try {
      const { firstName, lastName, position, department, contactNumber, address, salary } = req.body;
  
      // Check if profile already exists
      let employee = await Employee.findOne({ user: req.user.id });
  
      if (employee) {
        return res.status(400).json({ msg: 'Profile already exists' });
      }
  
      // Create profile
      employee = await Employee.create({
        user: req.user.id,
        firstName,
        lastName,
        position,
        department,
        contactNumber,
        address,
        salary
      });
  
      res.status(201).json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };