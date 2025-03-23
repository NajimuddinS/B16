const express = require('express');
const { 
  getHRProfile, 
  updateHRProfile, 
  getAllEmployees, 
  getEmployeeById,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/hr.controller.js');
const { protect, authorize } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.use(protect);
router.use(authorize('hr'));

router.get('/profile', getHRProfile);
router.put('/profile', updateHRProfile);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.get('/leaves', getAllLeaves);
router.put('/leaves/:id', updateLeaveStatus);

module.exports = router;