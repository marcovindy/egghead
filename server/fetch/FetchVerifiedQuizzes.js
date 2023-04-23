const axios = require('axios');
const questionsApiUrl = 'http://localhost:5000/questions';
const quizzesApiUrl = 'http://localhost:5000/quizzes';



async function fetchVerifiedQuizzes() {
    try {
      const response = await axios.get(`${quizzesApiUrl}/verified`);
      const verifiedQuizzes = response.data.quizzes;
      return verifiedQuizzes;
    } catch (error) {
      console.error('Error fetching verified quizzes:', error);
      throw error;
    }
  }
  


module.exports = fetchVerifiedQuizzes;