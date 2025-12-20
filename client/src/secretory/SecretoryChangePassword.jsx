import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function SecretaryChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const adminEmail = localStorage.getItem("email");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      setMessage("❌ New passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      //   const res = await axios.put(`${API_BASE_URL}/api/admin/change-password/${adminEmail}`, {
      //     oldPassword: form.oldPassword,
      //     newPassword: form.newPassword,
      //   });

      const res = await axios.put(`${API_BASE_URL}/api/change-password/${adminEmail}`, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });


      setMessage(res.data.message);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("❌ Error changing password:", err);
      if (err.response && err.response.data.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Failed to change password!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <style>{`
        .change-password-container {
        margin-top: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          // min-height: calc(100vh - 90px);
          background-color: #f8fafc;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 15px;
          width: 400px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          animation: fadeIn 0.5s ease-in-out;
        }
        .card h2 {
          text-align: center;
          font-size: 1.6rem;
          color: #1e3a8a;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        label {
          display: block;
          margin-bottom: 0.3rem;
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
        }
        input {
          width: 95%;
          padding: 8px 10px;
          margin-bottom: 1rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 0.9rem;
        }
        input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
        }
        button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        button:hover {
          background-color: #1d4ed8;
        }
        .message {
          text-align: center;
          font-weight: 500;
          margin-top: 1rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="card">
        <h2>🔐 Change Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <div
            className="message"
            style={{ color: message.includes("✅") ? "green" : "red" }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
