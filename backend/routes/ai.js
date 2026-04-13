const express = require('express');
const axios = require('axios');
const MissingPerson = require('../models/MissingPerson');
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

router.post('/encode', async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ message: 'Image path is required' });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/encode`, {
      image_path: imagePath
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI encode error:', error.message);
    res.status(500).json({ message: 'Failed to encode image', error: error.message });
  }
});

router.post('/match', async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ message: 'Image path is required' });
    }

    const allCases = await MissingPerson.find({ 
      status: 'Active',
      faceEncoding: { $exists: true, $ne: [] }
    });

    if (allCases.length === 0) {
      return res.json({ matches: [], message: 'No stored face encodings found' });
    }

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/match`, {
      image_path: imagePath,
      encodings: allCases.map(c => ({
        id: c._id,
        encoding: c.faceEncoding,
        name: c.fullName
      }))
    }).catch(() => null);

    if (!aiResponse || !aiResponse.data.matches) {
      return res.json({ matches: [], message: 'No matches found' });
    }

    const matches = aiResponse.data.matches.map(match => {
      const caseData = allCases.find(c => c._id.toString() === match.id);
      return {
        caseId: match.id,
        name: caseData?.fullName || match.name,
        image: caseData?.images?.[0] || '',
        similarity: match.similarity,
        status: caseData?.status || 'Active'
      };
    }).filter(m => m.similarity >= 40).sort((a, b) => b.similarity - a.similarity);

    res.json({ matches });
  } catch (error) {
    console.error('AI match error:', error.message);
    res.status(500).json({ message: 'Failed to match faces', error: error.message });
  }
});

router.post('/encode-and-store/:caseId', async (req, res) => {
  try {
    const { imagePath } = req.body;
    const { caseId } = req.params;
    
    if (!imagePath) {
      return res.status(400).json({ message: 'Image path is required' });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/encode`, {
      image_path: imagePath
    });

    if (response.data.encoding) {
      await MissingPerson.findByIdAndUpdate(caseId, {
        faceEncoding: response.data.encoding
      });
    }

    res.json({ success: true, encoding: response.data.encoding });
  } catch (error) {
    console.error('AI encode and store error:', error.message);
    res.status(500).json({ message: 'Failed to encode and store', error: error.message });
  }
});

module.exports = router;