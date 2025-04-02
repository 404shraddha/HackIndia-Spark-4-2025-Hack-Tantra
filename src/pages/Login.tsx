import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5100/user/login", {
        name,
        password,
      });

      console.log("Response:", res.data);
      localStorage.setItem("token", res.data.token);

      alert("✅ Login Successful!");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert(
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Server error. Please try again!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-black p-8 rounded-lg shadow-lg w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg bg-gray-800 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg bg-gray-800 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
