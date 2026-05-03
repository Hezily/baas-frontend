import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs"; // ✅ NEW

import "./App.css";

function App() {
  const [token, setToken] = useState("");

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public routes */}
        <Route path="/" element={<Auth setToken={setToken} />} />
        <Route path="/docs" element={<Docs />} /> {/* ✅ PUBLIC */}

        {/* 🔐 Protected route */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} setToken={setToken} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ❗ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;