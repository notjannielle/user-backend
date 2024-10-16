const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ enabled: true });
    if (!announcement) {
      return res.status(404).json({ message: 'No active announcement found' });
    }
    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Send error message
  }
});


module.exports = router;
