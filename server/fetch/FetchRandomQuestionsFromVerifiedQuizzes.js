const fetchVerifiedQuizzes = require("./FetchVerifiedQuizzes");
const fetchQuestionsForQuiz = require("./FetchQuestionsForQuiz");
async function fetchRandomQuestionsFromVerifiedQuizzes(category) {
  try {
    const verifiedQuizzes = await fetchVerifiedQuizzes();
    console.log(verifiedQuizzes);
    const allQuestions = [];

    for (const quiz of verifiedQuizzes) {
      console.log(quiz);
      const { questions } = await fetchQuestionsForQuiz(quiz.id, category);
      allQuestions.push(...questions);
    }

    // Vybereme 5 náhodných otázek z allQuestions
    const randomQuestions = [];
    const usedIndices = new Set();
    const numQuestionsToSelect = Math.min(5, allQuestions.length);

    while (randomQuestions.length < numQuestionsToSelect) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        randomQuestions.push(allQuestions[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    console.log("Qs: ", randomQuestions);
    return randomQuestions;
  } catch (error) {
    console.error(
      "Error fetching random questions from verified quizzes:",
      error
    );
    throw error;
  }
}

module.exports = fetchRandomQuestionsFromVerifiedQuizzes;
