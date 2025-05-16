// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const imageRoutes = require("./routes/imageRoutes"); // ✅ Add this line

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Serve actual image files from /public/images folder
app.use("/images", express.static("public/images"));

// ✅ Product APIs
app.use("/api/products", productRoutes);

// ✅ New Image API to list image filenames with ?api_key=...
app.use("/api/images", imageRoutes); // ⬅️ Mount the imageRoutes handler

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
