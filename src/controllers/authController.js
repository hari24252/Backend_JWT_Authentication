const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 12;

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

async function register(req, res) {
  const { email, password, name } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (!validateName(name)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, passwordHash, name: name.trim() });
  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!validateEmail(email) || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
}

async function getProfile(req, res) {
  return res.json({ user: req.user });
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { register, login, getProfile, getAllUsers };
