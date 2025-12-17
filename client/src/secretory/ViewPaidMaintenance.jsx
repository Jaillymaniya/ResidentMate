// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function PaidMaintenanceList() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     fetchPaidMaintenance();
//   }, []);

//   const fetchPaidMaintenance = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/paid-maintenance");
//       setPayments(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Paid Maintenance List</h2>
//       <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Owner Name</th>
//             <th>Email</th>
//             <th>Contact</th>
//             <th>Maintenance Period</th>
//             <th>Amount Paid</th>
//             <th>Transaction ID</th>
//             <th>Payment Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.length === 0 ? (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center" }}>No payments found</td>
//             </tr>
//           ) : (
//             payments.map((p, index) => (
//               <tr key={index}>
//                 <td>{p.ownerName}</td>
//                 <td>{p.email}</td>
//                 <td>{p.contact}</td>
//                 <td>{p.maintenancePeriod}</td>
//                 <td>₹{p.amount}</td>
//                 <td>{p.transactionId}</td>
//                 <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaidMaintenanceList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaidMaintenance();
  }, []);

  const fetchPaidMaintenance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/paid-maintenance");
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading payments...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", color: "#003366", marginBottom: "20px" }}>Paid Maintenance List</h2>

      {payments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No payments found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
            <thead>
              <tr style={{ backgroundColor: "#e6e6e6", textAlign: "center" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Owner Name</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Contact</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Maintenance Period</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Amount Paid</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Transaction ID</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Payment Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, index) => (
                <tr
                  key={index}
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    cursor: "default",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5faff")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff")}
                >
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{p.ownerName}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{p.email}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{p.contact}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{p.maintenancePeriod}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>₹{p.amount}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{p.transactionId}</td>
                  <td style={{ padding: "20px", border: "1px solid #ccc" }}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
