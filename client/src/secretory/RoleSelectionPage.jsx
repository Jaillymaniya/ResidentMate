// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function RoleSelectionPage() {
//   const navigate = useNavigate();
//   const email = localStorage.getItem("email");

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-cyan-100 px-6">
//       <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center border border-gray-200">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-3 flex justify-center items-center gap-2">
//           Welcome <span className="animate-wave">👋</span>
//         </h1>

//         <h2 className="text-lg font-medium text-gray-700 mb-6">
//           {email}
//         </h2>

//         <p className="text-gray-600 mb-10 leading-relaxed">
//           You have access to both <strong>Owner</strong> and{" "}
//           <strong>Secretory</strong> panels. Please choose which one you’d like to open.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-5 justify-center">
//           <button
//             onClick={() => navigate("/ownerdashboard")}
//             className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.03] transition-all duration-300"
//           >
//             🧑‍💼 Open Owner Panel
//           </button>

//           <button
//             onClick={() => navigate("/secretorydashboard")}
//             className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md hover:from-emerald-700 hover:to-green-800 transform hover:scale-[1.03] transition-all duration-300"
//           >
//             🏢 Open Secretory Panel
//           </button>
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={() => {
//               localStorage.clear();
//               navigate("/login");
//             }}
//             className="text-sm font-medium text-gray-600 hover:text-red-500 transition"
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes wave {
//           0% { transform: rotate(0deg); }
//           15% { transform: rotate(14deg); }
//           30% { transform: rotate(-8deg); }
//           40% { transform: rotate(14deg); }
//           50% { transform: rotate(-4deg); }
//           60% { transform: rotate(10deg); }
//           70%, 100% { transform: rotate(0deg); }
//         }
//         .animate-wave {
//           display: inline-block;
//           animation: wave 2s infinite;
//           transform-origin: 70% 70%;
//         }
//       `}</style>
//     </div>
//   );
// }


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaBookOpen, FaSignOutAlt, FaEnvelope } from "react-icons/fa";

// export default function RoleSelectionPage() {
//   const navigate = useNavigate();
//   const email = localStorage.getItem("email");

//   const handleOwner = () => navigate("/owner-dashboard");
//   const handleSecretary = () => navigate("/secretary-dashboard");
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="role-page">
//       <div className="role-card">
//         <h1 className="role-title">Welcome Back</h1>
//         <div className="role-email">
//           <FaEnvelope className="icon-email" /> {email}
//         </div>
//         <p className="role-subtitle">
//           Select your role to continue to the appropriate dashboard.
//         </p>

//         <div className="role-grid">
//           {/* Owner Card */}
//           <div onClick={handleOwner} className="role-box owner-box">
//             <FaUser className="role-icon" />
//             <h2>Owner Dashboard</h2>
//             <p>Manage properties, requests, and documentation.</p>
//           </div>

//           {/* Secretary Card */}
//           <div onClick={handleSecretary} className="role-box secretary-box">
//             <FaBookOpen className="role-icon" />
//             <h2>Secretary Dashboard</h2>
//             <p>Oversee society operations and approvals.</p>
//           </div>
//         </div>

//         <div className="logout-section">
//           <button onClick={handleLogout} className="logout-btn">
//             <FaSignOutAlt /> Logout
//           </button>
//         </div>
//       </div>

//       {/* CSS styles */}
//       <style>{`
//         /* Page background */
//         .role-page {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(135deg, #eef2f3, #cfd9df);
//           padding: 20px;
//           font-family: "Segoe UI", sans-serif;
//         }

//         /* Main card */
//         .role-card {
//           background: #fff;
//           border-radius: 20px;
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
//           border: 1px solid #e5e7eb;
//           max-width: 800px;
//           width: 100%;
//           padding: 40px 50px;
//           text-align: center;
//           transition: all 0.3s ease;
//         }

//         .role-card:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
//         }

//         /* Title */
//         .role-title {
//           font-size: 36px;
//           color: #333;
//           font-weight: 600;
//           margin-bottom: 10px;
//         }

//         /* Email */
//         .role-email {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           font-size: 14px;
//           color: #6b7280;
//           margin-bottom: 20px;
//         }

//         .icon-email {
//           color: #9ca3af;
//         }

//         /* Subtitle */
//         .role-subtitle {
//           color: #555;
//           font-size: 16px;
//           margin-bottom: 40px;
//         }

//         /* Grid container */
//         .role-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 25px;
//           margin-bottom: 40px;
//         }

//         @media (min-width: 768px) {
//           .role-grid {
//             grid-template-columns: 1fr 1fr;
//           }
//         }

//         /* Individual role boxes */
//         .role-box {
//           background: #f9fafb;
//           border-radius: 12px;
//           border: 1px solid #e5e7eb;
//           padding: 25px 15px;
//           box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
//           transition: all 0.3s ease;
//           cursor: pointer;
//         }

//         .role-box:hover {
//           transform: scale(1.03);
//           box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
//         }

//         .role-box h2 {
//           font-size: 18px;
//           color: #333;
//           margin-bottom: 8px;
//           font-weight: 600;
//         }

//         .role-box p {
//           font-size: 14px;
//           color: #555;
//         }

//         .role-icon {
//           font-size: 28px;
//           margin-bottom: 10px;
//         }

//         .owner-box {
//           color: #4338ca;
//           border-color: #c7d2fe;
//         }

//         .owner-box:hover {
//           background: #eef2ff;
//         }

//         .secretary-box {
//           color: #047857;
//           border-color: #a7f3d0;
//         }

//         .secretary-box:hover {
//           background: #ecfdf5;
//         }

//         /* Logout section */
//         .logout-section {
//           text-align: center;
//         }

//         .logout-btn {
//           background: #e5e7eb;
//           border: none;
//           border-radius: 25px;
//           padding: 10px 25px;
//           color: #374151;
//           font-weight: 500;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .logout-btn:hover {
//           background: #d1d5db;
//         }
//       `}</style>
//     </div>
//   );
// }



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
