const express = require("express");
const router = express.Router();
const { Categories } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
    const listOfCategories = await Categories.findAll();
    res.json({ listOfCategories: listOfCategories});
    console.log("List of categories in routes: " , listOfCategories);
});

module.exports = router;