const axios = require('axios');
const questionsApiUrl = 'http://localhost:5000/questions';
const quizzesApiUrl = 'http://localhost:5000/quizzes';



async function fetchQuestionsForQuiz(quizId) {
    try {
      const response = await axios.get(`${questionsApiUrl}/byquizId/${quizId}`);
      console.log(response.data.questions);
      const quiz = response.data.quiz;
      const questions = response.data.questions;
      const questionsLength = questions.length;
      console.log("questions length: ", questionsLength);
      const formattedQuestions = questions.map((question) => {
        const formattedAnswers = question.Answers.map((answer) => ({
          text: answer.answer,
          isCorrect: answer.isCorrect,
        }));
        return {
          question: question.question,
          answers: formattedAnswers,
        };
      });
      console.log("fetched questions = ", formattedQuestions);
      return { quiz, questions: formattedQuestions, questionsLength };
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }
  

module.exports = fetchQuestionsForQuiz;