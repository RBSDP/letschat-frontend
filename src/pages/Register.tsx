import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

function Register() {

  const navigate = useNavigate();
  const [registerUser, { isLoading, error, isSuccess }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap();
      setTimeout(() => {
      navigate("/login");
    }, 3000);
      console.log("Registered successfully");
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        {/* Username */}
        <input
          className="border w-full p-2 mb-2 rounded"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
          })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">
            {errors.username.message}
          </p>
        )}

        {/* Email */}
        <input
          className="border w-full p-2 mb-2 rounded"
          placeholder="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <input
          className="border w-full p-2 mb-2 rounded"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Min 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white w-full p-2 rounded mt-3"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {isSuccess && (
          <p className="text-green-600 text-sm mt-3 text-center">
            Registration successful! You can login now.
          </p>

        )}

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            Registration failed
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;