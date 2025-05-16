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

  const [imagePreview, setImagePreview] = useState("");

  // Prefill form and preview image when editing
  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
      setValue("imageURL", product.imageURL);

      const raw = product.imageURL || "";
      const previewURL = raw.startsWith("http")
        ? raw
        : `${backendURL}/images/${raw}`;
      setImagePreview(previewURL);
    }
  }, [product, setValue]);

  // Live preview when user updates image URL field
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.imageURL) {
        const raw = value.imageURL;
        const previewURL = raw.startsWith("http")
          ? raw
          : `${backendURL}/images/${raw}`;
        setImagePreview(previewURL);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      const imagePath = data.imageURL.startsWith("http")
        ? data.imageURL
        : `${backendURL}/images/${data.imageURL}`;

      const payload = {
        ...data,
        imageURL: imagePath,
      };

      await axios.put(
        `${backendURL}/api/products/${product.id}`,
        payload
      );
      await onProductUpdated(); // ✅ refresh list after update
    } catch (err) {
      console.error("Update failed:", err.message);
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
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
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
          <label>Image URL:</label>
          <input
            {...register("imageURL", {
              required: "Image URL is required",
            })}
          />
          {errors.imageURL && <p>{errors.imageURL.message}</p>}
          {imagePreview && (
            <PreviewImage src={imagePreview} alt="Preview" />
          )}
        </div>

        <MyButton
          label="Save"
          onClickHandler={handleSubmit(onSubmit)}
          isChanged={true}
        />
        <MyButton label="Cancel" onClickHandler={onCancel} isChanged={true} />
      </form>
    </FormContainer>
  );
};

export default EditProductForm;
