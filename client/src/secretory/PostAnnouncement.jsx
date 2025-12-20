import React, { useState, useEffect } from "react";
import { API_BASE } from "../api";

export default function PostAnnouncement() {
  const [form, setForm] = useState({ Description: "", ProgramDate: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ Description: "", ProgramDate: "" });
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("active"); // ✅ NEW toggle
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements`);
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ✅ Toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // ✅ Handle input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // ✅ Create new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/announcements/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Announcement added successfully!", "success");
        setForm({ Description: "", ProgramDate: "" });
        fetchAnnouncements();
      } else {
        showToast(data.error || "Something went wrong!", "error");
      }
    } catch (err) {
      showToast("Server error: " + err.message, "error");
    }
    setLoading(false);
  };

  // ✅ Edit announcement
  const startEdit = (ann) => {
    setEditId(ann._id);
    setEditForm({
      Description: ann.Description,
      ProgramDate: ann.ProgramDate?.split("T")[0] || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ Description: "", ProgramDate: "" });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/announcements/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Announcement updated successfully!", "success");
        fetchAnnouncements();
        cancelEdit();
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Soft delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/announcements/delete/${id}`,
        { method: "PUT" }
      );
      if (res.ok) {
        showToast("Announcement deleted successfully!", "info");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Restore
  const handleRestore = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/announcements/restore/${id}`,
        { method: "PUT" }
      );
      if (res.ok) {
        showToast("Announcement restored successfully!", "success");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filter announcements
  const filteredAnnouncements = announcements.filter((a) =>
    filter === "active" ? a.IsActive : !a.IsActive
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* ✅ Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            background:
              toast.type === "success"
                ? "#4caf50"
                : toast.type === "error"
                  ? "#e53935"
                  : "#1976d2",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* ✅ Post Form */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>📢 Post Announcement</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: "bold" }}>Description</label>
          <textarea
            name="Description"
            value={form.Description}
            onChange={handleChange}
            required
            placeholder="Enter announcement details..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />
          <label style={{ fontWeight: "bold" }}>Program Date</label>
          <input
            type="date"
            name="ProgramDate"
            value={form.ProgramDate}
            onChange={handleChange}
            min={today}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "#aaa"
                : "linear-gradient(90deg, #2575fc, #6a11cb)",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </form>
      </div>

      {/* ✅ Filter Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("active")}
          style={{
            background: filter === "active" ? "#2575fc" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Active Announcements
        </button>
        <button
          onClick={() => setFilter("inactive")}
          style={{
            background: filter === "inactive" ? "#6c63ff" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Inactive Announcements
        </button>
      </div>

      {/* ✅ Announcement List */}
      <div>
        {filteredAnnouncements.length === 0 ? (
          <p style={{ textAlign: "center" }}>No {filter} announcements found.</p>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann._id}
              style={{
                background: ann.IsActive ? "#f9f9ff" : "#f5f5f5",
                borderLeft: `6px solid ${ann.IsActive ? "#2575fc" : "#999"
                  }`,
                padding: "15px 20px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              {editId === ann._id ? (
                <>
                  <textarea
                    name="Description"
                    value={editForm.Description}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="date"
                    name="ProgramDate"
                    value={editForm.ProgramDate}
                    onChange={handleEditChange}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      marginBottom: "10px",
                    }}
                  />
                  <div>
                    <button
                      onClick={() => handleUpdate(ann._id)}
                      style={{
                        background: "#2575fc",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "8px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        background: "#aaa",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4>{ann.Description}</h4>
                  <p>
                    📅 {ann.ProgramDate
                      ? new Date(ann.ProgramDate).toLocaleDateString()
                      : "No date"}
                  </p>
                  <small>
                    🕒 Posted on {new Date(ann.DateCreated).toLocaleString()}
                  </small>
                  <div style={{ marginTop: "10px" }}>
                    {ann.IsActive ? (
                      <>
                        <button
                          onClick={() => startEdit(ann)}
                          style={{
                            background: "#2575fc",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            marginRight: "8px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ann._id)}
                          style={{
                            background: "#e53935",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(ann._id)}
                        style={{
                          background: "#43a047",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        ♻️ Restore
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
