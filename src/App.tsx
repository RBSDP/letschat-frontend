import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Rooms from "./pages/Rooms";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAppDispatch } from "./hooks/hooks";
import { login, logout } from "./features/auth/authSlice";
import { useGetMeQuery } from "./services/api";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

  
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // ✅ Sync user with Redux
  useEffect(() => {
    if (data) {
      dispatch(
        login({
          user: data.data,
          token: token!,
        })
      );
    }

    if (isError) {
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [data, isError, dispatch, token]);

  // ✅ Loading only when token exists
  if (token && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <>
    <Toaster position="top-right" />
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
              <Login />
            </div>
          </div>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
              <Register />
            </div>
          </div>
        }
      />

      {/* Chat */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
              <Chat />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 p-4">
            <Rooms />
          </div>
        </ProtectedRoute>
        }
      />

      <Route
    path="/chat/:roomId"
    element={
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    }
  />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </>
  );
}

export default App;