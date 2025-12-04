// import React, { useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function SecretaryLayout({ children }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("email");
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       navigate("/login", { replace: true });
//     }
//   }, [navigate]);

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="logo">Welcome Secretary</h2>

//         <ul className="menu">
//           <li><a href="/secretorydashboard">🏠 Dashboard</a></li>
//           <li><Link to="/secretory/announcement">📢 Manage Announcements</Link></li>
//           <li><a href="/secretory/tenants">🏘 Manage Tenants</a></li>
//           <li><a href="/secretory/complaints">📢 Complaints</a></li>
//           <li><a href="/secretory/maintenance">💰 Maintenance</a></li>
//           <li><a href="/secretory/meetings">📅 Meetings</a></li>
//           <li><a href="/secretory/notices">📰 Notices</a></li>
//           <li><a href="/secretory/reports">📊 Reports</a></li>
//           <li><a href="/secretory/hall-booking">🏛 Hall Bookings</a></li>
//           <li><a href="/secretory/ViewFeedback">💰 View Feedback</a></li>

//           <li className="logout">
//             <a onClick={handleLogout} href="#" className="logout-link">🚪 Logout</a>
//           </li>
//         </ul>
//       </aside>

//       {/* Main Section */}
//       <div className="main">
//         {/* Navbar */}
//         <header className="navbar">
//           <div className="brand">📘 Secretary Dashboard</div>
//           <div className="nav-links">
//             <Link to="/secretory/profile" style={{ color: 'white', textDecoration: 'none' }}>👤 Profile</Link> |
//             <Link to="/secretory/change-password" style={{ color: 'white', textDecoration: 'none' }}> 🔐 Change Password</Link>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="content">
//           <div className="page-container">{children}</div>
//           </main>
//       </div>

//       {/* Inline Styles */}
//       <style>{`
//         /* Always keep consistent scrollbar width */
//         html {
//           // overflow-y: scroll;
//         }

//         body {
//           margin: 0;
//           font-family: 'Segoe UI', Tahoma, sans-serif;
//           background: #f0f2f5;
//           // overflow: hidden; /* Prevent horizontal scroll */
//            overflow-x: hidden;
//         }

//         /* Main container */
//         .dashboard-container {
//           display: flex;
//           height: 100vh;
//           overflow: hidden; /* Prevent horizontal scroll */
//         }

//         /* Sidebar (Fixed Left) */
//         .sidebar {
//           position: fixed;
//           left: 0;
//           top: 0;
//           height: 100vh;
//           width: 260px; /* ✅ Fixed width */
//           background: #fff;
//           border-right: 1px solid #ddd;
//           padding: 1rem;
//           box-sizing: border-box;
//           display: flex;
//           flex-direction: column;
//           overflow-y: auto;
//           z-index: 1000;
//         }

//         .page-container {
//           width: 80vw;
//         }


//         .sidebar .logo {
//           font-size: 1.4rem;
//           font-weight: bold;
//           color: #1877f2;
//           margin-bottom: 2rem;
//         }

//         .sidebar .menu {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//           flex: 1;
//         }

//         .sidebar .menu li {
//           margin: 1rem 0;
//           margin-left: 10px;
//           margin-bottom: 40px;
//         }

//         .sidebar .menu a {
//           text-decoration: none;
//           color: #050505;
//           font-size: 1rem;
//           font-weight: 500;
//         }

//         .sidebar .menu a:hover {
//           color: #1877f2;
//         }

//         .sidebar .logout a {
//           color: #e41e3f;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         /* Main Section (Right Side) */
//         .main {
//           margin-left: 260px; /* same as sidebar width */
//           width: calc(100% - 260px);
//           display: flex;
//           flex-direction: column;
//           height: 100vh;
//           // overflow: hidden;
//           background: #f8f9fc;
//         }

//         /* Navbar (Fixed Top) */
//         .navbar {
//           position: fixed;
//           top: 0;
//           left: 260px; /* same as sidebar width */
//           width: calc(100% - 260px);
//           height: 60px;
//           background: #1877f2;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 1.5rem;
//           font-weight: bold;
//           box-sizing: border-box;
//           z-index: 999;
//         }

//         .nav-link {
//           color: white;
//           text-decoration: none;
//           margin: 0 4px;
//         }

//         /* Content Area (Scrollable only here) */
//         .content {
//           margin-top: 60px; /* navbar height */
//           height: calc(100vh - 60px);
//           padding: 2rem;
//           //overflow-y: auto;
//           overflow-x: hidden;
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='40' cy='40' r='39' fill='white' stroke='%231877f2' stroke-width='2'/><circle cx='40' cy='30' r='14' fill='black'/><ellipse cx='40' cy='54' rx='22' ry='14' fill='black'/></svg>";

export default function SecretaryLayout({ children }) {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState("");
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    if (email) {
      axios
        .get(`http://localhost:5000/api/secretary/${email}`)
        .then(res => {
          if (res.data.Photo) {
            setPhotoUrl(`http://localhost:5000/uploads/${res.data.Photo}`);
          } else {
            setPhotoUrl(DEFAULT_AVATAR);
          }
        })
        .catch(() => setPhotoUrl(DEFAULT_AVATAR))
        .finally(() => setSidebarLoading(false));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Welcome Secretary</h2>
        <div className="profile-photo-container">
          {sidebarLoading ? (
            <div className="profile-photo placeholder"></div>
          ) : (
            <img src={photoUrl} alt="Profile" className="profile-photo" />
          )}
        </div>
        <ul className="menu">
          <li><a href="/secretorydashboard">🏠 Dashboard</a></li>
          <li><a href="/secretory/announcement">📢 Manage Announcements</a></li>
          <li><a href="/secretory/complaints">📮 Complaints</a></li>
          <li><a href="/secretory/hall-booking">📆 Hall Booking</a></li>
          <li><a href="/secretory/maintenance">💰 Manage Maintenance</a></li>
          <li><a href="/secretory/paidMaintainance">💰 Paid Maintenance</a></li>
          <li><a href="/secretory/ViewFeedback">💬 View Feedback</a></li>
          <li className="logout">
            <a onClick={handleLogout} href="#" className="logout-link">🚪 Logout</a>
          </li>
        </ul>
      </aside>

      <div className="main">
        <header className="navbar">
          <div className="brand">📘 Secretary Dashboard</div>
          <div className="nav-links">
            <Link to="/secretory/SecretaryProfile" style={{ color: 'white', textDecoration: 'none' }}>👤 Profile</Link> |
            <Link to="/secretory/change-password" style={{ color: 'white', textDecoration: 'none' }}> 🔐 Change Password</Link>
          </div>
        </header>
        <main className="content">
          <div className="page-container">{children}</div>
        </main>
      </div>

      {/* CSS styles: copy from AdminLayout/OwnerLayout for consistent look */}
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
        html {}
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
      `}</style>
    </div>
  );
}
