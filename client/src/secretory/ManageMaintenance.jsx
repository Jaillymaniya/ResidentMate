import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

export default function ManageMaintenance() {
  const [maintenanceFrom, setMaintenanceFrom] = useState("");
  const [maintenanceTo, setMaintenanceTo] = useState("");
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const [error, setError] = useState(""); // Add error state

  // Format date as DD/MM/YYYY
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  // Today's date ISO for min attribute
  const todayISO = new Date().toISOString().split("T")[0];

  // Load maintenance records
  // useEffect(() => {
  //   axios.get(`${API_BASE}/api/maintenance`).then((res) => setData(res.data));
  // }, []);

  useEffect(() => {
    const url = showDeleted
      ? `${API_BASE}/api/maintenance/deleted`
      : `${API_BASE}/api/maintenance`;

    axios.get(url)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [showDeleted]);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   if (!dueDate || new Date(dueDate) <= new Date(todayISO)) {
  //     setError("❌ Please select a future Due Date!");
  //     return;
  //   }
  //   if (editId) {
  //     // await axios.put(`${API_BASE}/api/maintenance/${editId}`, { Amount: amount, DueDate: dueDate });
  //     await axios.put(`${API_BASE}/api/maintenance/${editId}`, { 
  //       Amount: Number(amount),
  //       FromDate: maintenanceFrom,
  //       ToDate: maintenanceTo,
  //       DueDate: dueDate
  //     });

  //   } else {
  //     // await axios.post(`${API_BASE}/api/maintenance`, { Amount: amount, DueDate: dueDate });
  //     await axios.post(`${API_BASE}/api/maintenance`, { 
  //       Amount: Number(amount),
  //       FromDate: maintenanceFrom,
  //       ToDate: maintenanceTo,
  //       DueDate: dueDate 
  //     });

  //   }
  //   window.location.reload();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!dueDate || new Date(dueDate) <= new Date(todayISO)) {
      setError("❌ Please select a future Due Date!");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_BASE}/api/maintenance/${editId}`, {
          Amount: Number(amount),
          FromDate: maintenanceFrom,
          ToDate: maintenanceTo,
          DueDate: dueDate
        });
      } else {
        await axios.post(`${API_BASE}/api/maintenance`, {
          Amount: Number(amount),
          FromDate: maintenanceFrom,
          ToDate: maintenanceTo,
          DueDate: dueDate
        });
      }

      window.location.reload();

    } catch (err) {
      // SHOW backend message here
      if (err.response?.data?.message) {
        setError("❌ " + err.response.data.message);
      } else if (err.response?.data?.error) {
        setError("❌ " + err.response.data.error);
      } else {
        setError("❌ Something went wrong!");
      }
    }
  };


  // const handleDelete = async (id) => {
  //   if (window.confirm("Delete this record?")) {
  //     await axios.delete(`${API_BASE}/api/maintenance/${id}`);
  //     window.location.reload();
  //   }
  // };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await axios.delete(`${API_BASE}/api/maintenance/${id}`);
      window.location.reload();

    } catch (err) {

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.response?.data?.details ||
        err.message;

      setError("❌ " + backendMessage);
    }
  };


  const startEdit = (rec) => {
    setEditId(rec._id);
    setAmount(rec.Amount);
    setMaintenanceFrom(rec.FromDate.slice(0, 10));
    setMaintenanceTo(rec.ToDate.slice(0, 10));
    setDueDate(rec.DueDate.slice(0, 10));
    setError("");
  };

  return (
    <div className="maintenance-container">
      <style>{`
        .maintenance-container {
          max-width: 2000px;
          margin: 48px auto;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 9px 32px rgba(28, 61, 126, 0.09);
          padding: 38px 40px 30px 40px;
          font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        }
        .maintenance-container h2 {
          text-align: left;
          font-size: 2.3rem;
          margin-bottom: 32px;
          color: #193A63;
          font-weight: 700;
          letter-spacing: 1.2px;
        }
        .maintenance-form {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: 18px 28px;
          margin-bottom: 35px;
        }
        .maintenance-form label {
          font-weight: 500;
          margin-right: 7px;
          color: #425178;
          font-size: 1.1rem;
        }
        .maintenance-form input[type='number'],
        .maintenance-form input[type='date'] {
          padding: 8px 14px;
          border: 1.3px solid #c6d0e3;
          border-radius: 8px;
          font-size: 1.08rem;
          width: 135px;
          margin-right: 7px;
          transition: border .18s;
        }
        .maintenance-form input[type='number']:focus,
        .maintenance-form input[type='date']:focus {
          border: 2px solid #1d62ea;
        }
        .form-buttons {
          display: flex;
          gap: 14px;
        }
        .form-btn {
          background: #2563eb;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 9px;
          font-size: 1.1rem;
          padding: 9px 28px;
          cursor: pointer;
          transition: background .18s;
          margin-top: 0;
        }
        .form-btn.cancel {
          background: #2563eb;
          color: #fff;
          border: 2px solid #2563eb;
          margin-left: 0;
        }
        .form-btn:hover,
        .form-btn.cancel:hover {
          background: #1d48aa;
          color: #fff;
        }

        .maintenance-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          box-shadow: 0 2px 10px rgba(35, 53, 100, .11);
          background: #f6f8fc;
          border-radius: 16px;
          overflow: hidden;
          margin-top: 16px;
        }
        .maintenance-table th, .maintenance-table td {
          padding: 16px 20px;
          text-align: left;
        }
        .maintenance-table thead th {
          background: #e6edfa;
          font-size: 1.09rem;
          color: #29487a;
          font-weight: 700;
          border-bottom: 2px solid #dde3ee;
        }
        .maintenance-table tr:not(:last-child) td {
          border-bottom: 1px solid #e4e7ec;
        }
        .maintenance-table td {
          font-size: 1.04rem;
          background: #fff;
        }

        .maintenance-table .row-actions {
          display: flex;
          gap: 7px;
        }

        .action-btn {
          font-size: 1rem;
          font-weight: 600;
          border-radius: 6px;
          padding: 6px 20px;
          border: 2px solid #2563eb;
          color: #2563eb;
          background: #edf3fe;
          cursor: pointer;
          transition: all .16s;
        }
        .action-btn.edit {
          border: 2px solid #2563eb;
        }
        .action-btn.edit:hover {
          background: #2563eb;
          color: #fff;
        }
        .action-btn.delete {
          border: 2px solid #e03c47;
          color: #e03c47;
          background: #fff2f3;
        }
        .action-btn.delete:hover {
          background: #e03c47;
          color: #fff;
        }
        @media (max-width: 680px) {
          .maintenance-container {
            max-width: 99vw;
            padding: 18px 4px;
          }
          .maintenance-form {
            flex-direction: column;
            align-items: stretch;
          }
          .form-btn, .form-btn.cancel {
            width: 100%;
            margin-bottom: 11px;
          }
          .maintenance-table th, .maintenance-table td {
            padding: 10px 8px;
            font-size: 0.94rem;
          }
        }
      `}</style>
      <h2>Manage Maintenance</h2>
      <form className="maintenance-form" onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <label>From</label>
        <input
          type="date"
          value={maintenanceFrom}
          onChange={(e) => setMaintenanceFrom(e.target.value)}
          required
        />

        <label>To</label>
        <input
          type="date"
          value={maintenanceTo}
          onChange={(e) => setMaintenanceTo(e.target.value)}
          required
        />

        <label>Due Date</label>
        <input
          type="date"
          min={todayISO}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <div className="form-buttons">
          <button type="submit" className="form-btn">{editId ? "Update" : "Add"}</button>
          {editId && (
            <button
              type="button"
              className="form-btn cancel"
              onClick={() => {
                setEditId(null);
                setAmount("");
                setDueDate("");
                setError("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {error && <div style={{ color: "#e41e3f", fontWeight: "500", margin: "-20px 0 20px 2px" }}>{error}</div>}
      <div style={{ marginBottom: "12px" }}>
        <label>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          /> Show Deleted Records
        </label>
      </div>

      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
            <th>Due Date</th>
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.Amount}</td>
              <td>{formatDate(rec.FromDate)}</td>
              <td>{formatDate(rec.ToDate)}</td>
              <td>{formatDate(rec.DueDate)}</td>
              <td>{formatDate(rec.DateCreated)}</td>
              {/* <td>
                <div className="row-actions">
                  <button className="action-btn edit" onClick={() => startEdit(rec)}>Edit</button>
                  <button className="action-btn delete" onClick={() => handleDelete(rec._id)}>Delete</button>
                </div>
              </td> */}
              <td>
                <div className="row-actions">
                  {!showDeleted && (
                    <>
                      <button className="action-btn edit" onClick={() => startEdit(rec)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(rec._id)}>Delete</button>
                    </>
                  )}
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
