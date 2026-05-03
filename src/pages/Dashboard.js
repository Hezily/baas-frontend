import { useState } from "react";
import axios from "axios";

function Dashboard({ token, setToken }) {
  const API = "https://baas-backend-production.up.railway.app";

  const [view, setView] = useState("data");

  const [message, setMessage] = useState("");

  // DATA
  const [collection, setCollection] = useState("users");
  const [data, setData] = useState([]);
  const [jsonInput, setJsonInput] = useState("{}");
  const [apiKey, setApiKey] = useState("");

  // SEARCH
  const [field, setField] = useState("");
  const [value, setValue] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const limit = 5;

  // EDIT
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    showMessage("Logged out 👋");
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

  const columns =
    data.length > 0 ? Object.keys(data[0].json_data) : [];

  return (
    <div className="layout">

      {message && <div className="toast">{message}</div>}

      <div className="sidebar">
        <h2>BaaS ⚡</h2>
        <button onClick={() => setView("data")}>Data</button>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="main">

        <div className="card">
          <h2>Data Explorer 🚀</h2>

          <input
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <input
            placeholder="Collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
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

          <button onClick={loadData}>Load / Search</button>

          <textarea
            rows="4"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />

          <button onClick={createData}>Add</button>

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
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
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