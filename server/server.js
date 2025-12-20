// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);

// import authRoutes from "./routes/auth.js";
// import  errorHandler from "./middleware/error.js";
// import  notFoundHandler from "./middleware/notFoundHandler.js";
// import homeRoutes from "./routes/home.js";
// import societyRoutes from "./routes/societyRoutes.js";
// import path from "path";
// import fs from "fs";
// import ownerRoutes from "./routes/ownerRoutes.js";
// import assignHomeRoutes from "./routes/assignHomeRoutes.js";
// import secretaryRoutes from "./routes/secretaryRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import changePasswordRoutes from "./routes/changePassword.js";
// import announcementRoutes from "./routes/announcementRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import complaintRoutes from "./routes/complaintRoutes.js";
// import hallRoutes from "./routes/hallRoute.js";
// import maintenanceRoutes from "./routes/maintenanceRoutes.js";
// import Payment from "./routes/paymentRoutes.js";
// import receiptRoutes from "./routes/receiptRoutes.js";

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uploadPath = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
// app.use("/uploads", express.static(uploadPath));

// // Routes
// app.use("/api/auth", authRoutes);

// app.use("/api/homes", homeRoutes);

// app.use("/api/societies", societyRoutes);

// app.use("/api", ownerRoutes);

// app.use("/api", assignHomeRoutes);

// app.use("/api", secretaryRoutes); 

// app.use("/api", profileRoutes);

// app.use("/api", changePasswordRoutes);

// app.use("/api/announcements", announcementRoutes);

// app.use("/api/appointments", appointmentRoutes);

// app.use("/api", complaintRoutes);

// app.use("/api/halls", hallRoutes);

// app.use("/api", maintenanceRoutes);

// app.use("/api", Payment);

// app.use("/api", receiptRoutes);

// // Error handler middleware
// app.use(errorHandler);

// // Not found URL Handler (if request not match default call notFoundHandler middleware)
// app.use(notFoundHandler);

// // Test route
// app.get("/", (req, res) => res.send("API running..."));

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ DB connection error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Keep server alive even for uncaught exceptions
// process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));
// process.on("unhandledRejection", (reason, promise) =>
//   console.error("Unhandled Rejection:", reason)
// );



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);

// import authRoutes from "./routes/auth.js";
// import  errorHandler from "./middleware/error.js";
// import  notFoundHandler from "./middleware/notFoundHandler.js";
// import homeRoutes from "./routes/home.js";
// import societyRoutes from "./routes/societyRoutes.js";
// import path from "path";
// import fs from "fs";
// import ownerRoutes from "./routes/ownerRoutes.js";
// import assignHomeRoutes from "./routes/assignHomeRoutes.js";
// import secretaryRoutes from "./routes/secretaryRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import changePasswordRoutes from "./routes/changePassword.js";
// import announcementRoutes from "./routes/announcementRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import complaintRoutes from "./routes/complaintRoutes.js";
// import hallRoutes from "./routes/hallRoute.js";
// import maintenanceRoutes from "./routes/maintenanceRoutes.js";

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uploadPath = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
// app.use("/uploads", express.static(uploadPath));

// // Routes
// app.use("/api/auth", authRoutes);

// app.use("/api/homes", homeRoutes);

// app.use("/api/societies", societyRoutes);

// app.use("/api", ownerRoutes);

// app.use("/api", assignHomeRoutes);

// app.use("/api", secretaryRoutes); 

// app.use("/api", profileRoutes);

// app.use("/api", changePasswordRoutes);

// app.use("/api/announcements", announcementRoutes);

// app.use("/api/appointments", appointmentRoutes);

// app.use("/api", complaintRoutes);

// app.use("/api/halls", hallRoutes);

// app.use("/api", maintenanceRoutes);

// // Error handler middleware
// app.use(errorHandler);

// // Not found URL Handler (if request not match default call notFoundHandler middleware)
// app.use(notFoundHandler);

// // Test route
// app.get("/", (req, res) => res.send("API running..."));

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ DB connection error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Keep server alive even for uncaught exceptions
// process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));
// process.on("unhandledRejection", (reason, promise) =>
//   console.error("Unhandled Rejection:", reason)
// );





import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);

import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/error.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import homeRoutes from "./routes/home.js";
import societyRoutes from "./routes/societyRoutes.js";
import path from "path";
import fs from "fs";
import ownerRoutes from "./routes/ownerRoutes.js";
import assignHomeRoutes from "./routes/assignHomeRoutes.js";
import secretaryRoutes from "./routes/secretaryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import changePasswordRoutes from "./routes/changePassword.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import hallRoutes from "./routes/hallRoute.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import Street from "./routes/streetRoutes.js";
import payment from "./routes/paymentRoutes.js";
import repitsRoutes from "./routes/receiptRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://front-end-of-residentmate.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
app.use("/uploads", express.static(uploadPath));

// 🔥 SOCKET.IO SETUP
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://front-end-of-residentmate.onrender.com",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "https://front-end-of-residentmate.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});


io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-room", (role) => {
    socket.join(role);
    console.log(`✅ ${role} joined room:`, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
  });
});
app.get("/", (req, res) => res.send("API running..."));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/homes", homeRoutes);
app.use("/api/societies", societyRoutes);
app.use("/api", ownerRoutes);
app.use("/api", assignHomeRoutes);
app.use("/api", secretaryRoutes);
app.use("/api", profileRoutes);
app.use("/api", changePasswordRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api", complaintRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/streets", Street);
app.use("/api", payment);
app.use("/api", repitsRoutes);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);



// MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});

process.on("uncaughtException", (err) =>
  console.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (reason) =>
  console.error("Unhandled Rejection:", reason)
);

// export
export { io, server };
