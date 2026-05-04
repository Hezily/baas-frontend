import { useState } from "react";
import axios from "axios";

function ApiTester() {
  const BASE = "https://baas-backend-production.up.railway.app";

  const [apiKey, setApiKey] = useState("");
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/data/users");
  const [json, setJson] = useState("{}");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);

      const url = BASE + endpoint;
      let res;

      // 🔹 GET
      if (method === "GET") {
        res = await axios.get(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }

      // 🔹 POST
      if (method === "POST") {
        res = await axios.post(
          url,
          { json: JSON.parse(json) },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
      }

      // 🔹 PUT
      if (method === "PUT") {
        res = await axios.put(
          url,
          { json: JSON.parse(json) },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
      }

      // 🔹 DELETE
      if (method === "DELETE") {
        res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }

      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(
        JSON.stringify(
          err.response?.data || { error: "Invalid request / JSON" },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
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

      {/* METHOD + ENDPOINT */}
      <div style={{ display: "flex", gap: 10 }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          style={{ flex: 1 }}
          placeholder="/api/data/users"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </div>

      {/* BODY */}
      {(method === "POST" || method === "PUT") && (
        <textarea
          rows="5"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
      )}

      <button onClick={sendRequest} disabled={loading}>
        {loading ? "Sending..." : "Send Request"}
      </button>

      {/* RESPONSE */}
      <h3>Response</h3>
      <pre>{response}</pre>
    </div>
  );
}

export default ApiTester;