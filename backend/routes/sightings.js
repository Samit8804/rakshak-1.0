const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Sighting = require('../models/Sighting');
const MissingPerson = require('../models/MissingPerson');
const { auth } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/sightings');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { caseId, location, description } = req.body;
    
    const missingPerson = await MissingPerson.findById(caseId);
    if (!missingPerson) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const imagePath = req.file ? `/uploads/sightings/${req.file.filename}` : '';

    const sighting = new Sighting({
      caseId,
      image: imagePath,
      location,
      description,
      reportedBy: req.user.id,
      status: 'Pending'
    });

    await sighting.save();

    res.status(201).json(sighting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/case/:caseId', async (req, res) => {
  try {
    const sightings = await Sighting.find({ caseId: req.params.caseId })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });

    res.json(sightings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const sighting = await Sighting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!sighting) {
      return res.status(404).json({ message: 'Sighting not found' });
    }

    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;