// import express from "express";
// import mongoose from "mongoose";
// import AssignHome from "../models/AssignHome.js";
// import User from "../models/User.js";
// import House from "../models/Home.js";
// import Secretory from "../models/Secretory.js";


// const router = express.Router();


// router.post("/assign-home", async (req, res) => {
//   try {
//     const { UserID, HomeID } = req.body;

//     console.log("UserID:", UserID, "HomeID:", HomeID);

//     const user = await User.findById(UserID);
//     const home = await House.findById(HomeID);

//     console.log("User fetched:", user);
//     console.log("Home fetched:", home);

//     if (!user || !home) {
//       return res.status(404).json({ message: "User or Home not found" });
//     }

//     if (user.Role !== "Owner") {
//       return res.status(400).json({ message: "User is not an Owner" });
//     }

//     // Check if home is already assigned
//     const existingAssignment = await AssignHome.findOne({ HomeID });
//     if (existingAssignment) {
//       return res.status(400).json({ message: "Home is already assigned to another owner" });
//     }

//     const assign = new AssignHome({
//       UserID,
//       HomeID,
//       RelationType: "Owner",
//     });

//     await assign.save();

//     home.Status = "Occupied";
//     home.DateUpdated = new Date();
//     await home.save();

//     res.status(201).json({ message: "Home assigned successfully", assign });
//   } catch (error) {
//     console.error("Error assigning home:", error);
//     res.status(500).json({ message: "Error assigning home", error: error.message });
//   }
// });


// // 🔵 Update or Reassign Home for Owner (PUT)
// router.put("/assign-home/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { HomeID } = req.body;

//     const home = await House.findById(HomeID);
//     if (!home) return res.status(404).json({ message: "Home not found" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     let assignment = await AssignHome.findOne({ UserID: userId });

//     if (assignment) {
//       // ✅ Only update if different home
//       if (assignment.HomeID.toString() !== HomeID) {
//         const prevHome = await House.findById(assignment.HomeID);
//         if (prevHome) {
//           prevHome.Status = "Available"; // 🔹 previously assigned home becomes available
//           prevHome.DateUpdated = new Date();
//           await prevHome.save();
//         }

//         assignment.HomeID = HomeID;
//         await assignment.save();

//         home.Status = "Occupied";
//         home.DateUpdated = new Date();
//         await home.save();
//       }

//       return res.status(200).json({
//         message: "Home assignment updated successfully",
//         assignment,
//       });
//     } else {
//       const newAssign = new AssignHome({
//         UserID: userId,
//         HomeID,
//         RelationType: "Owner",
//       });
//       await newAssign.save();

//       home.Status = "Occupied";
//       home.DateUpdated = new Date();
//       await home.save();

//       return res.status(201).json({
//         message: "Home reassigned successfully",
//         assignment: newAssign,
//       });
//     }
//   } catch (err) {
//     console.error("Error updating or reassigning home:", err);
//     res.status(500).json({
//       message: "Error assigning home",
//       error: err.message,
//     });
//   }
// });


// router.get("/owners-with-homes", async (req, res) => {
//   try {
//     // Find all active owners
//     const owners = await User.find({ Role: "Owner", Status: "Active" });

//     // Map each owner to their assigned home
//     const ownerWithHomes = await Promise.all(
//       owners.map(async (owner) => {
//         const assignment = await AssignHome.findOne({ UserID: owner._id })
//           .populate({
//             path: "HomeID",
//             model: "Tbl_Home", // <-- Must match your Home model name
//           });

//         return {
//           ...owner._doc,
//           Home: assignment ? assignment.HomeID : null,
//         };
//       })
//     );

//     res.status(200).json(ownerWithHomes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching owners", error: err.message });
//   }
// });

// // 🔹 Get all INACTIVE owners with their homes
// router.get("/inactive-owners-with-homes", async (req, res) => {
//   try {
//     const owners = await User.find({ Role: "Owner", Status: "Inactive" });

//     const ownerWithHomes = await Promise.all(
//       owners.map(async (owner) => {
//         const assignment = await AssignHome.findOne({ UserID: owner._id })
//           .populate({
//             path: "HomeID",
//             model: "Tbl_Home",
//           });

//         return {
//           ...owner._doc,
//           Home: assignment ? assignment.HomeID : null,
//         };
//       })
//     );

//     res.status(200).json(ownerWithHomes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching inactive owners", error: err.message });
//   }
// });


// router.put("/owners/status/:id", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { id } = req.params;

//     // 1️⃣ Update user status
//     const user = await User.findByIdAndUpdate(id, { Status: status }, { new: true });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2️⃣ If user becomes inactive
//     if (status === "Inactive") {
//       // 🔸 Delete from Secretary table
//       await Secretory.deleteOne({ UserID: id });

//       const assignment = await AssignHome.findOne({ UserID: id });
//       if (assignment) {
//         // 🔹 Set home status to Occupied
//         const home = await House.findById(assignment.HomeID);
//         if (home) {
//           home.Status = "Occupied";
//           home.DateUpdated = new Date();
//           await home.save();
//         }
//       }

//       // 🔸 Delete from Assigned Home table
//       await AssignHome.deleteOne({ UserID: id });

//     }

//     // 3️⃣ Respond
//     res.json({
//       success: true,
//       message: `User status updated to ${status}`,
//       user,
//     });
//   } catch (error) {
//     console.error("Error updating user status:", error);
//     res.status(500).json({ success: false, message: "Error updating user status" });
//   }
// });



