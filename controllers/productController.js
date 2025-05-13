// controllers/productController.js
const db = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT product_id AS id, prod_name AS name, price, description, imageURL
      FROM Products
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description, imageURL } = req.body;
  if (!name || !price || !description || !imageURL) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO Products (prod_name, price, description, imageURL)
      VALUES (?, ?, ?, ?)`,
      [name, price, description, imageURL]
    );
    res.status(201).json({ message: "Product added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, imageURL } = req.body;
  if (!name || !price || !description || !imageURL) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(`
      UPDATE Products
      SET prod_name = ?, price = ?, description = ?, imageURL = ?
      WHERE product_id = ?`,
      [name, price, description, imageURL, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
};

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