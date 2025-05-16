// ProductList.jsx
import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTimes } from 'react-icons/fa';

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

const ProductList = ({ products, onEditClick, onDeleteClick }) => {
  if (!products || products.length === 0) return <p>No products available.</p>;

  return (
    <ProductListContainer>
      <h2>Product List</h2>
      <ul style={{ padding: 0 }}>
        {products.map((product) => (
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
    </ProductListContainer>
  );
};

export default ProductList;
