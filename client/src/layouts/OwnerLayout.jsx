//with notification
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../api";

// Default SVG avatar
const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='40' cy='40' r='39' fill='white' stroke='%231877f2' stroke-width='2'/><circle cx='40' cy='30' r='14' fill='black'/><ellipse cx='40' cy='54' rx='22' ry='14' fill='black'/></svg>";

export default function OwnerLayout({ children }) {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState("");
  const [sidebarLoading, setSidebarLoading] = useState(true);

  // 🔔 notification state for owner
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    if (email) {
      axios
        .get(`${API_BASE_URL}/api/owner/${email}`)
        .then((res) => {
          if (res.data.Photo) {
            setPhotoUrl(`${API_BASE_URL}/uploads/${res.data.Photo}`);
          } else {
            setPhotoUrl(DEFAULT_AVATAR);
          }
        })
        .catch(() => setPhotoUrl(DEFAULT_AVATAR))
        .finally(() => setSidebarLoading(false));
    }
  }, [navigate]);

  // 🔔 Owner socket connection
  useEffect(() => {
    const socket = io(`${API_BASE_URL}`, {
      // transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ OWNER SOCKET CONNECTED:", socket.id);
      socket.emit("join-room", "Owner");
    });

    socket.on("new-announcement", (data) => {
      console.log("📨 OWNER GOT ANNOUNCEMENT:", data);
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Owner socket error:", err.message);
    });

    return () => {
      socket.off("new-announcement");
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Welcome to Owner Panel</h2>

        {/* Owner Photo */}
        <div className="profile-photo-container">
          {sidebarLoading ? (
            <div className="profile-photo placeholder"></div>
          ) : (
            <img
              src={photoUrl || DEFAULT_AVATAR}
              alt="Owner"
              className="profile-photo"
            />
          )}
        </div>

        <ul className="menu">
          <li>
            <Link to="/ownerdashboard">🏠 Dashboard</Link>
          </li>

          {/* 📢 Announcements with count on icon */}
          <li>
            <Link to="/owner/announcement" className="announcement-link">
              <span className="announcement-icon-wrapper">
                📢
                {unreadCount > 0 && (
                  <span className="announcement-count">{unreadCount}</span>
                )}
              </span>
              <span className="announcement-text">Announcements</span>
            </Link>
          </li>

          <li>
            <Link to="/owner/active-maintenance">💳 Pay Maintenance</Link>
          </li>
          <li>
            <Link to="/owner/SubmitComplaint">📝 Complaints</Link>
          </li>
          <li>
            <Link to="/owner/hall-booking">🎉 Hall Booking</Link>
          </li>
          <li>
            <Link to="/owner/appointments">🏘 Rental Appointments</Link>
          </li>

          <li className="logout">
            <a onClick={handleLogout} href="#" className="logout-link">
              🚪 Logout
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Section */}
      <div className="main">
        {/* Navbar */}
        <header className="navbar">
          <div className="brand">📘 My Dashboard</div>

          <div className="nav-links">
            <Link to="/owner/OwnerProfile" className="nav-link">
              👤 Profile
            </Link>{" "}
            |
            <Link to="/owner/change-password" className="nav-link">
              🔐 Change Password
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="content">
          <div className="page-container">{children}</div>
        </main>
      </div>

      {/* STYLES */}
      <style>{`
        .profile-photo-container {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
          margin-left: 10px;
        }
        .profile-photo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #1877f2;
          object-fit: cover;
          background: #eee;
          display: block;
        }
        .profile-photo.placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ccc;
          border: 2px solid #aaa;
        }

        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background: #f0f2f5;
          overflow-x: hidden;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 260px;
          background: #fff;
          border-right: 1px solid #ddd;
          padding: 1rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 1000;
        }

        .page-container {
          width: 80vw;
        }

        .sidebar .logo {
          font-size: 1.4rem;
          font-weight: bold;
          color: #1877f2;
          margin-bottom: 2rem;
        }

        .sidebar .menu {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }
        .sidebar .menu li {
          margin: 1rem 0;
          margin-left: 10px;
          margin-bottom: 30px;
        }
        .sidebar .menu a {
          text-decoration: none;
          color: #050505;
          font-size: 1rem;
          font-weight: 500;
        }
        .sidebar .menu a:hover {
          color: #1877f2;
        }

        .sidebar .logout a {
          color: #e41e3f;
          font-weight: 600;
          cursor: pointer;
        }

        .main {
          margin-left: 260px;
          width: calc(100% - 260px);
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8f9fc;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 260px;
          width: calc(100% - 260px);
          height: 60px;
          background: #1877f2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          font-weight: bold;
          box-sizing: border-box;
          z-index: 999;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          margin: 0 4px;
        }

        .content {
          margin-top: 60px;
          height: calc(100vh - 60px);
          padding: 2rem;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* 📢 Announcement icon + count */
        .announcement-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #050505;
          font-size: 1rem;
          font-weight: 500;
        }
        .announcement-icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .announcement-count {
          position: absolute;
          top: -6px;
          right: -10px;
          background: #ff4757;
          color: #fff;
          border-radius: 50%;
          padding: 1px 5px;
          font-size: 0.7rem;
          min-width: 16px;
          text-align: center;
          line-height: 1.1;
        }
        .announcement-text {
        }
      `}</style>
    </div>
  );
}