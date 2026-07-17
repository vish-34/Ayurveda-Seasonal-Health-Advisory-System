import express from 'express';
import {
  getHerbs,
  getHerbById,
  createHerb,
  updateHerb,
  deleteHerb
} from '../controllers/herbController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getHerbs);
router.get('/:id', getHerbById);

// Admin routes
router.post('/', protect, admin, createHerb);
router.put('/:id', protect, admin, updateHerb);
router.delete('/:id', protect, admin, deleteHerb);

export default router;
