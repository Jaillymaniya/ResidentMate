import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import Payment from "../models/Payment.js";

const router = express.Router();


// router.get("/receipt/:paymentId", async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.paymentId)
//       .populate({
//         path: "AssignID",
//         model: "Tbl_AssignHome",
//         populate: { path: "UserID", model: "Tbl_Users" }
//       })
//       .populate("MaintenanceID");

//     if (!payment) return res.status(404).send("Payment not found");

//     const user = payment.AssignID?.UserID;
//     const maintenance = payment.MaintenanceID;

//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const filePath = `./receipts/receipt_${payment._id}.pdf`;

//     fs.mkdirSync("./receipts", { recursive: true });
//     doc.pipe(fs.createWriteStream(filePath));

//     // -----------------------------------------------------------
//     // HEADER (Light Blue) similar style to sample image
//     // -----------------------------------------------------------
//     doc.rect(0, 0, doc.page.width, 70).fill("#d9e7ff");

//     doc.fillColor("#0055aa")
//       .fontSize(24)
//       .text("Society Monthly Maintenance Receipt", {
//         align: "center",
//         valign: "center"
//       });

//     doc.moveDown(2);

//     // -----------------------------------------------------------
//     // SOCIETY INFORMATION
//     // -----------------------------------------------------------
//     doc.fillColor("#000").fontSize(14).text("SOCIETY DETAILS");
//     doc.moveDown(0.5);

//     doc.fontSize(11);
//     doc.text("Green Valley Residential Society", 50);
//     doc.text("Address Line 1, Your City", 50);
//     doc.text("Email: society@example.com", 50);
//     doc.text("Phone: +91 98765 43210", 50);

//     doc.moveDown(2);

//     // -----------------------------------------------------------
//     // CUSTOMER & RECEIPT DETAILS (Two Column Layout)
//     // -----------------------------------------------------------
//     const y = doc.y;

//     doc.fontSize(14).text("OWNER DETAILS", 50, y);
//     doc.fontSize(11)
//       .text(`Name: ${user?.UserName || "N/A"}`, 50)
//       .text(`Email: ${user?.UserEmailID || "N/A"}`, 50)
//       .text(`Contact: ${user?.UserCNo || "N/A"}`, 50);

//     doc.fontSize(14).text("RECEIPT DETAILS", 330, y);
//     doc.fontSize(11)
//       .text(`Receipt ID: ${payment._id}`, 330)
//       .text(`Transaction ID: ${payment.TransactionID}`, 330)
//       .text(
//         `Payment Date: ${payment.PaymentDate?.toLocaleDateString()}`,
//         330
//       );

//     doc.moveDown(2);

//     // -----------------------------------------------------------
//     // MAINTENANCE PERIOD BOX
//     // -----------------------------------------------------------
//     doc.rect(40, doc.y, 520, 70).stroke("#999");

//     const mpY = doc.y + 10;

//     doc.fontSize(13)
//       .fillColor("#333")
//       .text("Maintenance Period", 60, mpY);

//     doc.fontSize(11)
//       .fillColor("#000")
//       .text(
//         `${new Date(maintenance.FromDate).toLocaleDateString()}  to  ${new Date(
//           maintenance.ToDate
//         ).toLocaleDateString()}`,
//         60,
//         doc.y
//       );

//     doc.moveDown(4);

//     // -----------------------------------------------------------
//     // SUMMARY TABLE (Like sample image bottom section)
//     // -----------------------------------------------------------
//     const tableY = doc.y;

//     doc.fontSize(12).fillColor("#0055aa").text("AMOUNT SUMMARY", 50);
//     doc.moveDown(0.5);

//     // Draw table lines
//     doc.strokeColor("#cfcfcf")
//       .lineWidth(1)
//       .moveTo(40, doc.y)
//       .lineTo(560, doc.y)
//       .stroke();

//     doc.moveDown(1);

//     doc.fillColor("#000").fontSize(12);
//     const amount = parseFloat(maintenance.Amount);
//     const tax = amount * 0.18;
//     const total = amount + tax;

//     doc.text(`Subtotal: ₹${amount}`, 400);
//     doc.text(`GST (18%): ₹${tax.toFixed(2)}`, 400);
//     doc.moveDown(1);
//     doc.text(`Total Amount: ₹${total.toFixed(2)}`, 400);

//     doc.moveDown(2);

//     // -----------------------------------------------------------
//     // NOTES
//     // -----------------------------------------------------------
//     doc.fontSize(12).text("NOTES:");
//     doc.rect(40, doc.y + 5, 520, 60).stroke("#999");
//     doc.moveDown(5);

//     // -----------------------------------------------------------
//     // SIGNATURES
//     // -----------------------------------------------------------
//     doc.moveDown(2);

//     const sigY = doc.y + 20;

//     doc.text("Accountant Signature", 50, sigY);
//     doc.text("Owner Signature", 350, sigY);

//     doc.end();

//     payment.ReceiptPath = filePath;
//     await payment.save();

//     res.download(filePath, `receipt_${payment._id}.pdf`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating receipt");
//   }
// });


