// auth.js

const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { updateEarnings } = require("../controllers/EarningsController");
const { updateLevel } = require("../controllers/updateLevelController");
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

router.get("/user/byusername/:username", async (req, res) => {
  const { username } = req.params;
  const basicInfo = await Users.findOne({
    where: { username },
    attributes: { exclude: ["password"] },
  });
  return res.json(basicInfo);
});

router.put("/changepassword", validateToken, changePassword);

router.put("/changename", validateToken, changeName);

router.post("/update/earnings", updateEarnings);

router.post("/update/level", updateLevel);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
