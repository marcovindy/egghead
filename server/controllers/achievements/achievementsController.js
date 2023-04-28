const { Achievements } = require("../../models");

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievements.findAll();
    res.status(200).json(achievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving achievements" });
  }
};

module.exports = { getAllAchievements };
