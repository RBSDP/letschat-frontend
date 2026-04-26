import { useAppDispatch } from "../hooks/hooks";
import { login } from "../features/auth/authSlice";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data).unwrap();

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      dispatch(
        login({
          user: user,
          token: token,
        })
      );

      navigate("/rooms");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Login to Your Account
      </h2>

      {/* Email */}
      <input
        className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full p-2 mb-2 rounded"
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
        className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full p-2 mb-2 rounded"
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

      {/* Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 transition text-white w-full p-2 rounded mt-3 font-medium disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {/* API Error */}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">
          Invalid email or password
        </p>
      )}

      {/* 🔥 Register Link */}
      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-500 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default Login;