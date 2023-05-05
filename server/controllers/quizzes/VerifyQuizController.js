// VerifyQuizController.js

const { Quizzes } = require("../../models");

const verifyQuiz = async (req, res) => {
  const { id } = req.params;
  const { verificated } = req.body;

  try {
    await Quizzes.update({ verificated }, { where: { id } });
    res
      .status(200)
      .send({
        message: `Quiz has been ${
          verificated ? "verified" : "unverified"
        } successfully.`,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred during quiz verification." });
  }
};

module.exports = { verifyQuiz };
