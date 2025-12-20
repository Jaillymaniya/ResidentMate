import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function AppointmentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const ownerId = localStorage.getItem("ownerId");
  //   if (!ownerId) {
  //     setError("Owner ID not set! Please login again.");
  //     setLoading(false);
  //     return;
  //   }
  //   fetch(`${API_BASE}/api/appointments/owner?ownerId=${ownerId}`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch appointments");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Fetched appointments:", data);
  //       setRequests(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Fetch error:", err);
  //       setError("Failed to load appointments.");
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setError("Email not found! Please login.");
      setLoading(false);
      return;
    }

    // STEP 1 → Get owner by email
    fetch(`${API_BASE}/api/appointments/getOwnerByEmail?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch owner");
        return res.json();
      })
      .then((owner) => {
        if (!owner || !owner.ownerId) {
          throw new Error("Owner not found!");
        }

        console.log("Owner fetched:", owner);

        // STEP 2 → Get appointments using owner._id
        if (!owner || !owner.ownerId) throw new Error("Owner not found!");
        return fetch(`${API_BASE}/api/appointments/owner?ownerId=${owner.ownerId}`);

      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
        console.log("Appointments:", data);
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    console.log(`Updating appointment ${id} to ${status}`);
    fetch(`${API_BASE}/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((updated) => {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === updated._id ? { ...r, Status: updated.Status } : r
          )
        );
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update status: " + err.message);
      });
  };

  const handleCheckout = (id) => {
    if (window.confirm("Mark this appointment as checkout?")) {
      fetch(`${API_BASE}/api/appointments/${id}/checkout`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          setRequests((prev) =>
            prev.map((r) =>
              r._id === data.appointment._id
                ? { ...r, Status: data.appointment.Status }
                : r
            )
          );
        })
        .catch(err => alert("Error: " + err.message));
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!Array.isArray(requests) || requests.length === 0)
    return <p>No appointment requests found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Rental Appointment Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Home</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.TenantName}</td>
              <td>{r.TenantEmail}</td>
              <td>{r.TenantContact}</td>
              {/* <td>{r.AssignID?.HomeNumber || "N/A"}</td> */}
              <td>{r.AssignID?.HomeID?.HomeNumber || "N/A"}</td>
              <td>
                {r.RequestDate
                  ? new Date(r.RequestDate).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      r.Status === "Accepted"
                        ? "green"
                        : r.Status === "Rejected"
                          ? "red"
                          : r.Status === "Checkout"
                            ? "#FF9800"
                            : "orange",
                  }}
                >
                  {r.Status === "Checkout" ? "Checkout" : r.Status}
                </span>
              </td>
              <td>
                {r.Status === "Pending" ? (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => handleStatusChange(r._id, "Accepted")}
                      className="btn-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(r._id, "Rejected")}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </div>
                ) : r.Status === "Accepted" ? (
                  <button
                    onClick={() => handleCheckout(r._id)}
                    className="btn-checkout"
                  >
                    Checkout
                  </button>
                ) : (
                  <span style={{ color: "#999", fontWeight: "bold" }}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        th {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.8rem;
          font-weight: 600;
          text-align: left;
          color: #333;
        }
        td {
          border: 1px solid #ddd;
          padding: 0.8rem;
        }
        tr:hover { background: #f9f9f9; }
        .btn-accept {
          background: #4CAF50;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-accept:hover { background: #45a049; }
        .btn-reject {
          background: #f44336;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-reject:hover { background: #da190b; }
        .btn-checkout {
          background: #2196F3;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-checkout:hover { background: #0b7dda; }
        `}</style>
    </div>
  );
}