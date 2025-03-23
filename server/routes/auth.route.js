const express = require('express');
const { registerUser, loginUser, getUserProfile, updateProfileImage } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile/image', protect, upload.single('image'), updateProfileImage);

module.exports = router;