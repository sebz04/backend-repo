import React, { useEffect } from "react";
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

const EditProductForm = ({ product, onCancel, onProductUpdated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
      setValue("imageURL", product.imageURL);
    }
  }, [product]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`https://backend-repo-xfxe.onrender.com/api/products/${product.id}`, data);
      onProductUpdated();
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
          <textarea {...register("description", { required: "Description is required" })} />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div>
          <label>Price:</label>
          <input type="number" {...register("price", { required: "Price is required" })} />
          {errors.price && <p>{errors.price.message}</p>}
        </div>

        <div>
          <label>Image URL:</label>
          <input {...register("imageURL", { required: "Image URL is required" })} />
          {errors.imageURL && <p>{errors.imageURL.message}</p>}
        </div>

        <MyButton label="Save" onClickHandler={handleSubmit(onSubmit)} isChanged={true} />
        <MyButton label="Cancel" onClickHandler={onCancel} isChanged={true} />
      </form>
    </FormContainer>
  );
};

export default EditProductForm;
