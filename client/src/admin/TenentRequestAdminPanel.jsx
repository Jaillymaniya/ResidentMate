import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const TenantRequestsAdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [editData, setEditData] = useState(null);
  const [registerForm, setRegisterForm] = useState({
    show: false,
    appointmentId: null,
    gender: "",
    password: ""
  });

  // ====================== REGISTER FORM HANDLER ======================
  const openRegisterForm = (appointmentId) => {
    setRegisterForm({
      show: true,
      appointmentId,
      gender: "",
      password: ""
    });
  };

  const closeRegisterForm = () => {
    setRegisterForm({
      show: false,
      appointmentId: null,
      gender: "",
      password: ""
    });
  };

  const handleRegisterFormChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  // ====================== REGISTER TENANT ======================
  const registerTenant = async (e) => {
    e.preventDefault();

    const { appointmentId, gender, password } = registerForm;

    if (!gender || !password) {
      alert("Gender and Password are required!");
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert("Password must contain at least 6 characters!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/appointments/registerTenant`, {
        appointmentId: appointmentId,
        gender,
        password
      });

      alert("Tenant registered successfully!");
      closeRegisterForm();
      loadRegisteredTenants();
      loadAcceptedRequests();

    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const activateTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to activate this tenant?")) return;

    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/activateTenant/${tenantId}`);
      setTenants(prev =>
        prev.map(t => t._id === tenantId ? { ...t, Status: "Active" } : t)
      );
      alert("Tenant activated successfully!");

      loadRegisteredTenants();
      loadAcceptedRequests();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const saveEdit = async () => {
    if (!editData.homeNumber) {
      alert("Please select a home number");
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/updateTenant/${editData._id}`, {
        UserName: editData.UserName,
        UserEmailID: editData.UserEmailID,
        UserCNo: editData.UserCNo,
        HomeNumber: editData.homeNumber,
        assignId: editData.assignId || null  // if null, server will create assignment
      });

      alert(editData.assignId ? "Tenant updated successfully!" : "Tenant assigned successfully!");
      loadRegisteredTenants();
      setEditData(null);

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // ====================== DEACTIVATE ======================
  const deactivateTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to deactivate this tenant?")) return;

    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/deactivateTenant/${tenantId}`);

      alert("Tenant deactivated successfully!");
      loadRegisteredTenants();
      loadAcceptedRequests();

    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // ====================== LOAD ACCEPTED REQUESTS ======================
  const loadAcceptedRequests = () => {
    axios.get(`${API_BASE_URL}/api/appointments/accepted`)
      .then((res) => setRequests(res.data))
      .catch((err) => alert("Error fetching accepted requests: " + err.message));
  };

  // ====================== LOAD REGISTERED TENANTS ======================
  const loadRegisteredTenants = () => {
    axios.get(`${API_BASE_URL}/api/appointments/registeredTenants`)
      .then((res) => {
        console.log("Registered Tenants Response:", res.data);
        setTenants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Error fetching registered tenants: " + err.message);
      });
  };

  useEffect(() => {
    loadAcceptedRequests();
    loadRegisteredTenants();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>

      {/* ===================== ACCEPTED REQUESTS TABLE ===================== */}
      <h2>Accepted Rental Appointment Requests</h2>

      {requests.length === 0 ? (
        <div>No accepted requests found.</div>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Home Number</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Checkout Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.TenantName}</td>
                <td>{req.TenantEmail}</td>
                <td>{req.TenantContact}</td>
                {/* <td>{req.AssignID}</td> */}
                <td>{req.AssignID?.HomeID?.HomeNumber || "N/A"}</td>
                <td>{req.Status}</td>
                <td>{new Date(req.RequestDate).toLocaleString()}</td>
                <td>{req.CheckoutDate ? new Date(req.CheckoutDate).toLocaleString() : "-"}</td>

                <td>
                  <button
                    disabled={tenants.some(t => t?._id === req.AssignID)}
                    onClick={() => openRegisterForm(req._id)}
                    style={{
                      padding: "6px 12px",
                      background: tenants.some(t => t?._id === req.AssignID) ? "gray" : "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: tenants.some(t => t?._id === req.AssignID) ? "not-allowed" : "pointer"
                    }}
                  >
                    {tenants.some(t => t?._id === req.AssignID)
                      ? "Registered"
                      : "Register Tenant"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ===================== REGISTERED TENANTS ===================== */}
      <h2>Registered Tenants</h2>

      {tenants.length === 0 ? (
        <div>No tenants registered yet.</div>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Home Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tenants.map(t => (
              <tr key={t._id}>
                <td>{t?.UserName}</td>
                <td>{t?.UserEmailID}</td>
                <td>{t?.UserCNo}</td>
                <td>{t?.HomeNumber}</td>
                <td>{t?.Status}</td>
                <td style={{ display: "flex", gap: "10px" }}>
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() =>
                      setEditData({
                        _id: t._id,
                        assignId: t?.AssignID || null,
                        UserName: t?.UserName,
                        UserEmailID: t?.UserEmailID,
                        UserCNo: t?.UserCNo,
                        homeNumber: t?.HomeNumber || ""
                      })
                    }
                    style={{ padding: "6px 12px", background: "orange", color: "white", border: "none", borderRadius: "5px" }}
                  >
                    Edit
                  </button>

                  {/* ACTIVATE / DEACTIVATE BUTTON */}
                  {t.Status === "Active" ? (
                    <button
                      onClick={() => deactivateTenant(t.AssignID)}
                      style={{ padding: "6px 12px", background: "red", color: "white", border: "none", borderRadius: "5px" }}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => activateTenant(t._id)}
                      style={{ padding: "6px 12px", background: "green", color: "white", border: "none", borderRadius: "5px" }}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      )}

      {/* ===================== REGISTER TENANT FORM POPUP ===================== */}
      {registerForm.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999
          }}
        >
          <div style={{
            background: "white",
            padding: "20px",
            width: "400px",
            borderRadius: "8px"
          }}>
            <h3>Register Tenant</h3>

            <form onSubmit={registerTenant}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Gender:</label>
                <select
                  name="gender"
                  value={registerForm.gender}
                  onChange={handleRegisterFormChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterFormChange}
                  placeholder="Enter password (min 6 characters)"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  required
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Password must be at least 6 characters long
                </small>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={closeRegisterForm}
                  style={{ padding: "8px 16px", background: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{ padding: "8px 16px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT POPUP ===================== */}
      {editData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999
          }}
        >
          <div style={{
            background: "white",
            padding: "20px",
            width: "400px",
            borderRadius: "8px"
          }}>
            <h3>Edit Tenant</h3>

            <label>Name:</label>
            <input
              type="text"
              value={editData.UserName}
              onChange={(e) => setEditData({ ...editData, UserName: e.target.value })}
              style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
            />

            <label>Email:</label>
            <input
              type="email"
              value={editData.UserEmailID}
              onChange={(e) => setEditData({ ...editData, UserEmailID: e.target.value })}
              style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
            />

            <label>Contact:</label>
            <input
              type="text"
              value={editData.UserCNo}
              onChange={(e) => setEditData({ ...editData, UserCNo: e.target.value })}
              style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
            />

            <label>Home Number:</label>
            <input
              type="text"
              value={editData.homeNumber}
              onChange={(e) => setEditData({ ...editData, homeNumber: e.target.value })}
              style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setEditData(null)}
                style={{ padding: "6px 12px", background: "gray", color: "white", border: "none", borderRadius: "5px" }}
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                style={{ padding: "6px 12px", background: "green", color: "white", border: "none", borderRadius: "5px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TenantRequestsAdminPanel;