// // 🔹 Check if a home assignment exists for an owner
// router.get("/assign-home/check/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const assignment = await AssignHome.findOne({ UserID: userId });

//     res.status(200).json({ exists: !!assignment });
//   } catch (err) {
//     res.status(500).json({ message: "Error checking assignment", error: err.message });
//   }
// });



// export default router;



import express from "express";
import AssignHome from "../models/AssignHome.js";
import User from "../models/User.js";
import House from "../models/Home.js";
import Secretory from "../models/Secretory.js";

const router = express.Router();


// ---------------------------------------------------
// 🔵 ASSIGN HOME (POST)
// ---------------------------------------------------
router.post("/assign-home", async (req, res) => {
  try {
    const { UserID, HomeID } = req.body;

    // console.log("UserID:", UserID, "HomeID:", HomeID);

    const user = await User.findById(UserID);
    const home = await House.findById(HomeID);

    // console.log("User fetched:", user);
    // console.log("Home fetched:", home);

    if (!user || !home) {
      return res.status(404).json({ message: "User or Home not found" });
    }

    if (user.Role !== "Owner") {
      return res.status(400).json({ message: "User is not an Owner" });
    }

    // Check home already assigned
    const existingAssignment = await AssignHome.findOne({ HomeID });
    if (existingAssignment) {
      return res.status(400).json({ message: "Home is already assigned to another owner" });
    }

    // Create new assignment
    const assign = new AssignHome({
      UserID,
      HomeID,
      RelationType: "Owner",
    });

    await assign.save();

    // Update home status → OCCUPIED
    home.Status = "Occupied";
    home.DateUpdated = new Date();
    await home.save();

    res.status(201).json({ message: "Home assigned successfully", assign });

  } catch (error) {
    console.error("Error assigning home:", error);
    res.status(500).json({ message: "Error assigning home", error: error.message });
  }
});


// ---------------------------------------------------
// 🔵 UPDATE OR REASSIGN HOME (PUT)
// ---------------------------------------------------
router.put("/assign-home/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { HomeID } = req.body;

    const home = await House.findById(HomeID);
    if (!home) return res.status(404).json({ message: "Home not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let assignment = await AssignHome.findOne({ UserID: userId });

    if (assignment) {
      // If same home selected → no change
      if (assignment.HomeID.toString() !== HomeID) {
        // free old home
        const prevHome = await House.findById(assignment.HomeID);
        if (prevHome) {
          prevHome.Status = "Available";
          prevHome.DateUpdated = new Date();
          await prevHome.save();
        }

        assignment.HomeID = HomeID;
        await assignment.save();

        // new home becomes occupied
        home.Status = "Occupied";
        home.DateUpdated = new Date();
        await home.save();
      }

      return res.status(200).json({
        message: "Home assignment updated successfully",
        assignment,
      });

    } else {
      // new assignment
      const newAssign = new AssignHome({
        UserID: userId,
        HomeID,
        RelationType: "Owner",
      });
      await newAssign.save();

      home.Status = "Occupied";
      home.DateUpdated = new Date();
      await home.save();

      return res.status(201).json({
        message: "Home reassigned successfully",
        assignment: newAssign,
      });
    }

  } catch (err) {
    console.error("Error updating or reassigning home:", err);
    res.status(500).json({ message: "Error assigning home", error: err.message });
  }
});


// ---------------------------------------------------
// 🔵 ACTIVE OWNERS WITH HOMES
// ---------------------------------------------------
router.get("/owners-with-homes", async (req, res) => {
  try {
    const owners = await User.find({ Role: "Owner", Status: "Active" });

    const result = await Promise.all(
      owners.map(async (owner) => {
        const assignment = await AssignHome.findOne({ UserID: owner._id })
          .populate("HomeID");

        return {
          ...owner._doc,
          Home: assignment ? assignment.HomeID : null,
        };
      })
    );

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: "Error fetching owners", error: err.message });
  }
});


// ---------------------------------------------------
// 🔵 INACTIVE OWNERS WITH HOMES
// ---------------------------------------------------
router.get("/inactive-owners-with-homes", async (req, res) => {
  try {
    const owners = await User.find({ Role: "Owner", Status: "Inactive" });

    const result = await Promise.all(
      owners.map(async (owner) => {
        const assignment = await AssignHome.findOne({ UserID: owner._id })
          .populate("HomeID");

        return {
          ...owner._doc,
          Home: assignment ? assignment.HomeID : null,
        };
      })
    );

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: "Error fetching inactive owners", error: err.message });
  }
});


// ---------------------------------------------------
// 🔵 UPDATE OWNER STATUS
// ---------------------------------------------------
router.put("/owners/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { Status: status }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    // When owner becomes inactive
    if (status === "Inactive") {
      await Secretory.deleteOne({ UserID: id });

      const assignment = await AssignHome.findOne({ UserID: id });
      if (assignment) {
        const home = await House.findById(assignment.HomeID);
        if (home) {
          home.Status = "Available";
          home.DateUpdated = new Date();
          await home.save();
        }
      }

      await AssignHome.deleteOne({ UserID: id });
    }

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user,
    });

  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ success: false, message: "Error updating user status" });
  }
});


// ---------------------------------------------------
// 🔵 CHECK IF OWNER HAS ASSIGNMENT
// ---------------------------------------------------
router.get("/assign-home/check/:userId", async (req, res) => {
  try {
    const assignment = await AssignHome.findOne({ UserID: req.params.userId });
    res.status(200).json({ exists: !!assignment });
  } catch (err) {
    res.status(500).json({ message: "Error checking assignment", error: err.message });
  }
});

export default router;
