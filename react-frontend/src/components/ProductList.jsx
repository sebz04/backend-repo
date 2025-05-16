// ProductList.jsx
import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTimes } from 'react-icons/fa';

// Container for the product list
const ProductListContainer = styled.div`
  margin: 20px;
`;

// Product List Layout
const ProductItem = styled.li`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

// Product image styling
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

// ProductList displays the list of products with edit/delete 
const ProductList = ({ products, onEditClick, onDeleteClick }) => {
  // If no products, show fallback message
  if (!products || products.length === 0) return <p>No products available.</p>;

  return (
    <ProductListContainer>
      <h2>Product List</h2>
      <ul style={{ padding: 0 }}>
        {products.map((product) => (
          <ProductItem key={product.id}>
            {/* Show image if available */}
            {product.imageURL && (
              <ProductImage src={product.imageURL} alt={product.name} />
            )}

            <ProductInfo>
              <strong>{product.name}</strong> - ${product.price}<br />
              <em>{product.description}</em><br />

              {/* Edit and Delete icons */}
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
    </ProductListContainer>
  );
};

export default ProductList;
