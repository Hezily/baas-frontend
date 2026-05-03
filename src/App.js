import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import ApiTester from "./pages/ApiTester"; // ✅ NEW

import "./App.css";

function App() {
  const [token, setToken] = useState("");

  // 🔥 Persist login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth setToken={setToken} />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/tester" element={<ApiTester />} /> {/* ✅ NEW */}

        {/* 🔐 PROTECTED ROUTE */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} setToken={setToken} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {/* ❗ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;