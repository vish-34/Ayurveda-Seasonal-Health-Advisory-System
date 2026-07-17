import Advisory from '../models/Advisory.js';
import { detectSeason } from '../utils/seasonDetector.js';

// @desc    Get advisory based on user's dosha and current/overridden season
// @route   GET /api/advisory/current
// @access  Private
export const getCurrentAdvisory = async (req, res) => {
  try {
    const dosha = req.user.doshaProfile ? req.user.doshaProfile.dominantDosha : null;
    
    if (!dosha) {
      return res.status(400).json({ 
        message: 'Dosha assessment required first',
        needsAssessment: true
      });
    }

    // Detect season automatically or use user override query param
    const selectedSeason = req.query.season || detectSeason();

    // Query all advisories matching this combination
    const advisories = await Advisory.find({
      dosha,
      season: selectedSeason,
      status: 'published'
    });

    // Group them by category
    const grouped = {
      Diet: null,
      Herbs: null,
      Yoga: null,
      'Daily Routine': null,
      Precautions: null
    };

    advisories.forEach(adv => {
      grouped[adv.category] = adv;
    });

    res.json({
      dosha,
      season: selectedSeason,
      advisories: grouped
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all advisories (Admin only)
// @route   GET /api/advisory
// @access  Private/Admin
export const getAllAdvisories = async (req, res) => {
  try {
    const advisories = await Advisory.find({});
    res.json(advisories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or Update advisory (Admin only)
// @route   POST /api/advisory
// @access  Private/Admin
export const createOrUpdateAdvisory = async (req, res) => {
  const { dosha, season, category, title, content, tags, status } = req.body;

  if (!dosha || !season || !category || !title || !content) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Upsert behavior: search by compound unique fields, update or create
    const advisory = await Advisory.findOneAndUpdate(
      { dosha, season, category },
      { title, content, tags: tags || [], status: status || 'published' },
      { new: true, upsert: true }
    );

    res.status(201).json(advisory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update advisory by ID (Admin only)
// @route   PUT /api/advisory/:id
// @access  Private/Admin
export const updateAdvisory = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    advisory.title = req.body.title || advisory.title;
    advisory.content = req.body.content || advisory.content;
    advisory.tags = req.body.tags || advisory.tags;
    advisory.status = req.body.status || advisory.status;

    const updatedAdvisory = await advisory.save();
    res.json(updatedAdvisory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete advisory (Admin only)
// @route   DELETE /api/advisory/:id
// @access  Private/Admin
export const deleteAdvisory = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    await advisory.deleteOne();
    res.json({ message: 'Advisory removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
