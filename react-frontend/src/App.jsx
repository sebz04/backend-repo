import { useEffect, useState } from "react";
import axios from "axios";
import HelloCard from "./components/HelloCard";
import SampleForm from "./components/SampleForm";
import AddProductForm from "./components/AddProductForm";
import EditProductForm from "./components/EditProductForm";
import ProductList from "./components/ProductList";

function App() {
  // State for view mode: either "add" or "edit"
  const [view, setView] = useState("add");

  // State to hold the list of products from the backend
  const [products, setProducts] = useState([]);

  // State to track which product is selected for editing
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch product data from backend and update UI
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://backend-repo-xfxe.onrender.com/api/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  };

  // Fetch products when app loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete action and refresh product list
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-repo-xfxe.onrender.com/api/products/${id}`);
      fetchProducts(); // refresh list after deletion
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // Set the selected product and switch to edit view
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setView("edit");
  };

  return (
    <>
      <h1>React Frontend Setup Complete</h1>

      <HelloCard />
      <SampleForm />

      {/* Show AddProductForm if in 'add' mode */}
      {view === "add" && (
        <AddProductForm onProductAdded={fetchProducts} />
      )}

      {/* Show EditProductForm if editing a product */}
      {view === "edit" && selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          onCancel={() => setView("add")}
          onProductUpdated={() => {
            fetchProducts(); // refresh product list after edit
            setView("add");
          }}
        />
      )}

      {/* Display list of products with edit/delete handlers */}
      <ProductList
        products={products}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
      />
    </>
  );
}

export default App;
