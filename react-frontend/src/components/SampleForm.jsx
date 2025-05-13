import { useForm } from "react-hook-form";

function SampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Enter name"
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        })}
        placeholder="Enter email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default SampleForm;
