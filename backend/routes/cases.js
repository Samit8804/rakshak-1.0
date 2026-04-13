const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MissingPerson = require('../models/MissingPerson');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/cases');
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

router.get('/', async (req, res) => {
  try {
    const { status, gender, minAge, maxAge, location } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }
    if (location) {
      filter['lastSeenLocation.address'] = { $regex: location, $options: 'i' };
    }

    const cases = await MissingPerson.find(filter)
      .populate('reportedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findById(req.params.id)
      .populate('reportedBy', 'username email');
    
    if (!missingPerson) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(missingPerson);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { fullName, age, gender, dateMissing, description, lat, lng, address } = req.body;
    
    const images = req.files ? req.files.map(file => `/uploads/cases/${file.filename}`) : [];

    const lastSeenLocation = {
      type: 'Point',
      coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0],
      address: address || ''
    };

    const missingPerson = new MissingPerson({
      fullName,
      age: parseInt(age),
      gender,
      lastSeenLocation,
      dateMissing: new Date(dateMissing),
      description,
      images,
      reportedBy: req.user.id,
      status: 'Active'
    });

    await missingPerson.save();

    res.status(201).json(missingPerson);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findById(req.params.id);
    
    if (!missingPerson) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (missingPerson.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this case' });
    }

    const updated = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findByIdAndDelete(req.params.id);
    
    if (!missingPerson) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (missingPerson.images) {
      missingPerson.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const missingPerson = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!missingPerson) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(missingPerson);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;