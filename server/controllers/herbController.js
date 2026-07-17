import Herb from '../models/Herb.js';

// @desc    Get all herbs with search/filter
// @route   GET /api/herbs
// @access  Public
export const getHerbs = async (req, res) => {
  const { search, dosha, season } = req.query;
  let query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (dosha) {
    query.doshaAffinity = dosha;
  }
  if (season) {
    query.seasons = season;
  }

  try {
    const herbs = await Herb.find(query);
    res.json(herbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single herb details
// @route   GET /api/herbs/:id
// @access  Public
export const getHerbById = async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) {
      return res.status(404).json({ message: 'Herb not found' });
    }
    res.json(herb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new herb (Admin only)
// @route   POST /api/herbs
// @access  Private/Admin
export const createHerb = async (req, res) => {
  const { name, description, benefits, howToUse, image, doshaAffinity, seasons } = req.body;

  if (!name || !description || !benefits || !howToUse) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const herbExists = await Herb.findOne({ name });
    if (herbExists) {
      return res.status(400).json({ message: 'Herb already exists' });
    }

    const herb = await Herb.create({
      name,
      description,
      benefits,
      howToUse,
      image: image || '',
      doshaAffinity: doshaAffinity || [],
      seasons: seasons || []
    });

    res.status(201).json(herb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update herb details (Admin only)
// @route   PUT /api/herbs/:id
// @access  Private/Admin
export const updateHerb = async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) {
      return res.status(404).json({ message: 'Herb not found' });
    }

    herb.name = req.body.name || herb.name;
    herb.description = req.body.description || herb.description;
    herb.benefits = req.body.benefits || herb.benefits;
    herb.howToUse = req.body.howToUse || herb.howToUse;
    herb.image = req.body.image || herb.image;
    herb.doshaAffinity = req.body.doshaAffinity || herb.doshaAffinity;
    herb.seasons = req.body.seasons || herb.seasons;

    const updatedHerb = await herb.save();
    res.json(updatedHerb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a herb (Admin only)
// @route   DELETE /api/herbs/:id
// @access  Private/Admin
export const deleteHerb = async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) {
      return res.status(404).json({ message: 'Herb not found' });
    }
    await herb.deleteOne();
    res.json({ message: 'Herb deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
