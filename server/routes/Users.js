const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      email: email,
      password: hash,
    });
    return res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({  error: "User Doesn't Exist" });

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
  console.log("Auth ", req.user);
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

  console.log(username); // Debugging line to check if the value of username is correct

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

module.exports = router;
