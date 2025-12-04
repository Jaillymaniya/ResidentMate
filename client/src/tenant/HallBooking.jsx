import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HallBookingPanel() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    FromDate: "",
    ToDate: "",
    EventName: "",
    Purpose: "",
  });
  const [editingId, setEditingId] = useState(null);

  // get email from localStorage
  const email = localStorage.getItem("email");

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/halls/my-bookings/${email}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (!email) {
      toast.error("No email found in localStorage");
      return;
    }
    fetchBookings();
  }, [email]);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or edit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Edit booking
        await axios.put(`http://localhost:5000/api/halls/edit/${editingId}`, {
          ...form,
          email,
        });
        toast.success("Booking updated successfully");
      } else {
        // Add booking
        await axios.post("http://localhost:5000/api/halls/book", {
          ...form,
          email,
        });
        toast.success("Hall booked successfully");
      }
      setForm({ FromDate: "", ToDate: "", EventName: "", Purpose: "" });
      setEditingId(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save booking");
    }
  };

  // Edit button
  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setForm({
      FromDate: booking.FromDate.slice(0, 10),
      ToDate: booking.ToDate.slice(0, 10),
      EventName: booking.EventName,
      Purpose: booking.Purpose,
    });
  };

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/halls/delete/${id}/${email}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="hall-booking-container">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="booking-header">
        <h1 className="main-title">Hall Booking Management</h1>
        <p className="subtitle">Book and manage your event hall reservations</p>
      </div>

      {/* Booking Form */}
      <div className="form-section">
        <h2 className="section-title">{editingId ? "Edit Booking" : "Add New Booking"}</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                name="FromDate"
                value={form.FromDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="ToDate"
                value={form.ToDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="EventName"
              placeholder="Enter event name"
              value={form.EventName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <input
              type="text"
              name="Purpose"
              placeholder="Enter purpose of booking"
              value={form.Purpose}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "Update Booking" : "Book Hall"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  setForm({ FromDate: "", ToDate: "", EventName: "", Purpose: "" }); 
                }}
                className="cancel-btn"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bookings List */}
      <div className="bookings-section">
        <h2 className="section-title">My Bookings</h2>
        {(!Array.isArray(bookings) || bookings.length === 0) ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Bookings Found</h3>
            <p>You haven't made any hall bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="booking-row">
                    <td className="event-name">{b.EventName || "-"}</td>
                    <td className="date-cell">{b.FromDate ? b.FromDate.slice(0, 10) : "-"}</td>
                    <td className="date-cell">{b.ToDate ? b.ToDate.slice(0, 10) : "-"}</td>
                    <td className="purpose-cell">{b.Purpose || "-"}</td>
                    <td>
                      <span className={`status-badge status-${b.Status?.toLowerCase() || "pending"}`}>
                        {b.Status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(b)}
                          disabled={b.Status === "Rejected" || b.Status === "Approved"}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(b._id)} 
                        disabled={b.Status === "Rejected" || b.Status === "Approved"}
                        className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .hall-booking-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        .booking-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .form-section {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .form-input::placeholder {
          color: #a0aec0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .cancel-btn {
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }

        .bookings-section {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }

        .bookings-table-container {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .bookings-table th {
          background: #f7fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bookings-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }

        .booking-row:hover {
          background: #f8fafc;
        }

        .event-name {
          font-weight: 600;
          color: #2d3748;
        }

        .date-cell {
          color: #4a5568;
          font-family: monospace;
        }

        .purpose-cell {
          color: #718096;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-pending {
          background: #fffaf0;
          color: #d69e2e;
          border: 1px solid #faf089;
        }

        .status-approved {
          background: #f0fff4;
          color: #38a169;
          border: 1px solid #9ae6b4;
        }

        .status-rejected {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fc8181;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn {
          background: #ed8936;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn:hover:not(:disabled) {
          background: #dd771b;
        }

        .edit-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .delete-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
          opacity: 0.6;
        }


        .delete-btn {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          background: #c53030;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hall-booking-container {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .booking-header {
            padding: 1.5rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .bookings-table {
            font-size: 0.9rem;
          }

          .bookings-table th,
          .bookings-table td {
            padding: 0.75rem 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}