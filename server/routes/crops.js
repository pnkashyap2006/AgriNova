const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get crop recommendations based on environmental conditions
router.post('/recommendations', [
  body('temperature').isFloat(),
  body('rainfall').isFloat(),
  body('pH').isFloat(),
  body('season').isIn(['Kharif', 'Rabi', 'Zaid']),
  body('soilType').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recommendations = await Crop.getRecommendations(req.body);
    res.json(recommendations);
  } catch (err) {
    console.error('Error getting crop recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get disease information for a specific crop
router.get('/:cropId/diseases/:diseaseName', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const diseaseInfo = crop.getDiseaseInfo(req.params.diseaseName);
    if (!diseaseInfo) {
      return res.status(404).json({ message: 'Disease information not found' });
    }

    res.json(diseaseInfo);
  } catch (err) {
    console.error('Error getting disease information:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cultivation practices for a specific crop
router.get('/:cropId/practices', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json(crop.cultivationPractices);
  } catch (err) {
    console.error('Error getting cultivation practices:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new crop (admin only)
router.post('/', [auth, 
  body('name').notEmpty(),
  body('season').isIn(['Kharif', 'Rabi', 'Zaid']),
  body('soilType').notEmpty(),
  body('minTemperature').isFloat(),
  body('maxTemperature').isFloat(),
  body('minRainfall').isFloat(),
  body('maxRainfall').isFloat(),
  body('minpH').isFloat(),
  body('maxpH').isFloat(),
  body('growthDuration').isInt(),
  body('waterRequirement').isFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    console.error('Error adding new crop:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop information (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json(crop);
  } catch (err) {
    console.error('Error updating crop:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a crop (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (err) {
    console.error('Error deleting crop:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 