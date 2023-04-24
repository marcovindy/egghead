const express = require('express');
const router = express.Router();
const { Quizzes, Categories, Users, Answers, Questions } = require('../models');

const { validateToken } = require("../middlewares/AuthMiddleware");
router.post('/create', validateToken, async (req, res) => {
  const { title, categoryIds } = req.body;
  let { language, description } = req.body;
  const userId = req.user.id;
  if (!description) description = "";
  if (!language) language = "English";
  // Validate the data
  console.log(title, language, description, categoryIds);
  if (!title || categoryIds.length === 0 || !language) {
    return res.status(400).json({ message: 'Invalid data' });
  }

console.log(title, description, categoryIds, userId, language);
  try {
    // Create a new quiz object
    const quiz = await Quizzes.create({
      title,
      language,
      description,
      userId,
      verificated: 0,
    });
    // Associate the quiz with the selected categories
    const categories = await Categories.findAll({
      where: { id: categoryIds },
    });
    await quiz.setCategories(categories);
    await quiz.setCategories(categories.map(category => category.id), { through: { updatedAt: new Date() } });
    res.status(201).json({ message: 'Quiz created successfully', quiz, quizId: quiz.id });
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
        {
          model: Questions,
        },
      ],
    });
    return res.json({ quizzes });
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
    return res.json({ quizzes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/byquizId/:id", async (req, res) => {
  const id = req.params.id;
  const quiz = await Quizzes.findByPk(id, {
    include: [
      {
        model: Categories,
        through: "quiz_categories",
        as: "Categories",
      },
    ],
  });
  console.log("router: quiz..", quiz);
  return res.json(quiz);
});


router.delete("/delete/byquizId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const quiz = await Quizzes.findByPk(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.destroy();
    return res.status(200).json({ message: "Quiz has been deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

});


router.delete("/:quizId", validateToken, async (req, res) => {
  const quizId = req.params.quizId;
  await Quizzes.destroy({
    where: {
      id: quizId,
    },
  });

  return res.json("DELETED SUCCESSFULLY");
});


router.put('/title/byquizId/:id', validateToken, async (req, res) => {
  const { title } = req.body;
  const quizId = req.params.id;

  try {
    // Find the quiz by id and update the title
    const quiz = await Quizzes.findByPk(quizId);
    quiz.title = title;
    await quiz.save();

    return res.json({ message: 'Quiz title updated successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update quiz title' });
  }
});

// Add this to your Quizzes router
router.get("/verified", async (req, res) => {
  try {
    const verifiedQuizzes = await Quizzes.findAll({ where: { verificated: true } });
    res.json({ quizzes: verifiedQuizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
