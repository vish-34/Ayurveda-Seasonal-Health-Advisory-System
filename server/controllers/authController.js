import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ayurveda_secret_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    age,
    gender,
    country,
    state,
    city,
    occupation,
    lifestyle,
    dietType,
    sleepTime,
    wakeTime,
    disclaimerAccepted
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!disclaimerAccepted) {
      return res.status(400).json({ message: 'You must accept the disclaimer to register' });
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      country,
      state,
      city,
      occupation,
      lifestyle,
      dietType,
      sleepTime,
      wakeTime,
      disclaimerAccepted,
      role: email === 'admin@ayurveda.com' ? 'admin' : 'user' // Simple auto-promotion for seed admin
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doshaProfile: user.doshaProfile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      country: user.country,
      state: user.state,
      city: user.city,
      occupation: user.occupation,
      lifestyle: user.lifestyle,
      dietType: user.dietType,
      sleepTime: user.sleepTime,
      wakeTime: user.wakeTime,
      role: user.role,
      doshaProfile: user.doshaProfile,
      waterLog: user.waterLog
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Log water intake
// @route   POST /api/auth/water
// @access  Private
export const logWater = async (req, res) => {
  const { amount, date } = req.body; // amount is change in ml (positive or negative), date is YYYY-MM-DD
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.waterLog) {
      user.waterLog = [];
    }

    const logEntryIndex = user.waterLog.findIndex((log) => log.date === date);

    if (logEntryIndex > -1) {
      user.waterLog[logEntryIndex].amount = Math.max(0, user.waterLog[logEntryIndex].amount + amount);
    } else {
      user.waterLog.push({ date, amount });
    }

    await user.save();
    res.json(user.waterLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
