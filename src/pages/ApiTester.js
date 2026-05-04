import { useState, useEffect } from "react";
import axios from "axios";

function ApiTester() {
  const BASE = "https://baas-backend-production.up.railway.app";

  const [apiKey, setApiKey] = useState("");
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/data/users");
  const [json, setJson] = useState("{}");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  // 🔥 Load history
  useEffect(() => {
    const saved = localStorage.getItem("api_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // 🔥 Save history
  const saveHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 10); // keep last 10
    setHistory(updated);
    localStorage.setItem("api_history", JSON.stringify(updated));
  };

  const sendRequest = async () => {
    try {
      const url = BASE + endpoint;
      let res;

      if (method === "GET") {
        res = await axios.get(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }

      if (method === "POST") {
        res = await axios.post(
          url,
          { json: JSON.parse(json) },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
      }

      if (method === "PUT") {
        res = await axios.put(
          url,
          { json: JSON.parse(json) },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
      }

      if (method === "DELETE") {
        res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }

      setResponse(JSON.stringify(res.data, null, 2));

      // 🔥 Save request
      saveHistory({ method, endpoint, json });

    } catch (err) {
      setResponse(
        JSON.stringify(
          err.response?.data || { error: "Request failed" },
          null,
          2
        )
      );
    }
  };

  // 🔁 Replay request
  const replay = (item) => {
    setMethod(item.method);
    setEndpoint(item.endpoint);
    setJson(item.json || "{}");
  };

  return (
    <div className="container">
      <h1>API Tester 🧪</h1>

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          style={{ flex: 1 }}
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </div>

      {(method === "POST" || method === "PUT") && (
        <textarea
          rows="4"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
      )}

      <button onClick={sendRequest}>Send Request</button>

      <h3>Response</h3>
      <pre>{response}</pre>

      {/* 🔥 HISTORY */}
      <h3>History</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i}>
            <b>{item.method}</b> {item.endpoint}
            <button onClick={() => replay(item)} style={{ marginLeft: 10 }}>
              Replay
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiTester;