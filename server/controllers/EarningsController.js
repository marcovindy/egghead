const { Users } = require('../models');

exports.updateEarnings = async (req, res) => {
  const { username, experience, gameMode, rank } = req.body;
  try {
    const user = await Users.findOne({ where: { username } });


    if (!user) {
      return res.status(404).send('User not found');
    }


    const updatedExperience = (user.experience + experience);
    const updatedRank = (user.rank + rank);
    console.log( username,"exps", user.experience, experience, updatedExperience, "rank", user.rank, rank, updatedRank);

    await user.update({ experience: updatedExperience, rank: updatedRank});

    res.status(200).send('Experience updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};
