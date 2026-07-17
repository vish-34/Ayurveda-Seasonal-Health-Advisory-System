import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  logWater,
  getUsers
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/water', protect, logWater);
router.get('/users', protect, admin, getUsers);

export default router;
