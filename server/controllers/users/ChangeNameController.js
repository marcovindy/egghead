// ChangeNameController.js

const { Users } = require("../../models");

const changeName = async (req, res) => {
  const { newUsername } = req.body;
  const { id } = req.user;

  try {
    await Users.update({ username: newUsername }, { where: { id } });
    res.json({ success: true, message: "Username successfully changed." });
  } catch (error) {
    console.error("Error changing username:", error);
    res.status(500).json({ success: false, message: "Error changing username." });
  }
};

module.exports = { changeName };
