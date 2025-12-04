import { useState, useEffect } from "react";
import axios from "axios";

export default function AddComplaint() {
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [ownerId, setOwnerId] = useState(null);

  // Feedback states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackComplaintId, setFeedbackComplaintId] = useState(null);

  const email = localStorage.getItem("email");

  // Get Owner ID
  const fetchOwnerId = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/complaints/getOwnerByEmail?email=${email}`
      );
      setOwnerId(res.data.ownerId);
      return res.data.ownerId;
    } catch (err) {
      console.error("Failed to get ownerId:", err);
      return null;
    }
  };

  const loadComplaints = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/complaints/owner?ownerId=${id}`
      );
      setComplaints(res.data);
    } catch (err) {
      console.error("Error loading complaints:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const id = await fetchOwnerId();
      if (id) loadComplaints(id);
    };
    init();
  }, []);

  // Submit complaint / edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setMessage("Please enter a complaint");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/complaints/edit/${editId}`,
          { ComplaintDescription: description }
        );
        setMessage("Complaint Updated Successfully");
      } else {
        await axios.post("http://localhost:5000/api/complaints/add", {
          ComplaintDescription: description,
          UserID: ownerId,
        });
        setMessage("Complaint Submitted Successfully");
      }

      setDescription("");
      setEditId(null);
      loadComplaints(ownerId);
    } catch (error) {
      console.error(error);
      setMessage("Error occurred");
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:5000/api/complaints/delete/${id}`);
    loadComplaints(ownerId);
  };

  // Edit
  const handleEdit = (c) => {
    setDescription(c.ComplaintDescription);
    setEditId(c._id);
  };

  // ⭐ Submit Feedback (rating + comment)
  const submitFeedback = async () => {
    if (!rating) {
      setMessage("Please select rating");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/feedback/add`, {
        ComplaintID: feedbackComplaintId,
        UserID: ownerId,
        Rating: rating,
        Comments: comment,
      });

      setMessage("Feedback submitted successfully");

      setFeedbackComplaintId(null);
      setRating(0);
      setComment("");

      loadComplaints(ownerId);
    } catch (err) {
      console.error(err);
      setMessage("Error submitting feedback");
    }
  };

  // ⭐ Render Stars
  const Star = ({ selected, onClick }) => (
    <span
      onClick={onClick}
      style={{
        fontSize: "30px",
        cursor: "pointer",
        color: selected ? "gold" : "gray",
      }}
    >
      ★
    </span>
  );

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>Submit Complaint</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Complaint Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "10px",
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "blue",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {editId ? "Update Complaint" : "Submit"}
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>Your Complaints</h3>

      {complaints.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        complaints.map((c) => (
          <div
            key={c._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <p>
              <b>Description:</b> {c.ComplaintDescription}
            </p>

            <p>
              <b>Status:</b> {c.Status}
            </p>

            {/* ⭐ Show Rating if feedback exists */}
            {c.Feedback?.Rating && (
              <p>
                <b>Feedback:</b>{" "}
                {"★".repeat(c.Feedback.Rating) +
                  "☆".repeat(5 - c.Feedback.Rating)}
                <br />
                <b>Comments:</b> {c.Feedback.Comments}
              </p>
            )}

            {/* Edit/Delete only when pending */}
            {c.Status === "Pending" && !c.Feedback && (
              <>
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    marginRight: "10px",
                    padding: "6px 12px",
                    background: "orange",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(c._id)}
                  style={{
                    padding: "6px 12px",
                    background: "red",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </>
            )}

            {/* ⭐ Feedback button (disabled after submit) */}
            {c.Status === "Resolved" && (
              <button
                disabled={!!c.Feedback}
                onClick={() => setFeedbackComplaintId(c._id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: c.Feedback ? "gray" : "green",
                  cursor: c.Feedback ? "not-allowed" : "pointer",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                {c.Feedback ? "Feedback Submitted" : "Give Feedback"}
              </button>
            )}

            {/* ⭐ Feedback Form */}
            {feedbackComplaintId === c._id && !c.Feedback && (
              <div
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  border: "1px solid black",
                  borderRadius: "8px",
                }}
              >
                <p>Select Rating:</p>

                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    selected={rating >= num}
                    onClick={() => setRating(num)}
                  />
                ))}

                <textarea
                  placeholder="Write your comments..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid gray",
                  }}
                ></textarea>

                <button
                  onClick={submitFeedback}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    background: "purple",
                    color: "white",
                    borderRadius: "6px",
                  }}
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
