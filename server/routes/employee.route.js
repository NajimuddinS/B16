const express = require('express');
const { 
  getEmployeeProfile, 
  updateEmployeeProfile, 
  requestLeave, 
  getEmployeeLeaves 
} = require('../controllers/employee.controller.js');
const { protect, authorize } = require('../middleware/auth.middleware.js');

const router = express.Router();

// All routes are protected and for employees only
router.use(protect);
router.use(authorize('employee'));

router.get('/profile', getEmployeeProfile);
router.put('/profile', updateEmployeeProfile);
router.post('/leave', requestLeave);
router.get('/leave', getEmployeeLeaves);

module.exports = router;