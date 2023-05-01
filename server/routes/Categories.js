const express = require("express");
const router = express.Router();
const { Categories } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/all", async (req, res) => {
  try {
    const listOfCategories = await Categories.findAll();
    return res.json({ categories: listOfCategories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
