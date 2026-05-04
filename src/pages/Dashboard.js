import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard({ token, setToken }) {
  const API = "https://baas-backend-production.up.railway.app";
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [collection, setCollection] = useState("users");
  const [data, setData] = useState([]);
  const [jsonInput, setJsonInput] = useState("{}");

  const [apiKey, setApiKey] = useState(""); // auto-filled now

  const [field, setField] = useState("");
  const [value, setValue] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🚀 AUTO LOAD API KEY (IMPORTANT)
  useEffect(() => {
    if (token) {
      loadApiKey();
    }
  }, [token]);

  const loadApiKey = async () => {
    try {
      const res = await axios.get(`${API}/api/user/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length > 0) {
        setApiKey(res.data[0].api_key); // first key auto-set
      }
    } catch {
      showMessage("Error loading API key");
    }
  };

  // ================= DATA =================

  const loadData = async () => {
    try {
      let url = `${API}/api/data/${collection}?limit=${limit}&page=${page}`;

      if (field && value) {
        url += `&field=${field}&value=${value}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      setData(res.data);
    } catch {
      showMessage("Error loading data");
    }
  };

  // 🔥 Auto reload when page OR apiKey changes
  useEffect(() => {
    if (apiKey) {
      loadData();
    }
  }, [page, apiKey]);

  const createData = async () => {
    try {
      await axios.post(
        `${API}/api/data/${collection}`,
        { json: JSON.parse(jsonInput) },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      showMessage("Data added ✅");
      loadData();
    } catch {
      showMessage("Invalid JSON");
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${API}/api/data/${collection}/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      showMessage("Deleted ✅");
      loadData();
    } catch {
      showMessage("Delete failed");
    }
  };

  const updateData = async (id) => {
    try {
      await axios.put(
        `${API}/api/data/${collection}/${id}`,
        { json: editRow },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      showMessage("Updated ✅");
      setEditId(null);
      loadData();
    } catch {
      showMessage("Update failed");
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const columns =
    data.length > 0 ? Object.keys(data[0].json_data) : [];

  return (
    <div className="layout">

      {message && <div className="toast">{message}</div>}

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>BaaS ⚡</h2>

        <button onClick={() => navigate("/docs")}>
          API Docs
        </button>

        <button onClick={() => navigate("/tester")}>
          API Tester
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* 📊 STATS */}
        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <div className="card">Collection: {collection}</div>
          <div className="card">Records: {data.length}</div>
          <div className="card">Page: {page}</div>
        </div>

        <div className="card">
          <h2>Data Explorer 🚀</h2>

          <input
            placeholder="API Key (auto-filled)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <input
            placeholder="Collection"
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
              setPage(1);
            }}
          />

          {/* SEARCH */}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder="Field"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
            <input
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <button onClick={handleSearch}>Load / Search</button>

          <textarea
            rows="4"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />

          <button onClick={createData}>Add</button>

          {/* TABLE */}
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  {columns.map((col) => (
                    <td key={col}>
                      {editId === item.id ? (
                        <input
                          value={editRow[col] || ""}
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              [col]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.json_data[col]
                      )}
                    </td>
                  ))}

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
                            setEditRow(item.json_data);
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

          {/* PAGINATION */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => page > 1 && setPage(page - 1)}
            >
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {page}
            </span>

            <button onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;