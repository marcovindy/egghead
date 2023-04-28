const { Achievements, UserAchievements } = require("../../models");

const getAllAchievements = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId, 10);
    const achievements = await Achievements.findAll({
      include: [
        {
          model: UserAchievements,
          where: { userId },
          required: false,
        },
      ],
    });

    const formattedAchievements = achievements.map((achievement) => ({
      ...achievement.get(),
      unlocked: achievement.UserAchievements !== null,
    }));

    res.status(200).json(formattedAchievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving achievements" });
  }
};

module.exports = { getAllAchievements };
