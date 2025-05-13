// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes); // ⬅️ All product APIs under this path

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
