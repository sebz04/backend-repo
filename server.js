// server.js 

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes"); // Routes to handle products
const imageRoutes = require("./routes/imageRoutes");     // Routes for the images 

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for cross-origin requests (React frontend <-> Node backend)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static image files from /public/images directory
app.use("/images", express.static("public/images"));

// Mount product-related API routes at /api/products
app.use("/api/products", productRoutes);

// Mount image listing API at /api/images (secured with API key)
app.use("/api/images", imageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
