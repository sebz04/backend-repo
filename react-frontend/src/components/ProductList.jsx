import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaEdit, FaTimes } from 'react-icons/fa';

// Styled-components
const ProductListContainer = styled.div`
  margin: 20px;
`;

const ProductItem = styled.li`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 8px;
`;

const ProductList = ({ onEditClick, onDeleteClick }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend-repo-xfxe.onrender.com/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ProductListContainer>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {products.map(product => (
            <ProductItem key={product.id}>
              {product.imageURL && (
                <ProductImage src={product.imageURL} alt={product.name} />
              )}
              <ProductInfo>
                <strong>{product.name}</strong> - ${product.price}<br />
                <em>{product.description}</em><br />
                <IconButton onClick={() => onEditClick(product)} title="Edit">
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => onDeleteClick(product.id)} title="Delete">
                  <FaTimes />
                </IconButton>
              </ProductInfo>
            </ProductItem>
          ))}
        </ul>
      )}
    </ProductListContainer>
  );
};

export default ProductList;
