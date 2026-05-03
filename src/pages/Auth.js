import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth({ setToken }) {
  const API = "https://baas-backend-production.up.railway.app";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🧠 Toast helper
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // 🆕 SIGNUP
  const signup = async () => {
    try {
      await axios.post(`${API}/api/auth/signup`, { email, password });
      showMessage("Signup successful ✅ Now login");
    } catch (err) {
      showMessage(err.response?.data?.error || "Signup failed");
    }
  };

  // 🔐 LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);

      showMessage("Login successful ✅");

      // small delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      showMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      {/* 🔔 TOAST MESSAGE */}
      {message && <div className="toast">{message}</div>}

      <div className="card">
        <h1>Build Faster </h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signup}>Signup</button>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Auth;