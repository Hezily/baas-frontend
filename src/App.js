import Landing from "./pages/Landing";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";


import "./App.css";

function App() {
  const [token, setToken] = useState("");

  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth setToken={setToken} />} />
        <Route path="/docs" element={<Docs />} />

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