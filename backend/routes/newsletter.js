const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Get all newsletter subscriptions
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subscribe to newsletter (from landing page)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Newsletter subscription request:', { email, body: req.body });
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email: email.toLowerCase() });
    const newSubscriber = await newsletter.save();
    
    console.log('Newsletter subscription successful:', newSubscriber);
    res.status(201).json({ message: 'Successfully subscribed to newsletter', data: newSubscriber });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(400).json({ message: error.message || 'Failed to subscribe. Please try again.' });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
