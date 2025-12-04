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
        }}>Welcome Tenant 👋</h1>

        <div style={{
          color: "#252525",
          fontSize: "1.12rem",
          fontWeight: 500
        }}>
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </div>

        <div style={{
          color: "#888",
          fontSize: "1.15rem",
          marginTop: 2,
          fontFamily: "monospace"
        }}>
          {now.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

// --- Reusable Card Component ---
function Card({ emoji, title, description, to }) {
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
        transition: "0.2s",
        border: "1.8px solid #eaeefe"
      }}
      onMouseOver={e => e.currentTarget.style.transform = "scale(1.025)"}
      onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ fontSize: "2.3rem", marginBottom: 14 }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ color: "#4d4d4d", fontSize: "1.04rem" }}>
        {description}
      </div>
    </Link>
  );
}

// --- Tenant Dashboard ---
export default function TenantDashboard() {
  return (
    <div style={{ padding: "2rem", background: "#f7faff", minHeight: "100vh" }}>
      <WelcomeBanner />

      {/* Grid */}
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
          title="Announcements"
          description="View latest announcements from your society."
          to="/tenant/announcements"
        />

        <Card
          emoji="🏛️"
          title="Hall Booking"
          description="Book the society hall for functions or programs."
          to="/tenant/hall-booking"
        />

        <Card
          emoji="📝"
          title="Complaints"
          description="Submit new complaints or track your complaint status."
          to="/tenant/complaints"
        />

      
      </div>
    </div>
  );
}