import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all complaints for Secretary
  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`);
      const data = await res.json();
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching complaints:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Solve button → change status to Resolved
  const handleSolve = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/complaints/status/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Status: "Solved" }) // IMPORTANT!
        }
      );

      if (!res.ok) {
        alert("Failed to update status");
        return;
      }

      alert("Complaint marked as Resolved");
      fetchComplaints(); // refresh list
    } catch (err) {
      console.log("Error solving complaint:", err);
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Complaints (Secretary)</h2>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table
          border="1"
          width="100%"
          cellPadding="10"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Complaint</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.ComplaintDescription}</td>

                <td>
                  {c.UserID?.UserFname} {c.UserID?.UserLname} <br />
                  <small>{c.UserID?.UserEmailID}</small>
                </td>

                <td>{new Date(c.DateCreated).toLocaleString()}</td>

                <td>{c.Status}</td>

                <td>
                  {c.Status === "Resolved" ? (
                    <span
                      style={{ color: "green", fontWeight: "bold" }}
                    >
                      Solved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSolve(c._id)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Solve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
