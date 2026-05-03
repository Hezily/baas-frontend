import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth setToken={setToken} />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;