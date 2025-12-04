import React, { useEffect, useState } from "react";

export default function ViewAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then((res) => {
        if (!res.ok) throw new Error("API not found");
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data);
        if (Array.isArray(data)) setAnnouncements(data);
        else if (Array.isArray(data.announcements))
          setAnnouncements(data.announcements);
        else setAnnouncements([]);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements:", err);
        setAnnouncements([]);
      });
  }, []);

  return (
    <div
      style={{
        marginLeft: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px",
        background: "#f5f6fa",
        width: "50vw",
        // minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "95%", // ⬅️ Increased container width (was 90%)
          maxWidth: "1400px", // ⬅️ Increased from 1000px
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "40px 50px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#333",
            fontSize: "2rem",
            borderBottom: "4px solid #6c63ff",
            display: "inline-block",
            paddingBottom: "6px",
          }}
        >
          📢 Announcements
        </h2>

        {announcements.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#777",
              fontSize: "1.2rem",
            }}
          >
            No announcements available right now.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // ⬅️ makes each card wider
              gap: "25px",
            }}
          >
            {announcements.map((ann, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f9f9ff",
                  borderRadius: "12px",
                  padding: "25px 30px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderLeft: "6px solid #6c63ff",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    color: "#333",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  {ann.Description}
                </h3>
                <p style={{ color: "#666", margin: "5px 0 10px 0" }}>
                  📅{" "}
                  {ann.ProgramDate
                    ? new Date(ann.ProgramDate).toLocaleDateString()
                    : "No Date Specified"}
                </p>
                <small style={{ color: "#999" }}>
                  🕒 Posted on {new Date(ann.DateCreated).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
