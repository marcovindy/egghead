const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { updateExperience } = require('../controllers/experienceController');
const { updateLevel } = require('../controllers/updateLevelController');

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      email: email,
      password: hash,
    })
      .then(() => {
        return res.json("Username successfully created");
      }).catch((error) => {
        console.log(error.errors[0].message);
        if (error.errors[0].message === 'email must be unique') {
          return res.status(400).json({ message: 'User with that email already exists' });
        } else if (error.errors[0].message === 'username must be unique') {
          return res.status(400).json({ message: 'User with that username already exists' });
        } else {
          return res.status(500).json({ message: 'An error occurred' });
        }
      });
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User Doesn't Exist" });

  if (user) {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) return res.json({ error: "Wrong Username And Password Combination" });

      const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
      );
      return res.json({ token: accessToken, username: username, id: user.id, email: user.email, experience: user.experience, level: user.level });
    });
  } else {
    return res.status(404).json({ error: "user.password: Not found" });


  }
});

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

router.get("/basicinfobyUsername/:username", async (req, res) => {
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

module.exports = router;
