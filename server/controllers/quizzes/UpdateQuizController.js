const { Quizzes } = require('../../models');

const updateQuizDescription = async (req, res) => {
  const { quizId } = req.params;
  const { description } = req.body;

  try {
    await Quizzes.update(
      { description },
      { where: { id: quizId } }
    );
    res.status(200).json({ message: 'Quiz description updated successfully' });
  } catch (error) {
    console.error('Error updating quiz description:', error);
    res.status(500).json({ message: 'Error updating quiz description' });
  }
};


const updateQuizLanguage = async (req, res) => {
    const { quizId } = req.params;
    const { language } = req.body;
    console.log(language);
    console.log(quizId);
    try {
      await Quizzes.update(
        { language },
        { where: { id: quizId } }
      );
      res.status(200).json({ message: 'Quiz language updated successfully' });
    } catch (error) {
      console.error('Error updating quiz description:', error);
      res.status(500).json({ error: 'Error updating quiz language' });
    }
  };
  

module.exports = {
  updateQuizDescription, updateQuizLanguage,
};
