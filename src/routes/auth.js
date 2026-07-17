const express = require('express');
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getProfile);
router.get('/users', authenticate, getAllUsers);

module.exports = router;
