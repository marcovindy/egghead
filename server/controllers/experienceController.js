const { Users } = require('../models');

exports.updateExperience = async (req, res) => {
  const { username, experience } = req.body;
  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send('User not found');
    }
    const updatedExperience = user.experience + experience;
    console.log(user.experience, experience, updatedExperience);

    await user.update({ experience: updatedExperience });

    res.status(200).send('Experience updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};
