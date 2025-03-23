const express = require('express');
const { 
  getAllEmployees, 
  getAllHRs, 
  deleteUser, 
  getUserById 
} = require('../controllers/employer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('employer'));

router.get('/employees', getAllEmployees);
router.get('/hrs', getAllHRs);
router.delete('/users/:id', deleteUser);
router.get('/users/:id', getUserById);

module.exports = router;