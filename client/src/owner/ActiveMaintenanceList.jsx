
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ActiveMaintenanceList = () => {
//   const [maintenance, setMaintenance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [payments, setPayments] = useState([]);

//   // Read logged-in user
//   const ownerEmail = localStorage.getItem("email");
  

//   useEffect(() => {
//     fetchActiveMaintenance();
//   }, []);

//   const isPaid = (maintenanceId) => {
//   return payments.some((p) => p.MaintenanceID === maintenanceId);
// };


//   useEffect(() => {
//   if (!ownerEmail) return;

//   const fetchPayments = async () => {
//     try {
//       const assignRes = await axios.get(`http://localhost:5000/api/assignid/${ownerEmail}`);
//       const assignId = assignRes.data.assignId;

//       const payRes = await axios.get(`http://localhost:5000/api/payments/${assignId}`);
//       setPayments(payRes.data);
//     } catch (err) {
//       console.error("Error fetching payments", err);
//     }
//   };

//   fetchPayments();
// }, [ownerEmail]);

//   // Load active maintenance list
//   const fetchActiveMaintenance = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/maintenance/active");

//       // Ensure maintenance is always an array
//       if (Array.isArray(res.data)) {
//         setMaintenance(res.data);
//       } else {
//         setMaintenance([]); // Prevent map error
//       }
//     } catch (err) {
//       console.error("Error loading maintenance", err);
//       setMaintenance([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Payment Handler
//   const handlePayment = async (item) => {
//     try {
//       if (!ownerEmail) {
//         alert("User email not found in localStorage");
//         return;
//       }

//       // 1️⃣ Fetch AssignID for owner
//       const assignRes = await axios.get(
//         `http://localhost:5000/api/assignid/${ownerEmail}`
//       );

//       const assignId = assignRes.data.assignId;

//       if (!assignId) {
//         alert("AssignID not found for user");
//         return;
//       }

//       // 2️⃣ Create order
//       const orderRes = await axios.post(
//         "http://localhost:5000/api/payment/create-order",
//         {
//           amount: item.Amount,
//           assignId,
//           maintenanceId: item._id,
//         }
//       );

//       const { key, orderId, amount } = orderRes.data;

//       // 3️⃣ Open Razorpay Checkout
//       const options = {
//         key,
//         amount,
//         currency: "INR",
//         order_id: orderId,
//         name: "Society Maintenance Payment",
//         description: "Monthly Maintenance",

//         handler: async function (response) {
//           await axios.post(
//             "http://localhost:5000/api/payment/verify",
//             {
//               ...response,
//               assignId,
//               maintenanceId: item._id,
//             }
//           );

//           alert("Payment Successful!");
//           fetchActiveMaintenance(); // Refresh list
//         },
//       };

//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (err) {
//       console.error("Payment failed", err);
//       alert("Payment failed! Check console.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Active Maintenance</h2>

//       {maintenance.length === 0 ? (
//         <p>No active maintenance found</p>
//       ) : (
//         <table border="1" cellPadding="10" width="100%">
//           <thead>
//             <tr>
//               <th>From</th>
//               <th>To</th>
//               <th>Amount</th>
//               <th>Due Date</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {maintenance.map((m) => (
//               <tr key={m._id}>
//                 <td>{new Date(m.FromDate).toDateString()}</td>
//                 <td>{new Date(m.ToDate).toDateString()}</td>
//                 <td>₹{m.Amount}</td>
//                 <td>{new Date(m.DueDate).toDateString()}</td>

//                 {/* <td>
//                   <button
//                     onClick={() => handlePayment(m)}
//                     style={{
//                       padding: "6px 14px",
//                       background: "green",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Pay Now
//                   </button>
//                 </td> */}

//                 <td>
//                   <button
//                     onClick={() => handlePayment(m)}
//                     disabled={isPaid(m._id)} // DISABLE if already paid
//                     style={{
//                       padding: "6px 14px",
//                       background: isPaid(m._id) ? "gray" : "green",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: isPaid(m._id) ? "not-allowed" : "pointer",
//                     }}
//                   >
//                     {isPaid(m._id) ? "Paid" : "Pay Now"}
//                   </button>
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ActiveMaintenanceList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ActiveMaintenanceList = () => {
//   const [maintenance, setMaintenance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [payments, setPayments] = useState([]);

//   // Read logged-in user
//   const ownerEmail = localStorage.getItem("email");
  

//   useEffect(() => {
//     fetchActiveMaintenance();
//   }, []);

//   const isPaid = (maintenanceId) => {
//     return payments.some((p) => p.MaintenanceID === maintenanceId);
//   };


//   useEffect(() => {
//     if (!ownerEmail) return;

//     const fetchPayments = async () => {
//       try {
//         const assignRes = await axios.get(`http://localhost:5000/api/assignid/${ownerEmail}`);
//         const assignId = assignRes.data.assignId;

//         const payRes = await axios.get(`http://localhost:5000/api/payments/${assignId}`);
//         setPayments(payRes.data);
//       } catch (err) {
//         console.error("Error fetching payments", err);
//       }
//     };

//     fetchPayments();
//   }, [ownerEmail]);

//   // Load active maintenance list
//   const fetchActiveMaintenance = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/maintenance/active");

//       // Ensure maintenance is always an array
//       if (Array.isArray(res.data)) {
//         setMaintenance(res.data);
//       } else {
//         setMaintenance([]); // Prevent map error
//       }
//     } catch (err) {
//       console.error("Error loading maintenance", err);
//       setMaintenance([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Payment Handler
//   const handlePayment = async (item) => {
//     try {
//       if (!ownerEmail) {
//         alert("User email not found in localStorage");
//         return;
//       }

//       // 1️⃣ Fetch AssignID for owner
//       const assignRes = await axios.get(
//         `http://localhost:5000/api/assignid/${ownerEmail}`
//       );

//       const assignId = assignRes.data.assignId;

//       if (!assignId) {
//         alert("AssignID not found for user");
//         return;
//       }

//       // 2️⃣ Create order
//       const orderRes = await axios.post(
//         "http://localhost:5000/api/payment/create-order",
//         {
//           amount: item.Amount,
//           assignId,
//           maintenanceId: item._id,
//         }
//       );

//       const { key, orderId, amount } = orderRes.data;

//       // 3️⃣ Open Razorpay Checkout
//       const options = {
//         key,
//         amount,
//         currency: "INR",
//         order_id: orderId,
//         name: "Society Maintenance Payment",
//         description: "Monthly Maintenance",

//         handler: async function (response) {
//           await axios.post(
//             "http://localhost:5000/api/payment/verify",
//             {
//               ...response,
//               assignId,
//               maintenanceId: item._id,
//             }
//           );

//           alert("Payment Successful!");

//           // Fetch receipt and download
//           const receiptRes = await axios.get(
//             `http://localhost:5000/api/receipt/${response.razorpay_payment_id}`,
//             { responseType: "blob" }
//           );

//           const url = window.URL.createObjectURL(new Blob([receiptRes.data]));
//           const link = document.createElement("a");
//           link.href = url;
//           link.setAttribute("download", `receipt_${item._id}.pdf`);
//           document.body.appendChild(link);
//           link.click();
//           link.remove();

//           fetchActiveMaintenance(); // Refresh list
//         },
//       };

//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (err) {
//       console.error("Payment failed", err);
//       alert("Payment failed! Check console.");
//     }
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Loading maintenance data...</p>
//     </div>
//   );

//   return (
//     <div className="maintenance-container">
//       <div className="maintenance-header">
//         {/* <h2 className="maintenance-title">Active Maintenance</h2> */}
//         <p className="maintenance-subtitle">Manage your maintenance payments</p>
//       </div>

//       {maintenance.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-icon">📋</div>
//           <h3>No Active Maintenance</h3>
//           <p>There are no maintenance records to display at the moment.</p>
//         </div>
//       ) : (
//         <div className="maintenance-table-container">
//           <table className="maintenance-table">
//             <thead>
//               <tr>
//                 <th>Period</th>
//                 <th>Amount</th>
//                 <th>Due Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {maintenance.map((m) => (
//                 <tr key={m._id} className="maintenance-row">
//                   <td>
//                     <div className="date-range">
//                       <span className="date-from">{new Date(m.FromDate).toLocaleDateString()}</span>
//                       <span className="date-separator">→</span>
//                       <span className="date-to">{new Date(m.ToDate).toLocaleDateString()}</span>
//                     </div>
//                   </td>
//                   <td className="amount-cell">
//                     <span className="amount">₹{m.Amount}</span>
//                   </td>
//                   <td>
//                     <div className="due-date">
//                       {new Date(m.DueDate).toLocaleDateString()}
//                       {new Date(m.DueDate) < new Date() && (
//                         <span className="overdue-badge">Overdue</span>
//                       )}
//                     </div>
//                   </td>
//                   <td>
//                     <div className={`status-badge ${isPaid(m._id) ? 'status-paid' : 'status-pending'}`}>
//                       {isPaid(m._id) ? 'Paid' : 'Pending'}
//                     </div>
//                   </td>
//                   <td>
//   {isPaid(m._id) ? (
//     <div style={{ display: "flex", gap: "10px" }}>

//       {/* PAID badge - NOT a button */}
//       <div
//         className="pay-button paid"
//         style={{
//           pointerEvents: "none",
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//         }}
//       >
//         <span className="button-icon">✓</span> Paid
//       </div>

//       {/* Download Receipt BUTTON */}
//       <button
//         className="pay-button unpaid"
//         onClick={async () => {
//           try {
//             const res = await axios.get(
//               `http://localhost:5000/api/receipt/${m._id}`,
//               { responseType: "blob" }
//             );
//             const url = window.URL.createObjectURL(new Blob([res.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `receipt_${m._id}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//           } catch (err) {
//             console.error("Failed to download receipt", err);
//             alert("Failed to download receipt");
//           }
//         }}
//       >
//         📄 Download Receipt
//       </button>
//     </div>
//   ) : (
//     <button
//       onClick={() => handlePayment(m)}
//       disabled={isPaid(m._id)}
//       className={`pay-button unpaid`}
//     >
//       <span className="button-icon">💳</span> Pay Now
//     </button>
//   )}
// </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <style>{`
//         .maintenance-container {
//           padding: 24px;
//           max-width: 1200px;
//           margin: 0 auto;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         .maintenance-header {
//           margin-bottom: 32px;
//           text-align: center;
//         }

//         .maintenance-title {
//           font-size: 28px;
//           font-weight: 700;
//           color: #1a202c;
//           margin: 0 0 8px 0;
//         }

//         .maintenance-subtitle {
//           font-size: 16px;
//           color: #718096;
//           margin: 0;
//         }

//         .loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px 20px;
//         }

//         .loading-spinner {
//           width: 40px;
//           height: 40px;
//           border: 4px solid #e2e8f0;
//           border-left: 4px solid #4299e1;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 16px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .empty-state {
//           text-align: center;
//           padding: 60px 20px;
//           background: #f7fafc;
//           border-radius: 12px;
//           border: 2px dashed #cbd5e0;
//         }

//         .empty-icon {
//           font-size: 48px;
//           margin-bottom: 16px;
//         }

//         .empty-state h3 {
//           font-size: 20px;
//           color: #2d3748;
//           margin: 0 0 8px 0;
//         }

//         .empty-state p {
//           color: #718096;
//           margin: 0;
//         }

//         .maintenance-table-container {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//         }

//         .maintenance-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .maintenance-table th {
//           background: #f7fafc;
//           padding: 16px 20px;
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 1px solid #e2e8f0;
//           font-size: 14px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .maintenance-table td {
//           padding: 20px;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .maintenance-row:hover {
//           background: #f7fafc;
//         }

//         .maintenance-row:last-child td {
//           border-bottom: none;
//         }

//         .date-range {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//         }

//         .date-separator {
//           color: #a0aec0;
//         }

//         .date-from,
//         .date-to {
//           color: #4a5568;
//         }

//         .amount-cell {
//           text-align: center;
//         }

//         .amount {
//           font-size: 18px;
//           font-weight: 700;
//           color: #2d3748;
//         }

//         .due-date {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: #4a5568;
//         }

//         .overdue-badge {
//           background: #fed7d7;
//           color: #c53030;
//           padding: 4px 8px;
//           border-radius: 6px;
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .status-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//           text-align: center;
//           display: inline-block;
//         }

//         .status-paid {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .status-pending {
//           background: #feebc8;
//           color: #744210;
//         }

//         .pay-button {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           font-size: 14px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .pay-button.unpaid {
//           background: #4299e1;
//           color: white;
//         }

//         .pay-button.unpaid:hover {
//           background: #3182ce;
//           transform: translateY(-1px);
//           box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
//         }

//         .pay-button.paid {
//           background: #e2e8f0;
//           color: #718096;
//           cursor: not-allowed;
//         }

//         .button-icon {
//           font-size: 16px;
//         }

//         @media (max-width: 768px) {
//           .maintenance-container {
//             padding: 16px;
//           }

//           .maintenance-table-container {
//             overflow-x: auto;
//           }

//           .maintenance-table {
//             min-width: 600px;
//           }

//           .date-range {
//             flex-direction: column;
//             gap: 4px;
//           }

//           .date-separator {
//             display: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ActiveMaintenanceList;


import React, { useEffect, useState } from "react";
import axios from "axios";

const ActiveMaintenanceList = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  const ownerEmail = localStorage.getItem("email");

  // Helper → FIND payment record by maintenanceId
  const getPaymentForMaintenance = (maintenanceId) => {
    return payments.find((p) => p.MaintenanceID === maintenanceId);
  };

  useEffect(() => {
    fetchActiveMaintenance();
  }, []);

  const isPaid = (maintenanceId) => {
    return payments.some((p) => p.MaintenanceID === maintenanceId);
  };

  useEffect(() => {
    if (!ownerEmail) return;

    const fetchPayments = async () => {
      try {
        const assignRes = await axios.get(
          `http://localhost:5000/api/assignid/${ownerEmail}`
        );
        const assignId = assignRes.data.assignId;

        const payRes = await axios.get(
          `http://localhost:5000/api/payments/${assignId}`
        );

        setPayments(payRes.data);
      } catch (err) {
        console.error("Error fetching payments", err);
      }
    };

    fetchPayments();
  }, [ownerEmail]);

  const fetchActiveMaintenance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/maintenance/active");
      setMaintenance(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading maintenance", err);
      setMaintenance([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Payment Handler
  const handlePayment = async (item) => {
    try {
      if (!ownerEmail) {
        alert("User email not found");
        return;
      }

      const assignRes = await axios.get(
        `http://localhost:5000/api/assignid/${ownerEmail}`
      );
      const assignId = assignRes.data.assignId;

      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: item.Amount,
          assignId,
          maintenanceId: item._id,
        }
      );

      const { key, orderId, amount } = orderRes.data;

      const options = {
        key,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "Society Maintenance Payment",
        description: "Monthly Maintenance",

        handler: async function (response) {
          await axios.post("http://localhost:5000/api/payment/verify", {
            ...response,
            assignId,
            maintenanceId: item._id,
          });

          alert("Payment Successful!");

          // Fetch latest payments to get the PaymentID
          const payRes = await axios.get(
            `http://localhost:5000/api/payments/${assignId}`
          );
          setPayments(payRes.data);

          const payment = payRes.data.find(
            (p) => p.MaintenanceID === item._id
          );

          if (!payment) {
            alert("Receipt not available yet!");
            return;
          }

          // Download receipt using Payment ID
          const receiptRes = await axios.get(
            `http://localhost:5000/api/receipt/${payment._id}`,
            { responseType: "blob" }
          );

          const url = window.URL.createObjectURL(new Blob([receiptRes.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `receipt_${payment._id}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();

          fetchActiveMaintenance();
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading maintenance data...</p>
      </div>
    );

  return (
    <div className="maintenance-container">
      <div className="maintenance-header">
        <p className="maintenance-subtitle">
          Manage your maintenance payments
        </p>
      </div>

      {maintenance.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Active Maintenance</h3>
        </div>
      ) : (
        <div className="maintenance-table-container">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {maintenance.map((m) => {
                const payment = getPaymentForMaintenance(m._id);

                return (
                  <tr key={m._id} className="maintenance-row">
                    <td>
                      <div className="date-range">
                        <span>{new Date(m.FromDate).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(m.ToDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td>₹{m.Amount}</td>

                    <td>
                      <div className="due-date">
                        {new Date(m.DueDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td>
                      <div
                        className={`status-badge ${
                          isPaid(m._id) ? "status-paid" : "status-pending"
                        }`}
                      >
                        {isPaid(m._id) ? "Paid" : "Pending"}
                      </div>
                    </td>

                    <td>
                      {isPaid(m._id) ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                          {/* Paid badge */}
                          <div className="pay-button paid">
                            ✓ Paid
                          </div>

                          {/* Download Receipt */}
                          <button
                            className="pay-button unpaid"
                            onClick={async () => {
                              try {
                                if (!payment) {
                                  alert("Payment record not found");
                                  return;
                                }

                                const res = await axios.get(
                                  `http://localhost:5000/api/receipt/${payment._id}`,
                                  { responseType: "blob" }
                                );

                                const url = window.URL.createObjectURL(
                                  new Blob([res.data])
                                );
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `receipt_${payment._id}.pdf`
                                );
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                              } catch (err) {
                                console.error(
                                  "Failed to download receipt",
                                  err
                                );
                                alert("Receipt download failed");
                              }
                            }}
                          >
                            📄 Download Receipt
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePayment(m)}
                          className="pay-button unpaid"
                        >
                          💳 Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Styles kept same */}
      <style>{`
        .maintenance-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .maintenance-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .maintenance-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .maintenance-subtitle {
          font-size: 16px;
          color: #718096;
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-left: 4px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f7fafc;
          border-radius: 12px;
          border: 2px dashed #cbd5e0;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #718096;
          margin: 0;
        }

        .maintenance-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .maintenance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .maintenance-table th {
          background: #f7fafc;
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .maintenance-table td {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .maintenance-row:hover {
          background: #f7fafc;
        }

        .maintenance-row:last-child td {
          border-bottom: none;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .date-separator {
          color: #a0aec0;
        }

        .date-from,
        .date-to {
          color: #4a5568;
        }

        .amount-cell {
          text-align: center;
        }

        .amount {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
        }

        .due-date {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4a5568;
        }

        .overdue-badge {
          background: #fed7d7;
          color: #c53030;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          display: inline-block;
        }

        .status-paid {
          background: #c6f6d5;
          color: #276749;
        }

        .status-pending {
          background: #feebc8;
          color: #744210;
        }

        .pay-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pay-button.unpaid {
          background: #4299e1;
          color: white;
        }

        .pay-button.unpaid:hover {
          background: #3182ce;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
        }

        .pay-button.paid {
          background: #e2e8f0;
          color: #718096;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .maintenance-container {
            padding: 16px;
          }

          .maintenance-table-container {
            overflow-x: auto;
          }

          .maintenance-table {
            min-width: 600px;
          }

          .date-range {
            flex-direction: column;
            gap: 4px;
          }

          .date-separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ActiveMaintenanceList;
