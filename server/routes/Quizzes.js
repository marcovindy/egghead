const express = require('express');
const router = express.Router();
const { Quizzes, Categories, Users, Answers, Questions } = require('../models');

const { validateToken } = require("../middlewares/AuthMiddleware");

router.post('/create', validateToken, async (req, res) => {
  const { title, language, description, categoryIds } = req.body;
  const userId = req.user.id;

  if (!description) description = "";

  // Validate the data
  if (!title || !description || categoryIds.length === 0 || !language) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Create a new quiz object
    const quiz = await Quizzes.create({
      title,
      language,
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
  return res.json(quiz);
});


router.delete("/delete/byquizId/:id", async (req, res) => {
  console.log("delete");
  try {
    const id = req.params.id;
    console.log(id);
    const quiz = await Quizzes.findByPk(id);
    console.log(quiz);
    if (!quiz) {
      console.log(quiz);
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




module.exports = router;
