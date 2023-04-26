const { Users } = require('../../models');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    await Users.create({
      username: username,
      email: email,
      password: hash,
    });

    return res.json("Username successfully created");
  } catch (error) {
    console.log(error.errors[0].message);

    if (error.errors[0].message === 'email must be unique') {
      return res.status(400).json({ message: 'User with that email already exists' });
    } else if (error.errors[0].message === 'username must be unique') {
      return res.status(400).json({ message: 'User with that username already exists' });
    } else {
      return res.status(500).json({ message: 'An error occurred' });
    }
  }
};

module.exports = {
  registerUser,
};
