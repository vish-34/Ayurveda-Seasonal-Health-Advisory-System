import { DOSHA_QUESTIONS, calculateDosha } from '../utils/doshaCalculator.js';
import User from '../models/User.js';

// @desc    Get all 10 dosha questions
// @route   GET /api/dosha/questions
// @access  Public
export const getQuestions = (req, res) => {
  res.json(DOSHA_QUESTIONS);
};

// @desc    Submit dosha assessment answers
// @route   POST /api/dosha/assess
// @access  Private
export const submitAssessment = async (req, res) => {
  const { answers } = req.body; // Array of option values: ['Vata', 'Pitta', ...]

  if (!answers || !Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ message: 'Must submit answers for all 10 questions' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = calculateDosha(answers);
    
    user.doshaProfile = {
      vataScore: result.vataScore,
      pittaScore: result.pittaScore,
      kaphaScore: result.kaphaScore,
      dominantDosha: result.dominantDosha,
      assessedAt: new Date()
    };

    await user.save();

    res.json({
      message: 'Assessment successful',
      doshaProfile: user.doshaProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
