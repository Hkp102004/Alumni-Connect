const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, batch, branch, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role, batch, branch, company });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @route  POST /api/auth/firebase-login
const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      // Create new user automatically (simulate sign-up from Google)
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      user = await User.create({
        name: decoded.name || decoded.email.split('@')[0],
        email: decoded.email,
        password: randomPassword,
        role: 'student'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/firebase-register
const firebaseRegister = async (req, res) => {
  try {
    const { token, name, role, batch, branch, company } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    let user = await User.findOne({ email: decoded.email });
    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    user = await User.create({
      name: name || decoded.name || decoded.email.split('@')[0],
      email: decoded.email,
      password: randomPassword,
      role: role || 'student',
      batch,
      branch,
      company
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, firebaseLogin, firebaseRegister };
