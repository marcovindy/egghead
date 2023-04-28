const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievements/achievementsController");

router.get("/", achievementsController.getAllAchievements);

module.exports = router;
