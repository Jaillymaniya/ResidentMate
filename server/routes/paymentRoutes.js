import express from "express";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import { razorpay } from "../utils/razorpay.js";
import User from "../models/User.js"; // Tbl_Users
import AssignHome from "../models/AssignHome.js"; // Tbl_AssignHome
import PDFDocument from "pdfkit";

const router = express.Router();

// router.post("/payment/create-order", async (req, res) => {
//   try {
//     const { amount, assignId, maintenanceId } = req.body;

//     const options = {
//       amount: amount * 100, // Razorpay works in paise
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       orderId: order.id,
//       amount: options.amount,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Order creation failed" });
//   }
// });

router.post("/payment/create-order", async (req, res) => {
  try {
    const { amount, assignId, maintenanceId } = req.body;

    if (!assignId || !maintenanceId) {
      return res.status(400).json({ msg: "Missing assignId or maintenanceId" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: options.amount,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Order creation failed" });
  }
});


// router.post("/payment/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//       assignId,
//       maintenanceId,
//     } = req.body;

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (razorpay_signature !== expectedSign) {
//       return res.status(400).json({ msg: "Invalid signature" });
//     }

//     // Save in Payment Table
//     await Payment.create({
//       AssignID: assignId,
//       MaintenanceID: maintenanceId,
//       TransactionID: razorpay_payment_id,
//       PaymentStatus: "Paid",
//       PaymentDate: new Date(),
//     });

//     res.json({ success: true, msg: "Payment verified successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Payment verification failed" });
//   }
// });


router.post("/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      assignId,
      maintenanceId
    } = req.body;

    if (!razorpay_signature) {
      return res.status(400).json({ msg: "Signature missing" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    await Payment.create({
      AssignID: assignId,
      MaintenanceID: maintenanceId,
      TransactionID: razorpay_payment_id,
      PaymentStatus: "Paid",
      PaymentDate: new Date()
    });

    res.json({ success: true, msg: "Payment verified" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Payment verification failed" });
  }
});

// router.post("/payment/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//       assignId,
//       maintenanceId
//     } = req.body;

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign)
//       .digest("hex");

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ msg: "Invalid signature" });
//     }

//     // Fetch owner & home details
//     const assign = await AssignHome.findById(assignId).populate("UserID");
//     const user = assign.UserID;

//     // 📄 Create Bill PDF
//     const billFolder = "./uploads/bills";
//     if (!fs.existsSync(billFolder)) fs.mkdirSync(billFolder, { recursive: true });

//     const fileName = `bill_${Date.now()}.pdf`;
//     const filePath = path.join(billFolder, fileName);

//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(filePath));

//     // 📄 Bill Content
//     doc.fontSize(20).text("Maintenance Payment Receipt", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(14).text(`Owner Name: ${user.UserName}`);
//     doc.text(`Email: ${user.UserEmailID}`);
//     doc.text(`Home No: ${assign.HomeNo}`);
//     doc.text(`Payment ID: ${razorpay_payment_id}`);
//     doc.text(`Maintenance Month: July 2025`); // You can calculate dynamic month
//     doc.text(`Payment Date: ${new Date().toLocaleString()}`);

//     doc.end();

//     // Save payment with bill path
//     await Payment.create({
//       AssignID: assignId,
//       MaintenanceID: maintenanceId,
//       TransactionID: razorpay_payment_id,
//       PaymentStatus: "Paid",
//       PaymentDate: new Date(),
//       BillFilePath: filePath
//     });

//     res.json({ success: true, msg: "Payment verified", bill: filePath });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Payment verification failed" });
//   }
// });


// router.get("/assignid/:email", async (req, res) => {
//   try {
//     const { email } = req.params;
//     console.log("Email received:", email);

//     const user = await User.findOne({ UserEmailID: { $regex: `^${email}$`, $options: "i" } });
//     console.log("User found:", user);

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const assign = await AssignHome.findOne({ UserID: user._id });
//     console.log("AssignHome found:", assign);

//     if (!assign) return res.status(404).json({ msg: "AssignHome record not found" });

//     res.json({ assignId: assign._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

router.get("/assignid/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({
      UserEmailID: { $regex: `^${email}$`, $options: "i" }
    });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    const assign = await AssignHome.findOne({ UserID: user._id });

    if (!assign)
      return res.status(404).json({ msg: "AssignHome not found" });

    res.json({ assignId: assign._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/payments/:assignId", async (req, res) => {
  try {
    const { assignId } = req.params;
    const payments = await Payment.find({ AssignID: assignId });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/payment/bill/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment || !payment.BillFilePath) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    res.download(payment.BillFilePath);
  } catch (err) {
    res.status(500).json({ msg: "Error downloading bill" });
  }
});


router.get("/bill/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment || !payment.ReceiptPath) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    const filePath = path.join(process.cwd(), payment.ReceiptPath);
    return res.download(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error downloading bill" });
  }
});



export default router;
