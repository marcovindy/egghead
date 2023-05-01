const express = require("express");
const router = express.Router();
const { Quizzes, Questions, Answers } = require("../models");

router.post("/save", async (req, res) => {
  const { quizId, questions } = req.body;
  try {
    const quiz = await Quizzes.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    for (const q of questions) {
      const question = await Questions.create({
        question: q.question,
        category: q.category,
        limit: q.limit,
        description: "",
        quizId: quizId,
      });
      for (const a of q.answers) {
        await Answers.create({
          answer: a.answer,
          isCorrect: a.isCorrect,
          questionId: question.id,
        });
      }
    }
    return res.status(200).json({ message: "Quiz questions have been saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/byquizId/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quizzes.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const questions = await Questions.findAll({
      where: { quizId },
      include: [
        {
          model: Answers,
          attributes: ["id", "answer", "isCorrect"],
        },
      ],
    });
    return res.json({ quiz, questions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/length/byquizId/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quizzes.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const questions = await Questions.findAll({
      where: { quizId },
    });
    return res.json({ quiz, questions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.delete('/byquizId/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quizzes.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    await Questions.destroy({
      where: { quizId },
    });
    return res.status(200).json({ message: "Quiz questions have been deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
