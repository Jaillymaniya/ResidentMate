import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function OwnerRegistration() {
  const [form, setForm] = useState({
    _id: "",
    UserName: "",
    UserGender: "Male",
    UserCNo: "",
    UserEmailID: "",
    Password: "",
    HomeID: "",
  });

  const [homes, setHomes] = useState([]);
  const [message, setMessage] = useState("");
  const [ownerList, setOwnerList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showInactive, setShowInactive] = useState(false);


  // const handleDelete = async (ownerId) => {
  //   if (window.confirm("Are you sure you want to inactive this owner?")) {
  //     try {
  //       await axios.delete(`${API_BASE_URL}/api/owners/${ownerId}`);
  //       setMessage("Owner Inactive successfully!");
  //       fetchOwners();
  //     } catch (err) {
  //       console.error(err);
  //       setMessage("Failed to inactive owner. Try again!");
  //     }
  //   }
  // };

  const handleDelete = async (ownerId) => {
    if (window.confirm("Are you sure you want to inactivate this owner?")) {
      try {
        await axios.put(`${API_BASE_URL}/api/owners/status/${ownerId}`, {
          status: "Inactive",
        });
        setMessage("Owner inactivated successfully!");
        fetchOwners();
      } catch (err) {
        console.error(err);
        setMessage("Failed to inactivate owner. Try again!");
      }
    }
  };


  // const fetchOwners = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}/api/owners-with-homes`);
  //     setOwnerList(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  //   const fetchOwners = async () => {
  //   try {
  //     const [ownersRes, homesRes] = await Promise.all([
  //       axios.get(`${API_BASE_URL}/api/owners-with-homes`),
  //       axios.get(`${API_BASE_URL}/api/homes/available`),
  //     ]);

  //     const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];
  //     const homes = Array.isArray(homesRes.data) ? homesRes.data : [];

  //     // 🔹 Filter out already assigned homes
  //     const assignedHomeIDs = owners
  //       .filter((o) => o.Home)
  //       .map((o) => o.Home._id);

  //     const availableHomes = homes.filter(
  //       (home) => !assignedHomeIDs.includes(home._id)
  //     );

  //     setOwnerList(owners);
  //     setHomes(availableHomes);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  //     const fetchOwners = async () => {
  //   try {
  //     const ownersURL = showInactive
  //       ? `${API_BASE_URL}/api/inactive-owners-with-homes`
  //       : `${API_BASE_URL}/api/owners-with-homes`;

  //     const [ownersRes, homesRes] = await Promise.all([
  //       axios.get(ownersURL),
  //       axios.get(`${API_BASE_URL}/api/homes/available`),
  //        axios.get(`${API_BASE_URL}/api/streets`),
  //     ]);

  //     const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];
  //     const homes = Array.isArray(homesRes.data) ? homesRes.data : [];
  //     const streets = Array.isArray(streetsRes.data?.data) ? streetsRes.data.data : [];

  //     const homesWithStreetNames = homes.map(home => {
  //       const street = streets.find(s => s._id === home.StreetID);
  //       return {
  //         ...home,
  //         StreetNumber: street?.streetNumber || "Unknown"
  //       };
  //     });

  //     // Also update owners' home data with street numbers
  //     const ownersWithUpdatedHomes = owners.map(owner => {
  //       if (owner.Home && owner.Home.StreetID) {
  //         const street = streets.find(s => s._id === owner.Home.StreetID);
  //         return {
  //           ...owner,
  //           Home: {
  //             ...owner.Home,
  //             StreetNumber: street?.streetNumber || "Unknown"
  //           }
  //         };
  //       }
  //       return owner;
  //     });

  //     const assignedHomeIDs = owners.filter(o => o.Home).map(o => o.Home._id);
  //     const availableHomes = homes.filter(home => !assignedHomeIDs.includes(home._id));

  //     setOwnerList(owners);
  //     setHomes(availableHomes);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  const fetchOwners = async () => {
    try {
      const ownersURL = showInactive
        ? `${API_BASE_URL}/api/inactive-owners-with-homes`
        : `${API_BASE_URL}/api/owners-with-homes`;

      const [ownersRes, homesRes, streetsRes] = await Promise.all([ // ✅ Added streetsRes here
        axios.get(ownersURL),
        axios.get(`${API_BASE_URL}/api/homes/available`),
        axios.get(`${API_BASE_URL}/api/streets`),
      ]);

      const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];
      const homes = Array.isArray(homesRes.data) ? homesRes.data : [];
      const streets = Array.isArray(streetsRes.data?.data) ? streetsRes.data.data : []; // ✅ Now streetsRes is defined

      const homesWithStreetNames = homes.map(home => {
        const street = streets.find(s => s._id === home.StreetID);
        return {
          ...home,
          StreetNumber: street?.streetNumber || "Unknown"
        };
      });

      // Also update owners' home data with street numbers
      const ownersWithUpdatedHomes = owners.map(owner => {
        if (owner.Home && owner.Home.StreetID) {
          const street = streets.find(s => s._id === owner.Home.StreetID);
          return {
            ...owner,
            Home: {
              ...owner.Home,
              StreetNumber: street?.streetNumber || "Unknown"
            }
          };
        }
        return owner;
      });

      const assignedHomeIDs = owners.filter(o => o.Home).map(o => o.Home._id);
      const availableHomes = homesWithStreetNames.filter(home => !assignedHomeIDs.includes(home._id)); // ✅ Use homesWithStreetNames

      setOwnerList(ownersWithUpdatedHomes); // ✅ Use ownersWithUpdatedHomes
      setHomes(availableHomes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (ownerId) => {
    if (window.confirm("Do you want to activate this owner again?")) {
      try {
        await axios.put(`${API_BASE_URL}/api/owners/status/${ownerId}`, {
          status: "Active",
        });
        setMessage("Owner activated successfully!");
        fetchOwners();
      } catch (err) {
        console.error(err);
        setMessage("Failed to activate owner. Try again!");
      }
    }
  };




  // useEffect(() => {
  //   fetchOwners();
  //   axios
  //     .get(`${API_BASE_URL}/api/homes/available`)
  //     .then((res) => setHomes(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //   useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const [ownersRes, homesRes] = await Promise.all([
  //         axios.get(`${API_BASE_URL}/api/owners-with-homes`),
  //         axios.get(`${API_BASE_URL}/api/homes/available`),
  //         axios.get(`${API_BASE_URL}/api/streets`),
  //       ]);

  //       const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];
  //       const homes = Array.isArray(homesRes.data) ? homesRes.data : [];
  //       const streets = Array.isArray(streetsRes.data?.data) ? streetsRes.data.data : [];

  //       // Map street numbers to homes
  //       const homesWithStreetNames = homes.map(home => {
  //         const street = streets.find(s => s._id === home.StreetID);
  //         return {
  //           ...home,
  //           StreetNumber: street?.streetNumber || "Unknown"
  //         };
  //       });

  //       // Update owners' home data with street numbers
  //       const ownersWithUpdatedHomes = owners.map(owner => {
  //         if (owner.Home && owner.Home.StreetID) {
  //           const street = streets.find(s => s._id === owner.Home.StreetID);
  //           return {
  //             ...owner,
  //             Home: {
  //               ...owner.Home,
  //               StreetNumber: street?.streetNumber || "Unknown"
  //             }
  //           };
  //         }
  //         return owner;
  //       });

  //       // 🔹 Get all home IDs already assigned to owners
  //       const assignedHomeIDs = owners
  //         .filter((o) => o.Home)
  //         .map((o) => o.Home._id);

  //       // 🔹 Exclude already assigned homes
  //       const availableHomes = homes.filter(
  //         (home) => !assignedHomeIDs.includes(home._id)
  //       );

  //       setOwnerList(owners);
  //       setHomes(availableHomes);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   loadData();
  // }, []);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [ownersRes, homesRes, streetsRes] = await Promise.all([ // ✅ Added streetsRes here
          axios.get(`${API_BASE_URL}/api/owners-with-homes`),
          axios.get(`${API_BASE_URL}/api/homes/available`),
          axios.get(`${API_BASE_URL}/api/streets`),
        ]);

        const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];
        const homes = Array.isArray(homesRes.data) ? homesRes.data : [];
        const streets = Array.isArray(streetsRes.data?.data) ? streetsRes.data.data : []; // ✅ Now streetsRes is defined

        // Map street numbers to homes
        const homesWithStreetNames = homes.map(home => {
          const street = streets.find(s => s._id === home.StreetID);
          return {
            ...home,
            StreetNumber: street?.streetNumber || "Unknown"
          };
        });

        // Update owners' home data with street numbers
        const ownersWithUpdatedHomes = owners.map(owner => {
          if (owner.Home && owner.Home.StreetID) {
            const street = streets.find(s => s._id === owner.Home.StreetID);
            return {
              ...owner,
              Home: {
                ...owner.Home,
                StreetNumber: street?.streetNumber || "Unknown"
              }
            };
          }
          return owner;
        });

        // 🔹 Get all home IDs already assigned to owners
        const assignedHomeIDs = owners
          .filter((o) => o.Home)
          .map((o) => o.Home._id);

        // 🔹 Exclude already assigned homes - Use homesWithStreetNames
        const availableHomes = homesWithStreetNames.filter(
          (home) => !assignedHomeIDs.includes(home._id)
        );

        setOwnerList(ownersWithUpdatedHomes); // ✅ Use ownersWithUpdatedHomes
        setHomes(availableHomes);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    fetchOwners();
  }, [showInactive]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    // ✅ Validation rules
    if (name === "UserName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return; // letters and space only
    }

    if (name === "UserCNo") {
      if (!/^\d*$/.test(value)) return; // numbers only
      if (value.length > 10) return; // max 10 digits
    }

    if (name === "UserEmailID") {
      // allow typing, but validation will happen on submit
    }
    setForm({ ...form, [name]: value });
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setMessage("");

  //     try {
  //       if (isEdit) {
  //         await axios.put(`${API_BASE_URL}/api/owners/${form._id}`, {
  //           UserName: form.UserName,
  //           UserGender: form.UserGender,
  //           UserCNo: form.UserCNo,
  //           UserEmailID: form.UserEmailID,
  //           // Password: form.Password,
  //         });

  //         if (form.Password && form.Password.trim() !== "") {
  //   updateData.Password = form.Password;
  // }

  //         await axios.put(`${API_BASE_URL}/api/owners/${form._id}`, updateData);

  //         await axios.put(`${API_BASE_URL}/api/assign-home/${form._id}`, {
  //           HomeID: form.HomeID,
  //         });

  //         setMessage("Owner updated successfully!");
  //       } else {
  //         const registerRes = await axios.post(
  //           `${API_BASE_URL}/api/register-owner`,
  //           {
  //             UserName: form.UserName,
  //             UserGender: form.UserGender,
  //             UserCNo: form.UserCNo,
  //             UserEmailID: form.UserEmailID,
  //             Password: form.Password,
  //           }
  //         );

  //         const ownerId = registerRes.data.owner._id;

  //         await axios.post(`${API_BASE_URL}/api/assign-home`, {
  //           UserID: ownerId,
  //           HomeID: form.HomeID,
  //         });

  //         setMessage("Owner registered and home assigned successfully!");
  //       }

  //       setForm({
  //         _id: "",
  //         UserName: "",
  //         UserGender: "Male",
  //         UserCNo: "",
  //         UserEmailID: "",
  //         Password: "",
  //         HomeID: "",
  //       });
  //       setIsEdit(false);
  //       fetchOwners();
  //     } catch (error) {
  //       console.error(error);
  //       setMessage(
  //         error.response?.data?.message || "Something went wrong. Try again!"
  //       );
  //     }
  //   };

  const validateForm = () => {
    const { UserName, UserCNo, UserEmailID, Password, HomeID } = form;

    if (!UserName || !UserCNo || !UserEmailID || !HomeID) {
      setMessage("Please fill all required fields.");
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(UserName)) {
      setMessage("Name can only contain letters and spaces.");
      return false;
    }

    if (!/^\d{10}$/.test(UserCNo)) {
      setMessage("Contact number must be 10 digits.");
      return false;
    }

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(UserEmailID)
    ) {
      setMessage("Invalid email format.");
      return false;
    }

    if (!isEdit && (!Password || Password.length < 6)) {
      setMessage("Password is required and must be at least 6 characters.");
      return false;
    }

    return true;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return; // ❌ stop submission if invalid

    try {
      if (isEdit) {
        // ✅ Step 1: Build the update payload
        const updateData = {
          UserName: form.UserName,
          UserGender: form.UserGender,
          UserCNo: form.UserCNo,
          UserEmailID: form.UserEmailID,
        };

        if (form.Password && form.Password.trim() !== "") {
          updateData.Password = form.Password;
        }

        // ✅ Step 2: Update Owner Info
        await axios.put(`${API_BASE_URL}/api/owners/${form._id}`, updateData);

        // ✅ Step 3: Check if the owner already has a home assignment
        const checkAssign = await axios.get(
          `${API_BASE_URL}/api/assign-home/check/${form._id}`
        );

        if (checkAssign.data.exists) {
          // 🔹 If already assigned, update it
          await axios.put(`${API_BASE_URL}/api/assign-home/${form._id}`, {
            HomeID: form.HomeID,
          });
        } else {
          // 🔹 If not assigned (reactivated case), assign new home
          await axios.post(`${API_BASE_URL}/api/assign-home`, {
            UserID: form._id,
            HomeID: form.HomeID,
          });
        }

        setMessage("Owner updated and home assigned successfully!");
      } else {
        // ✅ Register new owner
        const registerRes = await axios.post(
          `${API_BASE_URL}/api/register-owner`,
          {
            UserName: form.UserName,
            UserGender: form.UserGender,
            UserCNo: form.UserCNo,
            UserEmailID: form.UserEmailID,
            Password: form.Password,
          }
        );

        const ownerId = registerRes.data.owner._id;

        // ✅ Assign home to new owner
        await axios.post(`${API_BASE_URL}/api/assign-home`, {
          UserID: ownerId,
          HomeID: form.HomeID,
        });

        setMessage("Owner registered and home assigned successfully!");
      }

      // ✅ Reset form and reload data
      setForm({
        _id: "",
        UserName: "",
        UserGender: "Male",
        UserCNo: "",
        UserEmailID: "",
        Password: "",
        HomeID: "",
      });
      setIsEdit(false);
      fetchOwners();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    }
  };




  // const handleEdit = (owner) => {
  //   setIsEdit(true);
  //   setForm({
  //     _id: owner._id,
  //     UserName: owner.UserName,
  //     UserGender: owner.UserGender,
  //     UserCNo: owner.UserCNo,
  //     UserEmailID: owner.UserEmailID,
  //     Password: "",
  //     HomeID: owner.Home ? owner.Home._id : "",
  //   });
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  //   const handleEdit = (owner) => {
  //   setIsEdit(true);

  //   // Include currently assigned home in dropdown if not already in list
  //   if (owner.Home && !homes.some((h) => h._id === owner.Home._id)) {
  //     const homeWithStreet = {
  //       ...owner.Home,
  //       StreetNumber: owner.Home.StreetNumber || "Unknown"
  //     };
  //     setHomes((prevHomes) => [...prevHomes, owner.Home]);
  //   }

  //   setForm({
  //     _id: owner._id,
  //     UserName: owner.UserName,
  //     UserGender: owner.UserGender,
  //     UserCNo: owner.UserCNo,
  //     UserEmailID: owner.UserEmailID,
  //     Password: "",
  //     HomeID: owner.Home ? owner.Home._id : "",
  //   });

  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };


  const handleEdit = (owner) => {
    setIsEdit(true);

    // Include currently assigned home in dropdown if not already in list
    if (owner.Home && !homes.some((h) => h._id === owner.Home._id)) {
      // Use the home data from owner which already has StreetNumber
      setHomes((prevHomes) => [...prevHomes, owner.Home]);
    }

    setForm({
      _id: owner._id,
      UserName: owner.UserName,
      UserGender: owner.UserGender,
      UserCNo: owner.UserCNo,
      UserEmailID: owner.UserEmailID,
      Password: "",
      HomeID: owner.Home ? owner.Home._id : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="owner-page">
      <div className="owner-registration-container">
        <h2>
          {isEdit
            ? "Update Owner & Home Assignment"
            : "Register Owner & Assign Home"}
        </h2>
        {message && <p className="message">{message}</p>}

        <form className="owner-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="UserName"
            placeholder="Full Name"
            value={form.UserName}
            onChange={handleChange}
            required
          />
          <select
            name="UserGender"
            value={form.UserGender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="UserCNo"
            placeholder="Contact Number"
            value={form.UserCNo}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="UserEmailID"
            placeholder="Email"
            value={form.UserEmailID}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder={isEdit ? "Enter new password (optional)" : "Password"}
            value={form.Password}
            onChange={handleChange}
            required={!isEdit}
          />
          <select
            name="HomeID"
            value={form.HomeID}
            onChange={handleChange}
            required
          >
            <option value="">Select Home</option>
            {homes.map((home) => (
              <option key={home._id} value={home._id}>
                {home.HomeNumber} - {home.StreetNumber}
              </option>
            ))}
          </select>

          <button type="submit">
            {isEdit ? "Update Owner" : "Register & Assign"}
          </button>


        </form>

        <button
          onClick={() => {
            setShowInactive(!showInactive);
            setTimeout(fetchOwners, 100); // refresh after toggle
          }}
          style={{
            background: showInactive ? "#4caf50" : "#9c27b0",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          {showInactive ? "Show Active Owners" : "Show Inactive Owners"}
        </button>


        <h3>Registered Owners</h3>
        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Assigned Home</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ownerList.map((owner) => (
                <tr key={owner._id}>
                  <td>{owner.UserName}</td>
                  <td>{owner.UserEmailID}</td>
                  <td>{owner.UserCNo}</td>
                  <td>{owner.UserGender}</td>
                  <td>
                    {owner.Home
                      ? `Home ${owner.Home.HomeNumber} - Street ${owner.Home.StreetNumber}`
                      : "Not assigned"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(owner)} className="edit-btn">
                      ✏️
                    </button>
                    {/* <button
                      onClick={() => handleDelete(owner._id)}
                      className="delete-btn"
                    >
                      🗑️ Inactive
                    </button> */}


                    {owner.Status === "Inactive" ? (
                      <button
                        onClick={() => handleActivate(owner._id)}
                        className="activate-btn"
                      >
                        ✅ Activate
                      </button>
                    ) : (
                      <>
                        {/* <button onClick={() => handleEdit(owner)} className="edit-btn">
        ✏️ Edit
      </button> */}
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="delete-btn"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>



                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Safe inline CSS (no layout breaking) */}
        <style>{`
          #owner-page {
            padding: 20px;
            font-family: 'Segoe UI', sans-serif;
            background: #f8f9fc;
            border-radius: 10px;
            box-sizing: border-box;
            overflow-x: hidden; /* 🔹 Prevent page scroll on update */
            width: 100%;
          }

          h2, h3 {
            color: #1a237e;
            margin-bottom: 20px;
          }

          .owner-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
            background: white;
            padding: 25px 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 40px;
          }

          .owner-form input, .owner-form select {

            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 0.95rem;
            width: 90%;
          }

          .owner-form input:focus, .owner-form select:focus {
            border-color: #3f51b5;
            outline: none;
          }

          .owner-form button {
            grid-column: 1 / -1;
            background: #3f51b5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s ease;
            width: fit-content;
            justify-self: start;
          }

          .owner-form button:hover {
            background: #283593;
          }

          .owner-table-wrapper {
            overflow-x: auto;
            max-width: 100%;
          }

          .owner-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
          }

          .owner-table th, .owner-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
            white-space: nowrap;
            
          }

          .owner-table th {
            background: #3f51b5;
            color: white;
          }

          .edit-btn, .delete-btn {
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
          }

          .edit-btn { background: #ffffffff; color: white; margin-right: 5px; }
          .edit-btn:hover { background: #dfd7cbff; }

          .delete-btn { background: #ffffffff; color: white; }
          .delete-btn:hover { background: #dfd7cbff; }

          .message {
            margin-bottom: 20px;
            color: #2e7d32;
            font-weight: 500;
          }
        `}</style>
      </div>
    </div>
  );
}
