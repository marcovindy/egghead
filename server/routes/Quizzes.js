const express = require('express');
const router = express.Router();
const { Quizzes, Categories } = require('../models');

router.post('/create',validateToken,async (req, res) => {
  const { title, description, categoryIds } = req.body;

  // Validate the data
  if (!title || !description || categoryIds.length === 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Create a new quiz object
    const quiz = await Quizzes.create({
      title,
      description,
    });

    // Associate the quiz with the selected categories
    const categories = await Categories.findAll({
      where: { id: categoryIds },
    });
    await quiz.setCategories(categories);

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

module.exports = router;
