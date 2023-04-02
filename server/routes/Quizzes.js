const express = require('express');
const router = express.Router();
const { Quizzes, Categories, Users } = require('../models');

const { validateToken } = require("../middlewares/AuthMiddleware");

router.post('/create', validateToken, async (req, res) => {
  const { title, description, categoryIds } = req.body;
  const userId = req.user.id;

  // Validate the data
  if (!title || !description || categoryIds.length === 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Create a new quiz object
    const quiz = await Quizzes.create({
      title,
      description,
      userId,
    });

    // Associate the quiz with the selected categories
    const categories = await Categories.findAll({
      where: { id: categoryIds },
    });
    await quiz.setCategories(categories);
    await quiz.setCategories(categories.map(category => category.id), { through: { updatedAt: new Date() } });


    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

router.get("/", validateToken, async (req, res) => {
  try {
    const quizzes = await Quizzes.findAll({
      include: [
        {
          model: Categories,
          through: "quiz_categories",
          as: "Categories", 
        },
        {
          model: Users,
        },
      ],
    });
    res.json({ quizzes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/byuserId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const quizzes = await Quizzes.findAll({
      include: [
        {
          model: Categories,
          through: "quiz_categories",
          as: "Categories", 
        },
        {
          model: Users,
        },
      ],
      where: { userId: id },
    });
    res.json({ quizzes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/byquizId/:id", async (req, res) => {
  const id = req.params.id;
  const quiz = await Quizzes.findByPk(id);
  console.log(quiz);
  res.json(quiz);
});

router.delete("/:quizId", validateToken, async (req, res) => {
  const quizId = req.params.quizId;
  await Quizzes.destroy({
    where: {
      id: quizId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
