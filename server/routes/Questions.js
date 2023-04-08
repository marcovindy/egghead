const express = require('express');
const router = express.Router();
const { Quizzes, Answers, Questions } = require('../models');

const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/save", validateToken, async (req, res) => {
    try {
        const { quizId, questions } = req.body;

        // First, create the quiz questions in the database
        const createdQuestions = await Promise.all(
            questions.map(async (question) => {
                const createdQuestion = await Questions.create({
                    question: question.question,
                    QuizId: quizId,
                });

                // Then, create the question answers in the database
                const createdAnswers = await Promise.all(
                    question.answers.map(async (answer) => {
                        await Answers.create({
                            text: answer.text,
                            isCorrect: answer.isCorrect,
                            QuestionId: createdQuestion.id,
                        });
                    })
                );

                // Return the created question with its answers
                return {
                    question: createdQuestion,
                    answers: createdAnswers,
                };
            })
        );

        res.json({ questions: createdQuestions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/questions", async (req, res) => {
    try {
      const questions = req.body.questions;
      const quiz = await Quiz.findByPk(req.body.quizId);
      const createdQuestions = await Promise.all(
        questions.map((q) => {
          return quiz.createQuestion({ question: q.question }).then((createdQuestion) => {
            const createdAnswers = q.answers.map((a) => {
              return createdQuestion.createAnswer({ answer: a.answer, isCorrect: a.isCorrect });
            });
            return Promise.all(createdAnswers).then(() => createdQuestion);
          });
        })
      );
      res.status(201).json(createdQuestions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  


module.exports = router;
