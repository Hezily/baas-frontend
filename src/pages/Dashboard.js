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

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    showMessage("Logged out 👋");
  };

  const createProject = async () => {
    try {
      await axios.post(
        `${API}/api/project/create`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Project created ✅");
      setName("");
    } catch (err) {
      showMessage(err.response?.data?.error || "Error creating project");
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/project`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      showMessage(err.response?.data?.error || "Error loading projects");
    }
  };

  const createApiKey = async () => {
    try {
      await axios.post(
        `${API}/api/user/create-api-key`,
        { project_id: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("API key created ✅");
      setProjectId("");
    } catch (err) {
      showMessage(err.response?.data?.error || "Error creating API key");
    }
  };

  const getApiKeys = async () => {
    try {
      const res = await axios.get(`${API}/api/user/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApiKeys(res.data);
    } catch (err) {
      showMessage(err.response?.data?.error || "Error loading API keys");
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    showMessage("API key copied ✅");
  };

  const deleteKey = async (id) => {
    try {
      await axios.delete(`${API}/api/user/api-key/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("API key deleted ✅");
      getApiKeys();
    } catch (err) {
      showMessage(err.response?.data?.error || "Error deleting key");
    }
  };

  return (
    <div className="layout">

      {/* 🔔 TOAST */}
      {message && <div className="toast">{message}</div>}

      {/* 🧭 SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">BaaS ⚡</h2>

        <button onClick={() => setView("projects")}>
          Projects
        </button>

        <button onClick={() => setView("keys")}>
          API Keys
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* 📄 MAIN CONTENT */}
      <div className="main">

        {view === "projects" && (
          <>
            <div className="card">
              <h2>Create Project</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
              />
              <button onClick={createProject}>
                Create
              </button>
            </div>

            <div className="card">
              <h2>Projects</h2>
              <button onClick={getProjects}>
                Load Projects
              </button>

              <ul>
                {projects.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span>ID: {p.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {view === "keys" && (
          <div className="card">
            <h2>API Keys</h2>

            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project ID"
            />

            <button onClick={createApiKey}>Create</button>
            <button onClick={getApiKeys}>Load</button>

            <ul>
              {apiKeys.map((k) => (
                <li key={k.id}>
                  <span>
                    {k.project_name} → ****{k.api_key.slice(-6)}
                  </span>

                  <div>
                    <button onClick={() => copyKey(k.api_key)}>
                      Copy
                    </button>

                    <button
                      onClick={() => deleteKey(k.id)}
                      style={{
                        marginLeft: 8,
                        background: "linear-gradient(135deg, #ef4444, #dc2626)"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
