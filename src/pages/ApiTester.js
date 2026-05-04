import { useState, useEffect } from "react";
import axios from "axios";

function ApiTester() {
  const BASE = "https://baas-backend-production.up.railway.app";

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Load tabs
  useEffect(() => {
    const saved = localStorage.getItem("api_tabs");
    if (saved) {
      setTabs(JSON.parse(saved));
    } else {
      createTab();
    }
  }, []);

  // 🔥 Save tabs
  useEffect(() => {
    localStorage.setItem("api_tabs", JSON.stringify(tabs));
  }, [tabs]);

  const createTab = () => {
    const newTab = {
      name: "New Request",
      method: "GET",
      endpoint: "/api/data/users",
      apiKey: "",
      json: "{}",
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTab(tabs.length);
  };

  const deleteTab = (index) => {
    const updated = tabs.filter((_, i) => i !== index);
    setTabs(updated);
    setActiveTab(0);
  };

  const updateTab = (key, value) => {
    const updated = [...tabs];
    updated[activeTab][key] = value;
    setTabs(updated);
  };

  // 🚀 SEND REQUEST
  const sendRequest = async () => {
    const tab = tabs[activeTab];
    const url = BASE + tab.endpoint;

    const start = Date.now();
    setLoading(true);

    try {
      let res;

      if (tab.method === "GET") {
        res = await axios.get(url, {
          headers: { Authorization: `Bearer ${tab.apiKey}` },
        });
      }

      if (tab.method === "POST") {
        res = await axios.post(
          url,
          { json: JSON.parse(tab.json) },
          { headers: { Authorization: `Bearer ${tab.apiKey}` } }
        );
      }

      if (tab.method === "PUT") {
        res = await axios.put(
          url,
          { json: JSON.parse(tab.json) },
          { headers: { Authorization: `Bearer ${tab.apiKey}` } }
        );
      }

      if (tab.method === "DELETE") {
        res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${tab.apiKey}` },
        });
      }

      const end = Date.now();

      setStatus(res.status);
      setTime(end - start + " ms");
      setResponse(JSON.stringify(res.data, null, 2));

    } catch (err) {
      const end = Date.now();

      setStatus(err.response?.status || "Error");
      setTime(end - start + " ms");

      setResponse(
        JSON.stringify(
          err.response?.data || { error: "Request failed" },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const current = tabs[activeTab];

  return (
    <div className="container">
      <h1>API Tester 🧪</h1>

      {/* 🔥 TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {tabs.map((tab, i) => (
          <div
            key={i}
            style={{
              padding: "6px 10px",
              background: i === activeTab ? "#334155" : "#1e293b",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => setActiveTab(i)}
          >
            {tab.name}
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteTab(i);
              }}
              style={{ marginLeft: 6, color: "red", cursor: "pointer" }}
            >
              ✕
            </span>
          </div>
        ))}

        <button onClick={createTab}>+</button>
      </div>

      {current && (
        <>
          <input
            placeholder="Tab Name"
            value={current.name}
            onChange={(e) => updateTab("name", e.target.value)}
          />

          <input
            placeholder="API Key"
            value={current.apiKey}
            onChange={(e) => updateTab("apiKey", e.target.value)}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={current.method}
              onChange={(e) => updateTab("method", e.target.value)}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>

            <input
              style={{ flex: 1 }}
              value={current.endpoint}
              onChange={(e) => updateTab("endpoint", e.target.value)}
            />
          </div>

          {(current.method === "POST" || current.method === "PUT") && (
            <textarea
              rows="5"
              value={current.json}
              onChange={(e) => updateTab("json", e.target.value)}
            />
          )}

          <button onClick={sendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </button>

          {/* 🔥 RESPONSE HEADER */}
          <div style={{ display: "flex", gap: 15, marginTop: 15 }}>
            <span style={{ color: "#22c55e" }}>Status: {status}</span>
            <span style={{ color: "#38bdf8" }}>Time: {time}</span>
            <button onClick={() => navigator.clipboard.writeText(response)}>
              Copy
            </button>
          </div>

          <h3>Response</h3>
          <pre>{response}</pre>
        </>
      )}
    </div>
  );
}

export default ApiTester;