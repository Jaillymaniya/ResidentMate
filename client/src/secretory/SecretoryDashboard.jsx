import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --- Welcome Banner with live date and time ---
function WelcomeBanner() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1.8rem"
    }}>
      <div>
        <h1 style={{
          color: "#1877f2",
          fontWeight: 900,
          fontSize: "2.3rem",
          marginBottom: 6,
          letterSpacing: "-2px"
        }}>Welcome Secretary 👋</h1>
        <div style={{
          color: "#252525",
          fontSize: "1.12rem",
          fontWeight: 500
        }}>{now.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric"
        })}</div>
        <div style={{
          color: "#888",
          fontSize: "1.15rem",
          marginTop: 2,
          fontFamily: "monospace"
        }}>{now.toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

// --- Status Badge for Complaints Card ---
function StatusBadge({ label, value, color }) {
  return (
    <span style={{
      background: color + '22',
      color,
      borderRadius: "18px",
      padding: "6px 18px",
      fontWeight: 700,
      fontSize: "1.04rem",
      boxShadow: "0 2px 8px #0001"
    }}>
      {label}: {value}
    </span>
  );
}

// --- Refactored Card Component ---
function Card({ emoji, title, description, to, bottomContent }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        textDecoration: "none",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 16px rgba(30,30,66,0.11)",
        padding: "2.2rem 2.1rem 1.3rem 2rem",
        minHeight: 202,
        color: "#1a1a1a",
        transition: "box-shadow 0.18s, transform 0.14s",
        border: "1.8px solid #eaeefe"
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.025)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ fontSize: "2.3rem", marginBottom: 14 }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: 8 }}>{title}</div>
      <div style={{ color: "#4d4d4d", fontSize: "1.04rem", marginBottom: bottomContent ? 16 : 0 }}>{description}</div>
      {bottomContent}
    </Link>
  );
}

// --- Complaints Card (Styled Same as Others) ---
function ComplaintsSummaryCard() {
  const [counts, setCounts] = useState({ pending: 0, resolved: 0, total: 0 });
  useEffect(() => {
    fetch("http://localhost:5000/api/complaints/count")
      .then(res => res.json())
      .then(data => setCounts(data));
  }, []);

  const badges = (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 24,
      alignItems: "center",
      fontWeight: 700,
      fontSize: "1.05rem"
    }}>
      <StatusBadge color="#ff9800" label="Pending" value={counts.pending} />
      <StatusBadge color="#4caf50" label="Solved" value={counts.resolved} />
      <StatusBadge color="#1877f2" label="Total" value={counts.total} />
    </div>
  );

  return (
    <Card
      emoji="📢"
      title="View Complaints"
      description="View complaints from Owners/Tenants. Track pending/solved status."
      to="/secretory/complaints"
      bottomContent={badges}
    />
  );
}

// --- Main Dashboard Component ---
export default function SecretoryDashboard() {
  return (
    <div style={{ padding: "2rem", height: "100%", borderRadius: "10px", background: "#f7faff" }}>
      <WelcomeBanner />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "2.1rem",
          marginTop: "2rem"
        }}
      >
        <Card
          emoji="📢"
          title="Manage Announcements"
          description="Post and manage society announcements, meetings, festivals, or events."
          to="/secretory/announcement"
        />
        <Card
          emoji="💰"
          title="Manage Maintenance"
          description="View, create and update society maintenance records."
          to="/secretory/maintenance"
        />
        <ComplaintsSummaryCard />
        <Card
          emoji="💬"
          title="View Feedback"
          description="Review feedback submitted by owners and tenants and take action."
          to="/secretory/ViewFeedback"
        />
        <Card
          emoji="🏛️"
          title="Approve Hall Bookings"
          description="Approve or reject hall booking requests with date management."
          to="/secretory/ManageHallBooking"
        />
      </div>
    </div>
  );
}