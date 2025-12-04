import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/halls/all-bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};



  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/halls/update-status/${id}`, {
        Status: status,
      });
      toast.success(`Booking ${status.toLowerCase()} successfully!`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#d4edda", color: "#155724", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold" };
      case "Rejected":
        return { backgroundColor: "#f8d7da", color: "#721c24", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold" };
      case "Pending":
      default:
        return { backgroundColor: "#fff3cd", color: "#856404", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold" };
    }
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
  };

  const thStyle = {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    color: "#333",
  };

  const buttonStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const approveButton = { ...buttonStyle, backgroundColor: "#28a745", color: "#fff", marginRight: "6px" };
  const rejectButton = { ...buttonStyle, backgroundColor: "#dc3545", color: "#fff" };

  const containerStyle = {
    padding: "30px",
    backgroundColor: "#f9f9f9",
    // minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const headerStyle = {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  };

  const emptyStyle = {
    textAlign: "center",
    marginTop: "50px",
    color: "#777",
  };

  const emptyIconStyle = {
    fontSize: "60px",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <h1 style={headerStyle}>All Hall Bookings</h1>

      {bookings.length === 0 ? (
        <div style={emptyStyle}>
          <div style={emptyIconStyle}>📅</div>
          <h2 style={{ fontSize: "20px", marginBottom: "6px" }}>No Booking Requests</h2>
          <p>You don't have any booking requests at the moment.</p>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              {["User", "Event Name", "From Date", "To Date", "Purpose", "Status", "Action"].map((header) => (
                <th key={header} style={thStyle}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} style={{ transition: "background-color 0.2s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f1f1"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                <td style={tdStyle}>{booking.UserID?.UserName || "N/A"}</td>
                <td style={tdStyle}>{booking.EventName}</td>
                <td style={tdStyle}>{formatDate(booking.FromDate)}</td>
                <td style={tdStyle}>{formatDate(booking.ToDate)}</td>
                <td style={tdStyle}>{booking.Purpose}</td>
                <td style={tdStyle}>
                  <span style={getStatusStyle(booking.Status)}>{booking.Status}</span>
                </td>
                <td style={tdStyle}>
                  {booking.Status === "Pending" && (
                    <>
                      <button style={approveButton} onClick={() => updateStatus(booking._id, "Approved")}>Approve</button>
                      <button style={rejectButton} onClick={() => updateStatus(booking._id, "Rejected")}>Reject</button>
                    </>
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
