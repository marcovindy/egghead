const express = require('express');
const router = express.Router();
const Quiz = require('../models');

// API endpoint for creating a new quiz
router.post('/create', (req, res) => {
  const { title, description, categoryIds } = req.body;

  // Validate the data
  if (!title || !description || categoryIds.length === 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Create a new quiz object
  const quiz = new Quiz({
    title,
    description,
    categories: categoryIds,
  });

  // Save the quiz to the database
  quiz.save((err, quiz) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create quiz' });
    }
    res.status(201).json({ message: 'Quiz created successfully', quiz });
    console.log(res);
  });
});

module.exports = router;
