import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // 🛠️ Signup function with proper typing
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5100/user/signup", {
        name,
        email,
        password,
      });

      console.log("Response:", res.data);
      alert("✅ Signup Successful!");
      navigate("/login"); // Signup ke baad login page par le jao
    } catch (error) {
      console.error("❌ Signup failed:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Signup failed!");
      } else {
        alert("Server error. Please try again!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="bg-black p-8 rounded-lg shadow-lg w-96 text-white" // 👈 bg-black + text-white
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Name Field */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
          required
        />

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
