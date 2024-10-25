const express = require('express');
const router = express.Router();
const Image = require('../models/Image'); // Adjust the path as necessary

// Fetch all slider images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find(); // Fetch images from the database
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
