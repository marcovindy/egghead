const fetchVerifiedQuizzes = require("./FetchVerifiedQuizzes");
const fetchQuestionsForQuiz = require("./FetchQuestionsForQuiz");

async function fetchRandomQuestionsFromVerifiedQuizzes() {
    try {
      const verifiedQuizzes = await fetchVerifiedQuizzes();
      console.log(verifiedQuizzes);
      const allQuestions = [];
  
      for (const quiz of verifiedQuizzes) {
        console.log(quiz);
        const { questions } = await fetchQuestionsForQuiz(quiz.id);
        allQuestions.push(...questions);
      }
  
      const randomQuestions = [];
      const usedQuestionIndices = new Set();
  
      while (randomQuestions.length < 2 && randomQuestions.length < allQuestions.length) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        if (!usedQuestionIndices.has(randomIndex)) {
          randomQuestions.push(allQuestions[randomIndex]);
          usedQuestionIndices.add(randomIndex);
        }
      }
  
      return randomQuestions;
    } catch (error) {
      console.error('Error fetching random questions from verified quizzes:', error);
      throw error;
    }
  }
  


module.exports = fetchRandomQuestionsFromVerifiedQuizzes;