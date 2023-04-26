const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { updateExperience } = require('../controllers/experienceController');
const { updateLevel } = require('../controllers/updateLevelController');
const { registerUser } = require('../controllers/users/RegisterUserController');
const { loginUser } = require('../controllers/users/LoginUserController');
const { getLeaderboard } = require("../controllers/users/LeaderboardController");


// Použití kontroleru pro registraci uživatele
router.post('/signup', registerUser);

router.post('/login', loginUser);

router.get("/auth", validateToken, (req, res) => {
  return res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  return res.json(basicInfo);
});

router.get("/user/byusername/:username", async (req, res) => {
  const { username } = req.params; // Destructure username from params

  const basicInfo = await Users.findOne({
    where: { username },
    attributes: { exclude: ["password"] },
  });

  return res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      return res.json("SUCCESS");
    });
  });
});

router.post('/update/experience', updateExperience);

router.post('/update/level', updateLevel);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
