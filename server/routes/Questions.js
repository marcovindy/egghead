



const express = require('express');
const router = express.Router();
const { Quizzes, Categories, Users, Answers, Questions } = require('../models');

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


module.exports = router;
