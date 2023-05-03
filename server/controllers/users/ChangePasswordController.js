const bcrypt = require("bcrypt");
const { Users } = require("../../models");

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      return res.status(400).json({ error: "Wrong Password Entered!" });
    }

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      return res.status(200).json({ message: "Your password has been changed!" });
    });
  });
};

module.exports = {
  changePassword,
};
