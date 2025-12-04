// import React from "react";
// import { Link } from "react-router-dom";

// export default function NotFound() {
//   return (
//     <div style={{ textAlign: "center", marginTop: "5rem" }}>
//       <h1>404 - Page Not Found</h1>
//       <p>The page you are looking for does not exist.</p>
//       <Link to="/">Go to Home</Link>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(to bottom right, #e3f2fd, #e0f7fa)",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#0d47a1", marginBottom: "0.5rem" }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        style={{
          color: "#1565c0",
          textDecoration: "none",
          fontWeight: "bold",
          border: "2px solid #1565c0",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#1565c0", e.target.style.color = "white")}
        onMouseOut={(e) => (e.target.style.background = "transparent", e.target.style.color = "#1565c0")}
      >
        Go to Home
      </Link>
    </div>
  );
}
