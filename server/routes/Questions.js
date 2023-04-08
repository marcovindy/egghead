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
        description: "",
        quizId: quizId,
      });
      for (const a of q.answers) {
        console.log(a);
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

module.exports = router;
