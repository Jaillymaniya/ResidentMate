import express from "express";
import Appointment from "../models/Appointment.js";
import AssignHome from "../models/AssignHome.js";
import User from "../models/User.js";
import Home from "../models/Home.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../services/mailService.js";

const router = express.Router();

/* ======= PUBLIC: Create appointment ======= */
// router.post("/public", async (req, res) => {
//   try {
//     const { name, email, phone, homeId } = req.body;
//     if (!name || !email || !phone || !homeId) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const alreadyAccepted = await Appointment.findOne({ 
//       AssignID: homeId, 
//       Status: "Accepted" 
//     });
//     if (alreadyAccepted) {
//       return res.status(400).json({ 
//         message: "This home is already booked/assigned!" 
//       });
//     }

//     const appointment = new Appointment({
//       TenantName: name,
//       TenantEmail: email,
//       TenantContact: phone,
//       AssignID: homeId,
//       RequestDate: new Date(),
//       Status: "Pending",
//     });
//     await appointment.save();
//     res.json({ message: "Appointment requested", success: true });
//   } catch (err) {
//     console.error("Appointment Insert Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/public", async (req, res) => {
  try {
    const { name, email, phone, homeId } = req.body;

    console.log("REQ BODY:", req.body);

    // Validate required fields
    if (!name || !email || !phone || !homeId) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, homeId) are required",
      });
    }

    // 1️⃣ Check if Home exists
    const homeExists = await Home.findById(homeId);
    if (!homeExists) {
      return res.status(404).json({
        success: false,
        message: "Invalid HomeID — Home not found",
      });
    }

    // 2️⃣ Find AssignHome entry → get AssignID
    const assigned = await AssignHome.findOne({ HomeID: homeId });

    if (!assigned) {
      return res.status(404).json({
        success: false,
        message: "This home is not assigned to any owner yet!",
      });
    }

    // 3️⃣ Prevent duplicate appointment if already accepted
    const alreadyAccepted = await Appointment.findOne({
      AssignID: assigned._id,
      Status: "Accepted",
    });

    if (alreadyAccepted) {
      return res.status(400).json({
        success: false,
        message: "This home is already booked by someone!",
      });
    }

    // 4️⃣ Create Appointment with AssignID
    const appointment = new Appointment({
      AssignID: assigned._id,   // <-- Important change
      TenantName: name,
      TenantEmail: email,
      TenantContact: phone,
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully!",
      appointment,
    });

  } catch (error) {
    console.error("Appointment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
      error: error.message,
    });
  }
});


