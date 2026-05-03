import { useState } from "react";
import axios from "axios";

function ApiTester() {
  const API = "https://baas-backend-production.up.railway.app";

  const [apiKey, setApiKey] = useState("");
  const [collection, setCollection] = useState("users");
  const [method, setMethod] = useState("GET");
  const [json, setJson] = useState("{}");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    try {
      let res;

      if (method === "GET") {
        res = await axios.get(`${API}/api/data/${collection}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }

      if (method === "POST") {
        res = await axios.post(
          `${API}/api/data/${collection}`,
          { json: JSON.parse(json) },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
      }

      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="container">
      <h1>API Tester 🧪</h1>

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <input
        placeholder="Collection (users)"
        value={collection}
        onChange={(e) => setCollection(e.target.value)}
      />

      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
      </select>

      {method === "POST" && (
        <textarea
          rows="4"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
      )}

      <button onClick={sendRequest}>Send Request</button>

      <h3>Response</h3>
      <pre>{response}</pre>
    </div>
  );
}

export default ApiTester;