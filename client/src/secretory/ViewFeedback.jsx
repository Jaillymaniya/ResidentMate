import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function ViewFeedback() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all complaints with feedback (backend already sends Feedback field)
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/complaints`);
      const data = await res.json();
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feedback Details (Secretary)</h2>

      <table
        width="100%"
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Complaint</th>
            <th>User</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Comments</th>
            <th>Date Submitted</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.ComplaintDescription}</td>

              <td>
                {c.UserID?.UserFname} {c.UserID?.UserLname}
                <br />
                <small>{c.UserID?.UserEmailID}</small>
              </td>

              <td>{c.Status}</td>

              {/* ⭐ Rating */}
              <td>
                {c.Feedback ? (
                  <strong>{c.Feedback.Rating} ⭐</strong>
                ) : (
                  <span style={{ color: "gray" }}>Not given</span>
                )}
              </td>

              {/* ⭐ Comments */}
              <td>
                {c.Feedback?.Comments
                  ? c.Feedback.Comments
                  : "No comments"}
              </td>

              {/* ⭐ Date */}
              <td>
                {c.Feedback?.DateSubmitted
                  ? new Date(c.Feedback.DateSubmitted).toLocaleString()
                  : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