router.get("/getOwnerByEmail", async (req, res) => {
  try {
    const email = req.query.email;

    const owner = await User.findOne({ UserEmailID : email });

    if (!owner) return res.status(404).json({ error: "Owner not found" });

     res.json({ ownerId: owner._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ======= OWNER GET: Appointments for owner's homes ======= */
// router.get("/owner", async (req, res) => {
//   try {
//     const ownerId = req.query.ownerId;
//     if (!ownerId) return res.status(400).json({ error: "ownerId required" });

//     const homeIds = await AssignHome.find({ UserID: ownerId }).distinct("HomeID");
//     const appointments = await Appointment.find({ AssignID: { $in: homeIds } });

//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

/* ======= OWNER GET: Appointments for owner’s homes ======= */
router.get("/owner", async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    if (!ownerId) return res.status(400).json({ error: "ownerId required" });

    // Get all AssignHome IDs for this owner
    const assignIds = await AssignHome.find({ UserID: ownerId }).distinct("_id");

    console.log("Assign IDs:", assignIds);

    if (assignIds.length === 0) {
      return res.json([]); // No houses assigned to owner
    }

    // Fetch appointments that belong to these AssignHome IDs
    const appointments = await Appointment.find({
      AssignID: { $in: assignIds }
    }).populate({
  path: "AssignID",
  populate: { path: "HomeID", model: "Tbl_Home" }
})


    res.json(appointments);

  } catch (err) {
    console.error("Owner Appointment Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ======= PATCH: Accept/Reject appointment ======= */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { Status: status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======= PATCH: Checkout appointment (Tenant leaves) ======= */
// router.patch("/:id/checkout", async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const appointment = await Appointment.findById(id);
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }
//     if (appointment.Status !== "Accepted") {
//       return res.status(400).json({ 
//         error: "Only Accepted appointments can be checked out" 
//       });
//     }

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id,
//       { 
//         Status: "Checkout",
//         CheckoutDate: new Date()
//       },
//       { new: true }
//     );

//     res.json({ 
//       message: "Checkout completed! House is now available.", 
//       appointment: updatedAppointment 
//     });
//   } catch (err) {
//     console.error("Checkout Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

/* ======= PATCH: Checkout appointment (Tenant leaves) ======= */
router.patch("/:id/checkout", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.Status !== "Accepted") {
      return res.status(400).json({
        error: "Only Accepted appointments can be checked out"
      });
    }

    // 2️⃣ Find tenant user
    const tenant = await User.findOne({
      UserEmailID: appointment.TenantEmail
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant user not found" });
    }

    // 3️⃣ Inactivate tenant
    tenant.Status = "Inactive";
    await tenant.save();

    // 4️⃣ Remove tenant ↔ home assignment (free the home)
    await AssignHome.deleteOne({
      UserID: tenant._id,
      RelationType: "Tenant"   // important: don't delete owner assignment!
    });

    // 5️⃣ Update appointment status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        Status: "Checkout",
        CheckoutDate: new Date()
      },
      { new: true }
    );

    res.json({
      message: "Checkout completed! Tenant deactivated and house assignment removed.",
      appointment: updatedAppointment
    });

  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// /* ======= ADMIN: Fetch accepted appointments ======= */
// router.get("/accepted", async (req, res) => {
//   try {
//     const acceptedAppointments = await Appointment.find({ Status: "Accepted" });
//     res.json(acceptedAppointments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


/* ======= ADMIN: Fetch accepted appointments WITH HOME NUMBER ======= */
router.get("/accepted", async (req, res) => {
  try {
    const acceptedAppointments = await Appointment.find({ Status: "Accepted" })
      .populate({
        path: "AssignID",
        populate: {
          path: "HomeID",
          select: "HomeNumber"  // ONLY HomeNumber
        }
      });

    res.json(acceptedAppointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router.post("/registerTenant", async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     if (!appointmentId)
//       return res.status(400).json({ message: "appointmentId is required" });

//     // 1️⃣ Fetch appointment
//     const appointment = await Appointment.findById(appointmentId).populate("AssignID");

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });

//     if (appointment.Status !== "Accepted")
//       return res.status(400).json({ message: "Appointment must be Accepted" });

//     const assignHome = await AssignHome.findById(appointment.AssignID);

//     if (!assignHome)
//       return res.status(404).json({ message: "AssignHome entry not found" });

//     const homeId = assignHome.HomeID;

//     // 2️⃣ Check if tenant already registered
//     let userExists = await User.findOne({ UserEmailID: appointment.TenantEmail });

//     if (!userExists) {
//       // Create Tenant User
//       userExists = new User({
//         UserName: appointment.TenantName,
//         UserEmailID: appointment.TenantEmail,
//         UserCNo: appointment.TenantContact,
//         Role: "Tenant",
//         UserGender: "Other",
//         Password: "12345",
//       });

//       await userExists.save();
//     }

//     // 3️⃣ Assign home to tenant
//     const assignTenant = new AssignHome({
//       UserID: userExists._id,
//       HomeID: homeId,
//       RelationType: "Tenant",
//     });

//     await assignTenant.save();

//     // 4️⃣ Insert into Tbl_Tenant
//     const tenant = new Tenant({
//       AssignId: assignTenant._id,
//       RentalStartDate: new Date(),
//     });

//     await tenant.save();

//     return res.json({
//       success: true,
//       message: "Tenant registered successfully!",
//       tenant,
//     });

//   } catch (err) {
//     console.error("Tenant Registration Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/registerTenant", async (req, res) => {
//   try {
//     const { appointmentId, gender, password } = req.body;

//     if (!appointmentId)
//       return res.status(400).json({ message: "appointmentId is required" });

//     // Validation for admin-entered gender & password
//     if (!gender || !password) {
//       return res.status(400).json({ message: "Gender and Password are required" });
//     }

//     // 1️⃣ Fetch appointment
//     const appointment = await Appointment.findById(appointmentId).populate("AssignID");

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });

//     if (appointment.Status !== "Accepted")
//       return res.status(400).json({ message: "Appointment must be Accepted" });

//     const assignHome = await AssignHome.findById(appointment.AssignID);

//     if (!assignHome)
//       return res.status(404).json({ message: "AssignHome entry not found" });

//     const homeId = assignHome.HomeID;

//     // 2️⃣ Check if user exists
//     let user = await User.findOne({ UserEmailID: appointment.TenantEmail });

//     if (!user) {
//       // Create Tenant User using admin-provided fields
//       user = new User({
//         UserName: appointment.TenantName,
//         UserEmailID: appointment.TenantEmail,
//         UserCNo: appointment.TenantContact,
//         Role: "Tenant",
//         UserGender: gender,
//         Password: password
//       });

//       await user.save();
//     }

//     // 3️⃣ Check if this tenant is already assigned to this home
//     let alreadyAssigned = await AssignHome.findOne({
//       UserID: user._id,
//       HomeID: homeId,
//       RelationType: "Tenant"
//     });

//     if (alreadyAssigned) {
//       return res.status(400).json({
//         message: "Tenant already assigned to this home!"
//       });
//     }

//     // 4️⃣ Assign home ONCE
//     const assignTenant = new AssignHome({
//       UserID: user._id,
//       HomeID: homeId,
//       RelationType: "Tenant",
//     });

//     await assignTenant.save();

//     // 5️⃣ Prevent duplicate tenant record
//     // const duplicateTenant = await Tenant.findOne({
//     //   AssignId: assignTenant._id,
//     // });

//     const duplicateTenant = await Tenant.findOne({ AssignId: assignTenant._id });
// // if (duplicateTenant) {
// //   return res.status(400).json({ message: "Tenant already registered!" });
// // }

//     if (duplicateTenant) {
//       return res.status(400).json({
//         message: "Tenant already registered!"
//       });
//     }

//     // 6️⃣ Create Tenant
//     const tenant = new Tenant({
//       AssignId: assignTenant._id,
//       RentalStartDate: new Date(),
//     });

//     await tenant.save();

//     return res.json({
//       success: true,
//       message: "Tenant registered successfully!",
//       tenant,
//     });

//   } catch (err) {
//     console.error("Tenant Registration Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


router.post("/registerTenant", async (req, res) => {
  try {
    const { appointmentId, gender, password } = req.body;

    if (!appointmentId)
      return res.status(400).json({ message: "appointmentId is required" });

    if (!gender || !password)
      return res.status(400).json({ message: "Gender and Password are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    // Fetch appointment
    const appointment = await Appointment.findById(appointmentId).populate("AssignID");
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.Status !== "Accepted")
      return res.status(400).json({ message: "Appointment must be Accepted" });

    const assignedHome = appointment.AssignID;
    if (!assignedHome)
      return res.status(404).json({ message: "AssignHome entry not found" });

    const homeId = assignedHome.HomeID;

    // Find or create user
    let user = await User.findOne({ UserEmailID: appointment.TenantEmail });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      user = await User.create({
        UserName: appointment.TenantName,
        UserEmailID: appointment.TenantEmail,
        UserCNo: appointment.TenantContact,
        Role: "Tenant",
        UserGender: gender,
        Password: hashedPassword,
      });
    }

    // Check if already assigned to home
    const existingAssign = await AssignHome.findOne({
      UserID: user._id,
      HomeID: homeId,
      RelationType: "Tenant",
    });

    if (existingAssign) {
      return res.status(400).json({ message: "Tenant already assigned to this home!" });
    }

    // Create assignment
    const assignTenant = await AssignHome.create({
      UserID: user._id,
      HomeID: homeId,
      RelationType: "Tenant",
      Status: "Active"
    });

     // ✅ Send welcome email
         const emailHtml = `
           <h3>Welcome to Society Management System</h3>
           <p>Dear ${user.UserName},</p>
           <p>Your Tenant account has been successfully created.</p>
           <p><b>Email:</b> ${user.UserEmailID}<br/><b>Password:</b> ${password}</p>
           <p>Regards,<br/>Society Management System</p>
         `;
     
         await sendMail(user.UserEmailID, "Tenant Account Created", emailHtml);

    return res.json({
      success: true,
      message: "Tenant registered successfully!",
      assignTenant,
    });

  } catch (err) {
    console.error("Tenant Registration Error:", err);
    res.status(500).json({ error: err.message });
  }
});




/* ======= ADMIN: Fetch Registered Tenants ======= */
// router.get("/registeredTenants", async (req, res) => {
//   try {
//     const tenants = await Tenant.find()
//       .populate({
//         path: "AssignId",
//         populate: [
//           { path: "UserID", model: "Tbl_Users" },        // Tenant User
//           { path: "HomeID", model: "Tbl_Home" }          // Home Details
//         ]
//       });

//     res.json(tenants);
//   } catch (err) {
//     console.error("Fetch Tenant Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/registeredTenants", async (req, res) => {
//   try {
//     const tenants = await AssignHome.find({ RelationType: "Tenant" })
//       .populate("UserID")
//       .populate("HomeID");

//     res.json(tenants);
//   } catch (err) {
//     console.error("Fetch Tenant Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/registeredTenants", async (req, res) => {
  try {
    // 1️⃣ Find ALL tenants from User collection
    const users = await User.find({ Role: "Tenant" });

    let finalList = [];

    for (const user of users) {
      // 2️⃣ Check if this user has an active assignment
      const assign = await AssignHome.findOne({ UserID: user._id })
        .populate("HomeID");

      finalList.push({
        _id: user._id,
        UserName: user.UserName,
        UserEmailID: user.UserEmailID,
        UserCNo: user.UserCNo,

        // If assigned → show home number
        // If not assigned → show null
        HomeNumber: assign?.HomeID?.HomeNumber || null,

        // Active if AssignHome exists
        Status: assign ? "Active" : "Deactivated",

        AssignID: assign?._id || null
      });
    }

    res.json(finalList);

  } catch (err) {
    console.error("Fetch Tenant Error:", err);
    res.status(500).json({ error: err.message });
  }
});



// router.patch("/deactivateTenant/:tenantId", async (req, res) => {
//   try {
//     const { tenantId } = req.params;

//     const tenant = await Tenant.findById(tenantId).populate("AssignId");
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     const assignHomeId = tenant.AssignId._id;
//     const userId = tenant.AssignId.UserID;

//     // 1️⃣ Soft delete tenant
//     tenant.Status = "Inactive";
//     await tenant.save();

//     // 2️⃣ Delete AssignHome entry
//     await AssignHome.findByIdAndDelete(assignHomeId);

//     // 3️⃣ Inactivate user
//     await User.findByIdAndUpdate(userId, { Status: Inactive });

//     res.json({ success: true, message: "Tenant deactivated successfully" });

//   } catch (err) {
//     console.error("Deactivate Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.patch("/deactivateTenant/:assignId", async (req, res) => {
  try {
    const { assignId } = req.params;

    const assign = await AssignHome.findById(assignId);
    if (!assign) return res.status(404).json({ message: "AssignHome not found" });

    const userId = assign.UserID;

    // Delete assignment
    await AssignHome.findByIdAndDelete(assignId);

    // Inactivate user
    await User.findByIdAndUpdate(userId, { Status: "Inactive" });

    res.json({ success: true, message: "Tenant deactivated successfully" });

  } catch (err) {
    console.error("Deactivate Error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.patch("/activateTenant/:userId/:homeId", async (req, res) => {
  try {
    const { userId, homeId } = req.params;

    // Activate user
    await User.findByIdAndUpdate(userId, { Status: "Active" });

    // // Re-create assignment
    // const assignTenant = await AssignHome.create({
    //   UserID: userId,
    //   HomeID: homeId,
    //   RelationType: "Tenant",
    //   Status: "Active"
    // });

    res.json({ success: true, message: "Tenant activated successfully", assignTenant });

  } catch (err) {
    console.error("Activate Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// router.patch("/updateTenant/:assignId", async (req, res) => {
//   try {
//     const { UserName, UserEmailID, UserCNo, HomeNumber } = req.body;
//     const { assignId } = req.params;

//     // 1️⃣ Fetch AssignHome entry
//     const assign = await AssignHome.findById(assignId);
//     if (!assign)
//       return res.status(404).json({ message: "Tenant assignment not found" });

//     const userId = assign.UserID;
//     const homeId = assign.HomeID;

//     // 2️⃣ Update User details
//     await User.findByIdAndUpdate(userId, {
//       UserName,
//       UserEmailID,
//       UserCNo
//     });

//     // 3️⃣ Update Home details
//     await Home.findByIdAndUpdate(homeId, {
//       HomeNumber
//     });

//     res.json({ success: true, message: "Tenant updated successfully!" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.patch("/updateTenant/:assignId", async (req, res) => {
//   try {
//     const { UserName, UserEmailID, UserCNo, HomeNumber } = req.body;
//     const { assignId } = req.params;

//     // 1️⃣ Fetch the current tenant assignment
//     const assign = await AssignHome.findById(assignId);
//     if (!assign)
//       return res.status(404).json({ message: "Tenant assignment not found" });

//     const userId = assign.UserID;

//     // 2️⃣ Find the Home document for the entered HomeNumber
//     const newHome = await Home.findOne({ HomeNumber: HomeNumber });
//     if (!newHome) {
//       return res
//         .status(404)
//         .json({ message: "Home number does not exist in database" });
//     }

//     // 2️⃣a Check if home is rental
//     if (!newHome.IsRental) {
//       return res
//         .status(400)
//         .json({ message: `Home number ${HomeNumber} is not available for rent` });
//     }

//     // 3️⃣ Check if this home is already assigned to another tenant
//     const alreadyAssigned = await AssignHome.findOne({
//       HomeID: newHome._id,
//       RelationType: "Tenant",
//       _id: { $ne: assignId }, // exclude current tenant
//     });

//     if (alreadyAssigned) {
//       return res.status(400).json({
//         message: `Home number ${HomeNumber} is already assigned to another tenant`,
//       });
//     }

//     // 4️⃣ Update User details
//     await User.findByIdAndUpdate(userId, {
//       UserName,
//       UserEmailID,
//       UserCNo,
//     });

//     // 5️⃣ Update Assignment to point to the new home ID
//     await AssignHome.findByIdAndUpdate(assignId, {
//       HomeID: newHome._id,
//     });

//     res.json({ success: true, message: "Tenant updated successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// router.patch("/updateTenant/:tenantId", async (req, res) => {
//   try {
//     const { tenantId } = req.params;
//     const { UserName, UserEmailID, UserCNo, HomeNumber } = req.body;

//     // 1️⃣ Fetch tenant user
//     const tenant = await User.findById(tenantId);
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     // 2️⃣ Update user details
//     tenant.UserName = UserName;
//     tenant.UserEmailID = UserEmailID;
//     tenant.UserCNo = UserCNo;
//     await tenant.save();

//     // 3️⃣ Optional: Assign home if HomeNumber provided
//     if (HomeNumber) {
//       const home = await Home.findOne({ HomeNumber });
//       if (!home) return res.status(404).json({ message: "Home number not found" });

//       // Check if home is already assigned to another tenant
//       const alreadyAssigned = await AssignHome.findOne({
//         HomeID: home._id,
//         RelationType: "Tenant",
//       });
//       if (alreadyAssigned)
//         return res.status(400).json({ message: "Home already assigned to another tenant" });

//       // Create new assignment
//       await AssignHome.create({
//         UserID: tenant._id,
//         HomeID: home._id,
//         RelationType: "Tenant",
//         Status: "Active",
//       });
//     }

//     res.json({ success: true, message: "Tenant updated successfully!" });
//   } catch (err) {
//     console.error("Update Tenant Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


router.patch("/updateTenant/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { UserName, UserEmailID, UserCNo, HomeNumber, assignId } = req.body;

    // 1️⃣ Update tenant info
    const tenant = await User.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.UserName = UserName;
    tenant.UserEmailID = UserEmailID;
    tenant.UserCNo = UserCNo;
    await tenant.save();

    // 2️⃣ If HomeNumber provided, handle assignment
    if (HomeNumber) {
      const home = await Home.findOne({ HomeNumber });
      if (!home) return res.status(404).json({ message: "Home number not found" });

      if (!home.IsRental) {
        return res.status(400).json({
          message: "This home cannot be assigned because it is not a rental home",
        });
      }

      // Check if this home is already assigned to another tenant
      const alreadyAssigned = await AssignHome.findOne({
        HomeID: home._id,
        RelationType: "Tenant",
        _id: { $ne: assignId } // exclude current assignment
      });

      if (alreadyAssigned)
        return res.status(400).json({ message: "Home already assigned to another tenant" });

      if (assignId) {
        // Update existing assignment
        await AssignHome.findByIdAndUpdate(assignId, { HomeID: home._id });
      } else {
        // Create new assignment
        await AssignHome.create({
          UserID: tenantId,
          HomeID: home._id,
          RelationType: "Tenant",
          Status: "Active",
        });
      }
    }

    res.json({ success: true, message: "Tenant updated successfully!" });
  } catch (err) {
    console.error("Update Tenant Error:", err);
    res.status(500).json({ message: err.message });
  }
});




router.post("/createTenantAssignment", async (req, res) => {
  try {
    const { userId, UserName, UserEmailID, UserCNo, HomeNumber } = req.body;

    // 1️⃣ Update user info
    await User.findByIdAndUpdate(userId, {
      UserName,
      UserEmailID,
      UserCNo
    });

    // 2️⃣ Find the home
    const home = await Home.findOne({ HomeNumber });
    if (!home) return res.status(404).json({ message: "Home number not found" });

    // 2️⃣a Check if home is rental (assuming you have a field `IsRental` in Home schema)
    if (!home.IsRental) {
      return res.status(400).json({ message: "This home is not available for rent!" });
    }

    // 3️⃣ Check if already assigned to another tenant
    const alreadyAssigned = await AssignHome.findOne({
      HomeID: home._id,
      RelationType: "Tenant"
    });

    if (alreadyAssigned) {
      return res.status(400).json({ message: "Home already assigned to another tenant" });
    }

    // 4️⃣ Create new assignment
    const assignTenant = await AssignHome.create({
      UserID: userId,
      HomeID: home._id,
      RelationType: "Tenant",
      Status: "Active"
    });

    res.json({ success: true, assignTenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.patch("/activateTenant/:tenantId", async (req, res) => {
//   try {
//     const { tenantId } = req.params;

//     // Find tenant by ID
//     const tenant = await User.findById(tenantId);
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     // Update status to Active
//     tenant.Status = "Active";
//     await tenant.save();

//     res.json({ success: true, message: "Tenant activated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// });

router.patch("/activateTenant/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await User.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.Status = "Active";
    await tenant.save();

    // Optional: check if AssignHome exists, if not, recreate it
    const assign = await AssignHome.findOne({ UserID: tenantId, RelationType: "Tenant" });
    if (!assign) {
      // Create a new AssignHome here if you have the HomeNumber or HomeID
      // await AssignHome.create({ UserID: tenantId, HomeID: ..., RelationType: "Tenant", Status: "Active" });
    }

    res.json({ success: true, message: "Tenant activated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// // PATCH /api/appointments/activateTenant/:id
// router.patch("/activateTenant/:id", async (req, res) => {
//   try {
//     const tenant = await User.findByIdAndUpdate(req.params.id, { Status: "Active" }, { new: true });
//     res.json({ message: "Tenant activated", tenant });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


export default router;