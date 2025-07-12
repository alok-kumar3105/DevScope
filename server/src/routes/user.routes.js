const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Add bookmark
router.post('/bookmark', auth, async (req, res) => {
  try {
    const { username, tag } = req.body;

    const user = await User.findById(req.user._id);
    
    // Check if already bookmarked
    const existingBookmark = user.bookmarkedDevs.find(
      dev => dev.username === username
    );

    if (existingBookmark) {
      return res.status(400).json({ message: 'Developer already bookmarked' });
    }

    user.bookmarkedDevs.push({ username, tag });
    await user.save();

    res.json(user.bookmarkedDevs);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

// Remove bookmark
router.delete('/bookmark/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findById(req.user._id);
    user.bookmarkedDevs = user.bookmarkedDevs.filter(
      dev => dev.username !== username
    );
    
    await user.save();
    res.json(user.bookmarkedDevs);
  } catch (error) {
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

// Get all bookmarks
router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.bookmarkedDevs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

// Save comparison
router.post('/comparisons', auth, async (req, res) => {
  try {
    const { dev1, dev2, winner } = req.body;
    
    const user = await User.findById(req.user._id);

    // Check for duplicate comparison in the last minute
    const recentDuplicate = user.comparisons.find(comp => {
      const isDuplicate = (
        ((comp.dev1 === dev1 && comp.dev2 === dev2) || 
         (comp.dev1 === dev2 && comp.dev2 === dev1)) &&
        comp.winner === winner
      );
      const isRecent = (Date.now() - new Date(comp.comparedAt).getTime()) < 60000; // within last minute
      return isDuplicate && isRecent;
    });

    if (recentDuplicate) {
      return res.json(user.comparisons); // Return existing comparisons without adding duplicate
    }
    
    // Add new comparison at the beginning of the array
    user.comparisons.unshift({ dev1, dev2, winner });
    
    // Keep only the last 10 comparisons
    if (user.comparisons.length > 10) {
      user.comparisons = user.comparisons.slice(0, 10);
    }
    
    await user.save();
    res.json(user.comparisons);
  } catch (error) {
    res.status(500).json({ message: 'Error saving comparison' });
  }
});

// Get comparison history
router.get('/comparisons', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Sort comparisons by date, most recent first
    const sortedComparisons = user.comparisons.sort((a, b) => 
      new Date(b.comparedAt) - new Date(a.comparedAt)
    );
    res.json(sortedComparisons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comparisons' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { username, email } },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router; 