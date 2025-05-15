import { useEffect, useState } from "react";
import axios from "axios";
import HelloCard from "./components/HelloCard";
import SampleForm from "./components/SampleForm";
import AddProductForm from "./components/AddProductForm";
import EditProductForm from "./components/EditProductForm";
import ProductList from "./components/ProductList";

function App() {
  const [view, setView] = useState("add"); // "add" or "edit"
  const [products, setProducts] = useState([]); // product list
  const [selectedProduct, setSelectedProduct] = useState(null); // product to edit

  // Fetch product list from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://backend-repo-xfxe.onrender.com/api/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-repo-xfxe.onrender.com/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // Edit icon click
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setView("edit");
  };

  return (
    <>
      <h1>React Frontend Setup Complete</h1>
      <HelloCard />
      <SampleForm />

      {view === "add" && (
        <AddProductForm onProductAdded={fetchProducts} />
      )}

      {view === "edit" && selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          onCancel={() => setView("add")}
          onProductUpdated={() => {
            fetchProducts();
            setView("add");
          }}
        />
      )}

      <ProductList
        products={products}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
      />
    </>
  );
}

export default App;
