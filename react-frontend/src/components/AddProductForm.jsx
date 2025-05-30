import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";

// Styled container for form layout
const FormContainer = styled.div`
  margin: 20px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
`;

// Preview image styling
const PreviewImage = styled.img`
  max-width: 150px;
  height: auto;
  margin-top: 10px;
  border: 1px solid #eee;
`;

// base URL
const backendURL = "https://backend-repo-xfxe.onrender.com";

// To add a new product
function AddProductForm({ onProductAdded }) {
  const [imagePreview, setImagePreview] = useState(""); // URL of selected image to preview
  const [apiError, setApiError] = useState(null);        // error state for submission
  const [images, setImages] = useState([]);              // list of images to populate dropdown

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Fetch image options from backend on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/products/images?api_key=66529166-2cfe-473a-a538-b18bccf32cb7`
        );
        setImages(response.data);
      } catch (err) {
        console.error("Failed to fetch images", err.message);
      }
    };
    fetchImages();
  }, []);

  // Handle form submission to add a new product
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendURL}/api/products`, {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        imageID: parseInt(data.imageID), // reference to image in ImageMaster
      });

      if (response.status === 201) {
        await onProductAdded();    // refresh product list
        reset();                   // reset form
        setImagePreview("");       // clear preview
        setApiError(null);         // clear errors
      }
    } catch (err) {
      console.error(err);
      setApiError("Failed to add product. Please try again.");
    }
  };

  // Update preview when user selects a different image
  const handleImageChange = (e) => {
    const selectedId = e.target.value;
    const selectedImage = images.find((img) => img.imageID === parseInt(selectedId));
    if (selectedImage) {
      setImagePreview(`${backendURL}${selectedImage.imageURL}`);
    }
  };

  return (
    <FormContainer>
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Product Name:</label>
          <input {...register("name", { required: "Product name is required" })} />
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
          {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
        </div>

        <div>
          <label>Price ($):</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price.message}</p>}
        </div>

        <div>
          <label>Select Image:</label>
          <select {...register("imageID", { required: "Image is required" })} onChange={handleImageChange}>
            <option value="">-- Choose an image --</option>
            {images.map((img) => (
              <option key={img.imageID} value={img.imageID}>
                {img.imageURL.split("/").pop()}
              </option>
            ))}
          </select>
          {errors.imageID && <p style={{ color: "red" }}>{errors.imageID.message}</p>}
          {imagePreview && <PreviewImage src={imagePreview} alt="Preview" />}
        </div>

        <button type="submit">Add Product</button>
        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
      </form>
    </FormContainer>
  );
}

export default AddProductForm;
