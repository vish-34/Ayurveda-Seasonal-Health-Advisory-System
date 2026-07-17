import express from 'express';
import {
  getCurrentAdvisory,
  getAllAdvisories,
  createOrUpdateAdvisory,
  updateAdvisory,
  deleteAdvisory
} from '../controllers/advisoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User specific current advisory matching dominant dosha + season
router.get('/current', protect, getCurrentAdvisory);

// Admin CRUD
router.route('/')
  .get(protect, admin, getAllAdvisories)
  .post(protect, admin, createOrUpdateAdvisory);

router.route('/:id')
  .put(protect, admin, updateAdvisory)
  .delete(protect, admin, deleteAdvisory);

export default router;
