const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/me
router.get('/me', protect, authController.getMe);

module.exports = router;

