require("dotenv").config();

const axios = require("axios");

const isProduction = process.env.NODE_ENV === "development";
const quizzesApiUrl = isProduction
  ? "http://localhost:5000/quizzes"
  : "https://testing-egg.herokuapp.com/quizzes";

async function fetchVerifiedQuizzes() {
  console.log(quizzesApiUrl, process.env.NODE_ENV);
  try {
    const response = await axios.get(`${quizzesApiUrl}/verified`);
    const verifiedQuizzes = response.data.quizzes;
    return verifiedQuizzes;
  } catch (error) {
    console.error("Error fetching verified quizzes:", error);
    throw error;
  }
}

module.exports = fetchVerifiedQuizzes;
