const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes protected and restricted to employer role
router.use(protect);
router.use(authorize('employer'));

// @route   POST /api/employer/employees
router.post('/employees', employerController.createEmployee);

// @route   GET /api/employer/employees
router.get('/employees', employerController.getEmployees);

// @route   GET /api/employer/employees/:id
router.get('/employees/:id', employerController.getEmployeeById);

// @route   PUT /api/employer/employees/:id
router.put('/employees/:id', employerController.updateEmployee);

// @route   DELETE /api/employer/employees/:id
router.delete('/employees/:id', employerController.deleteEmployee);

module.exports = router;