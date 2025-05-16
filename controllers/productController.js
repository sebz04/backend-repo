const db = require("../db");

// Fetch all products and imageURL from SQL query
// If no image is found, it uses a default "no-image" like in Project 1
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.product_id AS id,
        p.prod_name AS name,
        p.price,
        p.description,
        CASE 
          WHEN i.imageURL IS NOT NULL THEN CONCAT('https://backend-repo-xfxe.onrender.com', i.imageURL)
          ELSE 'https://backend-repo-xfxe.onrender.com/images/no-image.jpg'
        END AS imageURL
      FROM Products p
      LEFT JOIN ImageMaster i ON p.imageID = i.imageID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
};

// Add a new product to the database with requirmenets
// Inserts the product into the Products table and returns the new product ID.
exports.createProduct = async (req, res) => {
  const { name, price, description, imageID } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ error: "Name, price, and description are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Products (prod_name, price, description, imageID)
       VALUES (?, ?, ?, ?)`,
      [name, price, description, imageID || null]
    );
    res.status(201).json({ message: "Product added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
};

// Update an existing product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, imageID } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ error: "Name, price, and description are required" });
  }

  try {
    const [result] = await db.query(
      `UPDATE Products
       SET prod_name = ?, price = ?, description = ?, imageID = ?
       WHERE product_id = ?`,
      [name, price, description, imageID || null, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Deleting product with ID:", id);

  try {
    const [result] = await db.query(
      "DELETE FROM Products WHERE product_id = ?",
      [parseInt(id)]
    );
    if (result.affectedRows === 0) {
      console.warn("❌ No product found with ID:", id);
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("🔥 Delete failed:", err.message);
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
};

// Returns all images from the ImageMaster table (imageID and imageURL)
// Requires a valid API key in the query string to authorize access
exports.getImageList = async (req, res) => {
  const apiKey = req.query.api_key;
  const validKey = "66529166-2cfe-473a-a538-b18bccf32cb7";

  if (apiKey !== validKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  try {
    const [rows] = await db.query("SELECT imageID, imageURL FROM ImageMaster");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
};
