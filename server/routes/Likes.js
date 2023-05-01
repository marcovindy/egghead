// routes/Likes.js

const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    const existingLike = await Likes.findOne({
      where: { userId, quizId },
    });

    if (existingLike) {
      await existingLike.destroy();
      console.log("Unliked userId", userId, "quizId", quizId);
      return res.status(200).json({ message: "Unliked" });
    } else {
      const like = await Likes.create({ userId, quizId });
      console.log("Liked userId", userId, "quizId", quizId);
      return res.status(201).json({ like });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

router.get("/count/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const likeCount = await Likes.count({
      where: { quizId },
    });

    res.status(200).json({ count: likeCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userLikes = await Likes.findAll({
      where: { userId },
    });

    res.status(200).json({ likes: userLikes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
