import express from 'express';
import { getQuestions, submitAssessment } from '../controllers/doshaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/assess', protect, submitAssessment);

export default router;
