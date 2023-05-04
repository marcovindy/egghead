require('dotenv').config();
const axios = require('axios');
const isProduction = process.env.NODE_ENV === "development";
const questionsApiUrl = isProduction ? "http://localhost:5000/questions"  :  "https://testing-egg.herokuapp.com/questions";



async function fetchQuestionsForQuiz(quizId, category) {
  // console.log(questionsApiUrl, process.env.NODE_ENV);
    try {
      const response = await axios.get(`${questionsApiUrl}/byquizIdAndCategory/${quizId}?category=${category}`);
      // console.log(response.data.questions);
      const quiz = response.data.quiz;
      const questions = response.data.questions;
      const questionsLength = questions.length;
      // console.log("questions length: ", questionsLength);
      const formattedQuestions = questions.map((question) => {
        const formattedAnswers = question.Answers.map((answer) => ({
          text: answer.answer,
          isCorrect: answer.isCorrect,
        }));
        return {
          question: question.question,
          limit: question.limit,
          category: question.category,
          answers: formattedAnswers,
        };
      });
      // console.log("fetched questions = ", formattedQuestions);
      return { quiz, questions: formattedQuestions, questionsLength };
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }
  

module.exports = fetchQuestionsForQuiz;