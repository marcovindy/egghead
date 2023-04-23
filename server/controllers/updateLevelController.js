const { Users } = require('../models');

exports.updateLevel = async (req, res) => {
  const { username } = req.body;

  try {
    console.log('Searching for user:', username);
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      console.error('User not found:', username);
      return res.status(404).send('User not found');
    }

    const currentLevel = user.level;
    const currentExperience = user.experience;
    const newLevel = currentLevel + 1;
    const newExperience = currentExperience - ((100 * currectLevel) / 2);

    console.log('Updating level and experience for user:', username);
    await user.update({ level: newLevel, experience: newExperience });
    console.log('Level updated successfully for user:', username);

    res.status(200).send('Level updated successfully');
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
};
