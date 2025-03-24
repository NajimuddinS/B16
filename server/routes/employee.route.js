const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { protect, authorize } = require('../middleware/auth.middleware.js');
const upload = require('../middleware/upload.middleware.js');

// All routes protected and restricted to employee role
router.use(protect);
router.use(authorize('employee'));

// @route   GET /api/employee/profile
router.get('/profile', employeeController.getProfile);

router.post('/profile', employeeController.createProfile);

// @route   PUT /api/employee/profile
router.put('/profile', employeeController.updateProfile);

// @route   PUT /api/employee/profile/image
router.put(
  '/profile/image',
  upload.single('image'),
  employeeController.uploadProfileImage
);

module.exports = router;