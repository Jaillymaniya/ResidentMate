// // src/components/PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }


import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If user is not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access
  return children;
}
