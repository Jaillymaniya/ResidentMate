import React, { useState, useEffect } from "react";
import axios from "axios";
import {API_BASE_URL} from '../api';

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='40' cy='40' r='39' fill='white' stroke='%231877f2' stroke-width='2'/><circle cx='40' cy='30' r='14' fill='black'/><ellipse cx='40' cy='54' rx='22' ry='14' fill='black'/></svg>";

export default function TenantProfile() {
  const [tenant, setTenant] = useState({
    UserName: "",
    UserGender: "Male",
    UserCNo: "",
    UserEmailID: "",
    Photo: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
  let newErrors = {};

  // Name validation (letters, numbers, spaces)
  if (!tenant.UserName.trim()) {
    newErrors.UserName = "Name is required";
  } else if (!/^[A-Za-z ]+$/.test(tenant.UserName)) {
    newErrors.UserName =
      "Name can contain only letters, numbers, and spaces";
  }

  // Contact validation (10 digits)
  if (!tenant.UserCNo.trim()) {
    newErrors.UserCNo = "Contact number is required";
  } else if (!/^[0-9]{10}$/.test(tenant.UserCNo)) {
    newErrors.UserCNo = "Contact must be 10 digits";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const tenantEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/tenant/${tenantEmail}`
        );

        setTenant(res.data);

        if (res.data.Photo) {
          setPreview(`${API_BASE_URL}/uploads/${res.data.Photo}`);
        } else {
          setPreview("");
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    if (tenantEmail) fetchTenant();
  }, [tenantEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant({ ...tenant, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTenant({ ...tenant, Photo: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!validate()) return; // ⬅️ ADD THIS

    try {
      const formData = new FormData();
      Object.keys(tenant).forEach((key) => {
        formData.append(key, tenant[key]);
      });

      await axios.put(
        `${API_BASE_URL}/api/tenant/update/${tenantEmail}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Tenant profile updated successfully!");
      window.location.reload();
    } catch {
      setMessage("❌ Failed to update profile!");
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="admin-profile-container">
      <style>{`
        .admin-profile-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: calc(100vh - 70px);
          background-color: #f8fafc;
        }
        .admin-card {
          background: #fff;
          padding: 2rem;
          border-radius: 15px;
          width: 470px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          animation: fadeIn 0.5s ease-in-out;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .admin-card h2 {
          text-align: center;
          font-size: 1.6rem;
          color: #1e3a8a;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        .profile-photo {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
          width: 100%;
        }
        .profile-photo img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #1877f2;
          object-fit: cover;
          object-position: center;
          background: #eee;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        form {
          width: 100%;
        }
        form label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.2rem;
        }
        form input, form select {
          width: 97%;
          padding: 8px 10px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 0.9rem;
        }
        form select {
          width : 102%;
        }
        form input:focus, form select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
        }
        .update-btn {
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
        .update-btn:hover {
          background-color: #1d4ed8;
        }
        .message {
          text-align: center;
          font-weight: 500;
          margin-top: 1rem;
        }
        .loading {
          text-align: center;
          color: #4b5563;
          padding-top: 100px;
          font-size: 1.2rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="admin-card">
        <h2>🏠 Tenant Profile</h2>

        <div className="profile-photo">
          <img src={preview || DEFAULT_AVATAR} alt="Tenant" />
        </div>

        <form onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            type="text"
            name="UserName"
            value={tenant.UserName}
            onChange={handleChange}
          />
          {errors.UserName && (
  <p style={{ color: "red", fontSize: "0.8rem", marginTop: "-6px" }}>
    {errors.UserName}
  </p>
)}


          <label>Gender</label>
          <select
            name="UserGender"
            value={tenant.UserGender}
            onChange={handleChange}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>Contact No</label>
          <input
            type="text"
            name="UserCNo"
            value={tenant.UserCNo}
            onChange={handleChange}
          />
        {errors.UserCNo && (
  <p style={{ color: "red", fontSize: "0.8rem", marginTop: "-6px" }}>
    {errors.UserCNo}
  </p>
)}

          <label>Email ID</label>
          <input
            type="email"
            name="UserEmailID"
            value={tenant.UserEmailID}
            readOnly
            style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
          />

          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" className="update-btn">
            Update Profile
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
