import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.div`
  margin: 20px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
`;

const PreviewImage = styled.img`
  max-width: 150px;
  height: auto;
  margin-top: 10px;
  border: 1px solid #eee;
`;

function AddProductForm({ onProductAdded }) {
  const [imagePreview, setImagePreview] = useState("");
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("https://backend-repo-xfxe.onrender.com/api/products", data);
      onProductAdded(); // refresh product list
      reset(); // clear form
      setImagePreview("");
      setApiError(null);
    } catch (err) {
      console.error(err);
      setApiError("Failed to add product. Please try again.");
    }
  };

  const handleBlur = () => {
    const url = watch("imageURL");
    setImagePreview(url);
  };

  return (
    <FormContainer>
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Product Name:</label>
          <input
            {...register("name", { required: "Product name is required" })}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label>Price ($):</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && (
            <p style={{ color: "red" }}>{errors.price.message}</p>
          )}
        </div>

        <div>
          <label>Image URL:</label>
          <input
            {...register("imageURL", {
              required: "Image URL is required",
              pattern: {
                value: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
                message: "Enter a valid image URL",
              },
            })}
            onBlur={handleBlur}
          />
          {errors.imageURL && (
            <p style={{ color: "red" }}>{errors.imageURL.message}</p>
          )}
          {imagePreview && <PreviewImage src={imagePreview} alt="Preview" />}
        </div>

        <button type="submit">Add Product</button>

        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
      </form>
    </FormContainer>
  );
}

export default AddProductForm;
