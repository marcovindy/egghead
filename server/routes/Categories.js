const express = require("express");
const router = express.Router();
const { Categories } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
    const listOfCategories = await Categories.findAll();
    return res.json({ listOfCategories: listOfCategories});
});

module.exports = router;