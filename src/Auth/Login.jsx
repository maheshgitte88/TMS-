import React, { useState } from "react";
import axios from "axios";
import { serverurl } from "../exportapp";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${serverurl}/api/login`,
        {
          email,
          password,
        }
      );
      login(response.data.token);
      // Extract the token from the response
      const { token } = response.data;
      // Save the token to local storage
      localStorage.setItem("token", token);
      // Handle successful login
      toast.success("Logged in successfully..!");

      const tokens = localStorage.getItem("token");
      const decoded = jwtDecode(tokens);
      if (decoded.user_Roal === "Employee") {
        window.location = "/admin/home";
        // navigate("/admin/home");
      } else {
        // navigate("/user/Ticket");
        window.location = "/user/Ticket";
      }
      //   console.log("Logged in successfully:", token);
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
      toast.success("Logged in failed..!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-400">
      <div className="bg-orange-300 p-8 rounded-lg shadow-md max-w-md w-full m-2">
        <div
          className="bg-cover bg-center h-16 rounded-t-lg"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png')",
          }}
        ></div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
