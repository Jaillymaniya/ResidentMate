import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBookOpen, FaSignOutAlt, FaEnvelope } from "react-icons/fa";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleOwner = () => navigate("/ownerdashboard");
  const handleSecretary = () => navigate("/secretorydashboard");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="role-page">
      <div className="role-card">
        <h1 className="role-title">Welcome Back</h1>
        <div className="role-email">
          <FaEnvelope className="icon-email" /> {email}
        </div>
        <p className="role-subtitle">
          Select your role to continue to the appropriate dashboard.
        </p>

        <div className="role-grid">
          <div onClick={handleOwner} className="role-box owner-box">
            <FaUser className="role-icon" />
            <h2>Owner Dashboard</h2>
            <p>Manage properties, requests, and documentation.</p>
          </div>

          <div onClick={handleSecretary} className="role-box secretary-box">
            <FaBookOpen className="role-icon" />
            <h2>Secretary Dashboard</h2>
            <p>Oversee society operations and approvals.</p>
          </div>
        </div>

        <div className="logout-section">
          {/* <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button> */}
        </div>
      </div>

      {/* Updated CSS */}
      <style>{`
        /* Page layout */
        .role-page {
          min-height: 100vh;
          width: 92vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e0f2fe, #f0fdfa);
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        /* Center card */
        .role-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          max-width: 850px;
          width: 90%;
          padding: 50px 60px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .role-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }

        /* Title */
        .role-title {
          font-size: 36px;
          color: #111827;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .role-email {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .icon-email {
          color: #9ca3af;
        }

        .role-subtitle {
          color: #4b5563;
          font-size: 16px;
          margin-bottom: 40px;
        }

        /* Role buttons */
        .role-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
          margin-bottom: 40px;
        }

        @media (min-width: 768px) {
          .role-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .role-box {
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 25px 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .role-box:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
        }

        .role-box h2 {
          font-size: 18px;
          color: #111827;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .role-box p {
          font-size: 14px;
          color: #4b5563;
        }

        .role-icon {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .owner-box {
          color: #4338ca;
          border-color: #c7d2fe;
        }

        .owner-box:hover {
          background: #eef2ff;
        }

        .secretary-box {
          color: #047857;
          border-color: #a7f3d0;
        }

        .secretary-box:hover {
          background: #ecfdf5;
        }

        /* Logout */
        .logout-section {
          text-align: center;
        }

        .logout-btn {
          background: #e5e7eb;
          border: none;
          border-radius: 25px;
          padding: 10px 25px;
          color: #374151;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
