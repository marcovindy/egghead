// auth.js

const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { updateEarnings } = require("../controllers/users/EarningsController");
const { updateLevel } = require("../controllers/users/updateLevelController");
const { registerUser } = require("../controllers/users/RegisterUserController");
const { loginUser } = require("../controllers/users/LoginUserController");
const {
  changePassword,
} = require("../controllers/users/ChangePasswordController");
const { changeName } = require("../controllers/users/ChangeNameController");
const {
  getLeaderboard,
} = require("../controllers/users/LeaderboardController");

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/auth", validateToken, (req, res) => {
  return res.json(req.user);
});

router.put("/user/byuserId/:userId/description", async (req, res) => {
  const { userId } = req.params;
  const { description } = req.body;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.description = description;
    await user.save();

    res.json({ success: true, message: "Description updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating description", error: error.message });
  }
});


router.get("/user/byusername/:username", async (req, res) => {
  const { username } = req.params;
  const basicInfo = await Users.findOne({
    where: { username },
    attributes: { exclude: ["password"] },
  });
  if (basicInfo) {
    return res.status(200).json(basicInfo);
  } else {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(basicInfo);
});

router.put("/changepassword", validateToken, changePassword);

router.put("/changename", validateToken, changeName);

router.post("/update/earnings", updateEarnings);

router.post("/update/level", updateLevel);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
