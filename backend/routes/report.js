const express = require('express');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name, age, location, description } = req.body;
    
    const report = new Report({
      name,
      age,
      location,
      description,
      user: req.user.id
    });

    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