router.get("/receipt/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate({
        path: "AssignID",
        model: "Tbl_AssignHome",
        populate: { path: "UserID", model: "Tbl_Users" }
      })
      .populate("MaintenanceID");

    if (!payment) return res.status(404).send("Payment not found");

    const user = payment.AssignID?.UserID;
    const maintenance = payment.MaintenanceID;

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filePath = `./receipts/receipt_${payment._id}.pdf`;

    fs.mkdirSync("./receipts", { recursive: true });
    doc.pipe(fs.createWriteStream(filePath));

    // ----------------------------
    // HEADER
    // ----------------------------
    doc.rect(0, 0, doc.page.width, 90).fill("#f2f6fc"); // subtle blue
    // Optional logo
    // doc.image("./logo.png", 50, 15, { width: 50 });

    doc.fillColor("#003366")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("ResidentMate", 120, 25);
      

    doc.font("Helvetica")
      .fontSize(12)
      .fillColor("#555")
      .text("Maintenance Receipt", 120, 50);

    // ----------------------------
    // SOCIETY INFO BOX
    // ----------------------------
    doc.roundedRect(40, 110, 520, 60, 5).stroke("#ccc");
    doc.font("Helvetica").fontSize(11).fillColor("#000");
    doc.text("Address: Subhas park, Surat", 50, 120);
    doc.text("Email: society@example.com", 50, 135);
    doc.text("Phone: +91 98765 43210", 50, 150);

    // ----------------------------
    // OWNER & RECEIPT DETAILS
    // ----------------------------
    const colY = 180;
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#003366");
    doc.text("OWNER DETAILS", 50, colY);
    doc.text("RECEIPT DETAILS", 330, colY);

    doc.font("Helvetica").fontSize(11).fillColor("#000");
    doc.text(`Name: ${user?.UserName || "N/A"}`, 50, colY + 20);
    doc.text(`Email: ${user?.UserEmailID || "N/A"}`, 50, colY + 35);
    doc.text(`Contact: ${user?.UserCNo || "N/A"}`, 50, colY + 50);

    doc.text(`Receipt ID: ${payment._id}`, 330, colY + 20);
    doc.text(`Transaction ID: ${payment.TransactionID}`, 330, colY + 35);
    doc.text(`Payment Date: ${payment.PaymentDate?.toLocaleDateString()}`, 330, colY + 50);

    // ----------------------------
    // MAINTENANCE PERIOD BOX
    // ----------------------------
    const mpY = 260;
    doc.roundedRect(40, mpY, 520, 50, 5).fillAndStroke("#e8f0fe", "#ccc");
    doc.fillColor("#003366").font("Helvetica-Bold").fontSize(12)
      .text("Maintenance Period", 50, mpY + 15);
    doc.fillColor("#000").font("Helvetica").fontSize(11)
      .text(`${new Date(maintenance.FromDate).toLocaleDateString()} to ${new Date(maintenance.ToDate).toLocaleDateString()}`, 50, mpY + 30);

    // ----------------------------
    // AMOUNT SUMMARY
    // ----------------------------
    const summaryY = mpY + 80;
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#003366").text("AMOUNT SUMMARY", 50, summaryY);
    doc.moveTo(40, summaryY + 15).lineTo(560, summaryY + 15).stroke("#ccc");

    const amount = parseFloat(maintenance.Amount || 0);
    // const tax = amount * 0.18;
    const total = amount ;

    doc.font("Helvetica").fontSize(11).fillColor("#000");
    doc.text(`Subtotal: ₹${amount.toFixed(2)}`, 400, summaryY + 30);
    // doc.text(`GST (18%): ₹${tax.toFixed(2)}`, 400, summaryY + 45);
    doc.font("Helvetica-Bold").text(`Total Amount: ₹${total.toFixed(2)}`, 400, summaryY + 60);

    // ----------------------------
    // NOTES
    // ----------------------------
    const notesY = summaryY + 100;
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#003366").text("NOTES:", 50, notesY);
    doc.roundedRect(40, notesY + 15, 520, 60, 5).stroke("#ccc");
    doc.font("Helvetica").fontSize(11).fillColor("#000").text("Please keep this receipt for future reference.", 50, notesY + 25);

    // ----------------------------
    // SIGNATURES
    // ----------------------------
    const sigY = notesY + 90;
    doc.text("Secretary Signature", 50, sigY);
    doc.text("Owner Signature", 400, sigY);

    doc.end();

    payment.ReceiptPath = filePath;
    await payment.save();

    res.download(filePath, `receipt_${payment._id}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating receipt");
  }
});


// GET all paid maintenance
router.get("/paid-maintenance", async (req, res) => {
  try {
    const payments = await Payment.find({ PaymentStatus: "Paid" }) // or whatever field indicates payment done
      .populate({
        path: "AssignID",
        model: "Tbl_AssignHome",
        populate: { path: "UserID", model: "Tbl_Users" }
      })
      .populate("MaintenanceID")
      .sort({ PaymentDate: -1 });

    // Format data for frontend
    const result = payments.map(p => ({
      ownerName: p.AssignID?.UserID?.UserName || "N/A",
      email: p.AssignID?.UserID?.UserEmailID || "N/A",
      contact: p.AssignID?.UserID?.UserCNo || "N/A",
      paymentDate: p.PaymentDate,
      maintenancePeriod: p.MaintenanceID
        ? `${new Date(p.MaintenanceID.FromDate).toLocaleDateString()} to ${new Date(p.MaintenanceID.ToDate).toLocaleDateString()}`
        : "N/A",
      amount: p.MaintenanceID?.Amount || 0,
      transactionId: p.TransactionID,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching paid maintenance");
  }
});



export default router;
