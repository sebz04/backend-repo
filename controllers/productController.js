const db = require("../db");

// 🔹 GET all products with image URL from ImageMaster
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

// 🔹 CREATE a new product
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

// 🔹 UPDATE an existing product
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
      [name, price, description, imageID || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
};

// 🔹 DELETE a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM Products WHERE product_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
};
