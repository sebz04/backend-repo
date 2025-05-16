// routes/imageRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  const apiKey = req.query.api_key;
  const validApiKey = "66529166-2cfe-473a-a538-b18bccf32cb7";

  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const imageDir = path.join(__dirname, "..", "public", "images");
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read image directory" });
    }

    const images = files.map((file) => ({
      file,
      url: `/images/${file}`,
    }));

    res.json(images);
  });
});

module.exports = router;
