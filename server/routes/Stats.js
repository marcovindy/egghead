const express = require("express");
const router = express.Router();
const { Quizzes, Users, Stats } = require("../models");
const statsController = require('../controllers/StatsController');

router.post('/saveStats', statsController.saveStats);

module.exports = router;