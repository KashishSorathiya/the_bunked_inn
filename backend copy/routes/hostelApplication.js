const express = require('express');
const router = express.Router();
const HostelApplication = require('../models/HostelApplication');

// POST: Apply for hostel
router.post('/', async (req, res) => {
  try {
    const newApplication = new HostelApplication(req.body);
    const saved = await newApplication.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
