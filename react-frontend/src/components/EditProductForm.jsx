import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import MyButton from "./MyButton";

const FormContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  margin: 16px;
  border-radius: 12px;
`;

const PreviewImage = styled.img`
  max-width: 150px;
  height: auto;
  margin-top: 10px;
  border: 1px solid #eee;
`;

const backendURL = "https://backend-repo-xfxe.onrender.com";

const EditProductForm = ({ product, onCancel, onProductUpdated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  // 🔹 Fetch available images for dropdown
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/products/images?api_key=66529166-2cfe-473a-a538-b18bccf32cb7`);
        setImages(response.data);
      } catch (err) {
        console.error("Failed to fetch images", err.message);
      }
    };
    fetchImages();
  }, []);

  // 🔹 Prefill form once product AND images are loaded
  useEffect(() => {
    if (product && images.length > 0) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);

      const matchedImage = images.find((img) => `${backendURL}${img.imageURL}` === product.imageURL);
      if (matchedImage) {
        setValue("imageID", matchedImage.imageID);
        setImagePreview(`${backendURL}${matchedImage.imageURL}`);
      }
    }
  }, [product, images, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        imageID: parseInt(data.imageID),
      };

      await axios.put(`${backendURL}/api/products/${product.id}`, payload);
      await onProductUpdated(); // ✅ refresh product list
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleImageChange = (e) => {
    const selected = images.find(img => img.imageID === parseInt(e.target.value));
    if (selected) {
      setImagePreview(`${backendURL}${selected.imageURL}`);
    }
  };

  return (
    <FormContainer>
      <h3>Edit Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input {...register("name", { required: "Name is required" })} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Min 10 characters" },
            })}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p>{errors.price.message}</p>}
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
          {errors.imageID && <p>{errors.imageID.message}</p>}
          {imagePreview && <PreviewImage src={imagePreview} alt="Preview" />}
        </div>

        <MyButton label="Save" onClickHandler={handleSubmit(onSubmit)} isChanged={true} />
        <MyButton label="Cancel" onClickHandler={onCancel} isChanged={true} />
      </form>
    </FormContainer>
  );
};

export default EditProductForm;
