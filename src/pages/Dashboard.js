import { useState } from "react";
import axios from "axios";

function Dashboard({ token, setToken }) {
  const API = "https://baas-backend-production.up.railway.app";

  const [view, setView] = useState("projects");

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const [apiKeys, setApiKeys] = useState([]);
  const [projectId, setProjectId] = useState("");

  const [message, setMessage] = useState("");

  // 🔥 DATA STATES
  const [collection, setCollection] = useState("users");
  const [data, setData] = useState([]);
  const [jsonInput, setJsonInput] = useState("{}");
  const [apiKey, setApiKey] = useState("");

  // ✨ EDIT STATES
  const [editId, setEditId] = useState(null);
  const [editJson, setEditJson] = useState("{}");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    showMessage("Logged out 👋");
  };

  // ================= PROJECT =================

  const createProject = async () => {
    try {
      await axios.post(
        `${API}/api/project/create`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Project created ✅");
      setName("");
    } catch {
      showMessage("Error creating project");
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/project`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch {
      showMessage("Error loading projects");
    }
  };

  // ================= API KEYS =================

  const createApiKey = async () => {
    try {
      await axios.post(
        `${API}/api/user/create-api-key`,
        { project_id: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("API key created ✅");
    } catch {
      showMessage("Error creating API key");
    }
  };

  const getApiKeys = async () => {
    try {
      const res = await axios.get(`${API}/api/user/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApiKeys(res.data);
    } catch {
      showMessage("Error loading API keys");
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    showMessage("Copied ✅");
  };

  const deleteKey = async (id) => {
    try {
      await axios.delete(`${API}/api/user/api-key/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Deleted ✅");
      getApiKeys();
    } catch {
      showMessage("Delete failed");
    }
  };

  // ================= DATA API =================

  const loadData = async () => {
    try {
      const res = await axios.get(`${API}/api/data/${collection}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      setData(res.data);
    } catch {
      showMessage("Error loading data");
    }
  };

  const createData = async () => {
    try {
      await axios.post(
        `${API}/api/data/${collection}`,
        { json: JSON.parse(jsonInput) },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      showMessage("Data added ✅");
      loadData();
    } catch {
      showMessage("Invalid JSON or API key");
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(
        `${API}/api/data/${collection}/${id}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      showMessage("Deleted ✅");
      loadData();
    } catch {
      showMessage("Delete failed");
    }
  };

  // ✏️ UPDATE
  const updateData = async (id) => {
    try {
      await axios.put(
        `${API}/api/data/${collection}/${id}`,
        { json: JSON.parse(editJson) },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      showMessage("Updated ✅");
      setEditId(null);
      loadData();
    } catch {
      showMessage("Invalid JSON");
    }
  };

  // ================= UI =================

  return (
    <div className="layout">

      {message && <div className="toast">{message}</div>}

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>BaaS ⚡</h2>

        <button onClick={() => setView("projects")}>Projects</button>
        <button onClick={() => setView("keys")}>API Keys</button>
        <button onClick={() => setView("data")}>Data</button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* PROJECTS */}
        {view === "projects" && (
          <>
            <div className="card">
              <h2>Create Project</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
              />
              <button onClick={createProject}>Create</button>
            </div>

            <div className="card">
              <h2>Projects</h2>
              <button onClick={getProjects}>Load</button>

              <ul>
                {projects.map((p) => (
                  <li key={p.id}>
                    {p.name} (ID: {p.id})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* API KEYS */}
        {view === "keys" && (
          <div className="card">
            <h2>API Keys</h2>

            <input
              placeholder="Project ID"
              onChange={(e) => setProjectId(e.target.value)}
            />

            <button onClick={createApiKey}>Create</button>
            <button onClick={getApiKeys}>Load</button>

            <ul>
              {apiKeys.map((k) => (
                <li key={k.id}>
                  {k.project_name} → ****{k.api_key.slice(-6)}

                  <button onClick={() => copyKey(k.api_key)}>Copy</button>
                  <button onClick={() => deleteKey(k.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DATA EXPLORER */}
        {view === "data" && (
          <div className="card">
            <h2>Data Explorer 🚀</h2>

            <input
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />

            <input
              placeholder="Collection (users, posts...)"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            />

            <button onClick={loadData}>Load Data</button>

            <textarea
              rows="4"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />

            <button onClick={createData}>Add Data</button>

            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      {editId === item.id ? (
                        <textarea
                          rows="3"
                          value={editJson}
                          onChange={(e) => setEditJson(e.target.value)}
                        />
                      ) : (
                        <pre>{JSON.stringify(item.json_data, null, 2)}</pre>
                      )}
                    </td>

                    <td>
                      {editId === item.id ? (
                        <>
                          <button onClick={() => updateData(item.id)}>Save</button>
                          <button onClick={() => setEditId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(item.id);
                              setEditJson(JSON.stringify(item.json_data, null, 2));
                            }}
                          >
                            Edit
                          </button>

                          <button onClick={() => deleteData(item.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;