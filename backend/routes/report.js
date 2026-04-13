const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Report = require('../models/Report');

// Protected: Submit a missing report
router.post('/', protect, async (req, res) => {
  const { name, age, location, description } = req.body;
  if (!name || !location || !description) {
    return res.status(400).json({ msg: 'Please enter required fields' });
  }
  try {
    const report = new Report({ user: req.user.id, name, age, location, description });
    await report.save();
    res.json({ msg: 'Report submitted', report });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Get all reports (admin only)
router.get('/all', protect, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Not authorized as admin' });
  }
  try {
    const reports = await Report.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Patch a report (archive/unarchive)
router.patch('/:id', protect, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Not authorized as admin' });
  }
  const { archived } = req.body
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { archived }, { new: true })
    if (!report) return res.status(404).json({ msg: 'Report not found' })
    res.json(report)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Delete a report
router.delete('/:id', protect, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Not authorized as admin' });
  }
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ msg: 'Report not found' })
    await Report.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Report deleted' })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get current user's reports
router.get('/mine', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
