
// frontend/src/admin/ChooseSecretary.jsx
import React, { useEffect, useState } from "react";

export default function ChooseSecretary() {
  const [owners, setOwners] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  const [currentSecretaryName, setCurrentSecretaryName] = useState("No secretary assigned");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API_BASE = "http://localhost:5000/api";

  const tableHeaderStyle = {
    background: "#1a237e",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  };

  const thStyle = {
    padding: 12,
    textAlign: "left",
    borderRight: "1px solid #e3e3e3",
  };

  const tdStyle = {
    padding: 12,
    borderRight: "1px solid #e3e3e3",
    color: "#333",
  };

  const actionBtnStyle = {
    padding: "8px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: 6,
    background: "#d32f2f",
    color : "#fff",
    fontWeight: "bold",
  };

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/secretory/owners`);
      const data = await res.json();
      if (data.success) {
        setOwners(data.owners || []);
      } else {
        setMsg("Failed to load owners");
      }
    } catch (err) {
      console.error("fetchOwners error:", err);
      setMsg("Server error while loading owners");
    } finally {
      setLoading(false);
    }
  };

  const fetchSecretaries = async () => {
    try {
      const res = await fetch(`${API_BASE}/secretory/list`);
      const data = await res.json();
      if (data.success) {
        setSecretaries(data.secretaries || []);
        if (data.secretaries && data.secretaries.length > 0) {
          const first = data.secretaries[0];
          setCurrentSecretaryName(first.UserID?.UserName || "No secretary assigned");
        } else {
          setCurrentSecretaryName("No secretary assigned");
        }
      }
    } catch (err) {
      console.error("fetchSecretaries error:", err);
    }
  };

  useEffect(() => {
    fetchOwners();
    fetchSecretaries();
    // eslint-disable-next-line
  }, []);

  const makeSecretary = async (id, name) => {
    if (!window.confirm(`Are you sure you want to make ${name} the Secretary?`)) return;
    try {
      setLoading(true);
      setMsg("");
      const res = await fetch(`${API_BASE}/secretory/assign/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message || "Secretary assigned");
        // Refresh both lists
        await fetchSecretaries();
        await fetchOwners(); // This will remove the assigned owner from the list
      } else {
        setMsg(data.message || "Failed to assign secretary");
      }
    } catch (err) {
      console.error("makeSecretary error:", err);
      setMsg("Server error while assigning");
    } finally {
      setLoading(false);
    }
  };

  const removeSecretary = async (secId) => {
    if (!window.confirm("Remove this secretary?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/secretory/remove/${secId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        // Refresh both lists
        await fetchSecretaries();
        await fetchOwners(); // This will show the owner back in the list
      } else {
        setMsg(data.message || "Failed to remove secretary");
      }
    } catch (err) {
      console.error("removeSecretary error:", err);
      setMsg("Server error while removing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{color:"#1a237e" }}>Choose Secretary</h2>

      <h3>
        Current Secretary:{" "}
        <span style={{ 
          color: "#9c27b0", 
          fontWeight: "bold" 
        }}>
          {currentSecretaryName}
        </span>
      </h3>


      {msg && <div style={{ margin: "10px 0", color: "green" }}>{msg}</div>}
      {loading && <div>Loading...</div>}

      <section style={{ marginBottom: 34 }}>
        <h4 style={{color:"#1a237e" }} >Assigned Secretary (Latest)</h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 20,
            borderRadius: 8,
            boxShadow: "0 2px 8px #e2e2e2",
          }}
        >
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {secretaries.length === 0 && (
              <tr>
                <td colSpan={4} style={tdStyle}>
                  No secretary assigned
                </td>
              </tr>
            )}
            {secretaries.map((s) => (
              <tr key={s._id} style={{ borderTop: "1px solid #eee", background: "#fff" }}>
                <td style={tdStyle}>{s.UserID?.UserName}</td>
                <td style={tdStyle}>{s.UserID?.UserEmailID}</td>
                <td style={tdStyle}>{s.UserID?.UserCNo}</td>
                <td style={tdStyle}>
                  <button onClick={() => removeSecretary(s._id)} style={actionBtnStyle}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h4>Owners</h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 10,
            borderRadius: 8,
            boxShadow: "0 2px 8px #e2e2e2",
          }}
        >
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {owners.length === 0 && (
              <tr>
                <td colSpan={4} style={tdStyle}>
                  No owners available (all may be assigned as secretary)
                </td>
              </tr>
            )}
            {owners.map((o) => (
              <tr key={o._id} style={{ borderTop: "1px solid #eee", background: "#fff" }}>
                <td style={tdStyle}>{o.UserName}</td>
                <td style={tdStyle}>{o.UserEmailID}</td>
                <td style={tdStyle}>{o.UserCNo}</td>
                <td style={tdStyle}>
                  {/* <button onClick={() => makeSecretary(o._id, o.UserName)} style={actionBtnStyle}>
                    Make Secretary
                  </button> */}

                  <button
                    onClick={() => makeSecretary(o._id, o.UserName)}
                    style={{
                      ...actionBtnStyle,
                      background: secretaries.length > 0 ? "#ccc" : "#d32f2f",
                      cursor: secretaries.length > 0 ? "not-allowed" : "pointer",
                    }}
                    disabled={secretaries.length > 0} // ✅ Disable when a secretary already exists
                  >
                    Make Secretary
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
