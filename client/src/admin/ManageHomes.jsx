
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageHomes() {
  const [homes, setHomes] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [form, setForm] = useState({
    HomePhoto: null,
    HomeNumber: "",
    StreetNumber: "",
    HomeSize: "",
    HomeType: "1BHK",
    Furnishing: "",
    IsRental: false,
    Rent: 0,
    TenantPreferred: "",
    SocietyID: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/homes";
  const SOCIETY_API = "http://localhost:5000/api/societies"; // fetch societies

  const isLocked = () => {
  const home = homes.find(h => h._id === editingId);
    return home && home.Status === "Occupied";
  };


  useEffect(() => {
    fetchHomes();
    fetchSocieties();
  }, []);

//   const fetchHomes = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       // map populated society name
//       const mappedHomes = res.data.map((h) => {
//   const society = societies.find(s => s._id === h.SocietyID);
//   return { ...h, SocietyName: society?.SocietyName || "-" };
// });
// setHomes(mappedHomes);

//     } catch (err) {
//       console.error("Error fetching homes:", err);
//       setHomes([]);
//     }
//   };

    const fetchHomes = async () => {
        try {
          const res = await axios.get(API_URL);
          
          // map populated society name
          const mappedHomes = res.data.map((h) => {
            const society = societies.find(s => s._id === h.SocietyID);
            return { ...h, SocietyName: society?.SocietyName || "-" };
          });

          // Sort by HomeNumber (ascending)
          mappedHomes.sort((a, b) => {
            return Number(a.HomeNumber) - Number(b.HomeNumber);
          });

          setHomes(mappedHomes);
        } catch (err) {
          console.error("Error fetching homes:", err);
          setHomes([]);
        }
      };



  const fetchSocieties = async () => {
    try {
      const res = await axios.get(SOCIETY_API);
      setSocieties(res.data);
    } catch (err) {
      console.error("Error fetching societies:", err);
      setSocieties([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "HomeNumber" || name === "StreetNumber") {
    if (!/^\d*$/.test(value)) return; // ignore non-numeric input
    }

    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({
      ...prev,
      [name]: checked,
      // If unchecking rental, reset rent & tenant preferred
      ...(name === "IsRental" && !checked
        ? { Rent: 0, TenantPreferred: "" }
        : {}),
    }));
      // setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    // Validation for numbers only
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for duplicate home number in the same society
    const duplicate = homes.find(
      (h) =>
        h.HomeNumber === form.HomeNumber &&
        h.SocietyID === form.SocietyID &&
        h._id !== editingId // ignore current editing home
    );

    if (duplicate) {
      alert(`Home Number ${form.HomeNumber} already exists in this society!`);
      return;
    }

    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key] !== null) formData.append(key, form[key]);
      }
      if(!editingId){
        formData.append("Status", "Available");
      }
      // formData.append("Status", "Available");

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        HomePhoto: null,
        HomeNumber: "",
        StreetNumber: "",
        HomeSize: "",
        HomeType: "1BHK",
        Furnishing: "",
        IsRental: false,
        Rent: 0,
        TenantPreferred: "",
        SocietyID: "",
      });
      setEditingId(null);
      fetchHomes();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (home) => {
    setForm({
      HomePhoto: null, // file input
      ExistingPhoto: home.HomePhoto,
      HomeNumber: home.HomeNumber,
      StreetNumber: home.StreetNumber,
      HomeSize: home.HomeSize,
      HomeType: home.HomeType,
      Furnishing: home.Furnishing,
      IsRental: home.IsRental,
      Rent: home.Rent,
      TenantPreferred: home.TenantPreferred,
      SocietyID: home.SocietyID || "",
    });
    setEditingId(home._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this home?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchHomes();
      } catch (error) {
        console.error("Error deleting home:", error);
      }
    }
  };

  return (
    <div className="manage-homes-container">
      <h2>{editingId ? "Edit Home Details" : "Add New Home"}</h2>

      <form className="home-form" onSubmit={handleSubmit}>
        <input type="file" name="HomePhoto" onChange={handleChange}  />

        {form.ExistingPhoto && !form.HomePhoto && (
        <img
          src={
            form.ExistingPhoto.startsWith("http")
              ? form.ExistingPhoto
              : `http://localhost:5000/uploads/${form.ExistingPhoto}`
          }
          alt="Current Home"
          className="home-photo"
        />
      )}


        <input
        type="number"
          name="HomeNumber"
          placeholder="Home Number"
          value={form.HomeNumber}
          onChange={handleChange}
          required
          disabled={isLocked()}
        />
        <input
        type="number"
          name="StreetNumber"
          placeholder="Street Number"
          value={form.StreetNumber}
          onChange={handleChange}
          disabled={isLocked()}
        />
        <input
          name="HomeSize"
          placeholder="Home Size (e.g., 1200 sq.ft)"
          value={form.HomeSize}
          onChange={handleChange}
          disabled={isLocked()}
        />
        <select name="HomeType" value={form.HomeType} onChange={handleChange} disabled={isLocked()} required>
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
          <option value="3BHK">3BHK</option>
          <option value="4BHK">4BHK</option>
        </select>
        {/* <input
        type="text"
          name="Furnishing"
          placeholder="Furnishing (e.g., Fully Furnished)"
          value={form.Furnishing}
          onChange={handleChange}
        /> */}

        <select
          name="Furnishing"
          value={form.Furnishing}
          onChange={handleChange}
          required
          disabled={isLocked()}
        >
          <option value="">Select Furnishing</option>
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>

        <label className="checkbox-label">
          Rental:
          <input
            type="checkbox"
            name="IsRental"
            checked={form.IsRental}
            onChange={handleChange}
          />
        </label>

        {/* Show Rent & Tenant Preferred only if IsRental is checked */}
        {form.IsRental && (
          <>
           <label className="checkbox-label">
               Rent :
            <input
              type="number"
              name="Rent"
              placeholder="Rent Amount"
              value={form.Rent}
              onChange={handleChange}
              min={0}
              required
            />
           </label>
         
            <input
              name="TenantPreferred"
              placeholder="Tenant Preferred (e.g., Family)"
              value={form.TenantPreferred}
              onChange={handleChange}
            />
          </>
        )}

        <select
  name="SocietyID"
  value={form.SocietyID}
  onChange={handleChange}
  required
>
  <option value="">Select Society</option>
  {societies.map((s) => (
    <option key={s._id} value={s._id}>{s.SocietyName}</option>
  ))}
</select>


        <button type="submit">{editingId ? "Update Home" : "Add Home"}</button>
      </form>

      <h3>All Homes</h3>
      <table className="homes-table">
        <thead>
          {/* <tr>
            <th>Photo</th>
            <th>Home Number</th>
            <th>Street Number</th>
            <th>Type</th>
            <th>Society</th>
            <th>Status</th>
            <th>Rent</th>
            <th>Actions</th>
          </tr> */}

           <tr>
            <th>Photo</th>
            <th>Home Number</th>
            <th>Street Number</th>
            <th>Home Size</th>
            <th>Home Type</th>
            <th>Furnishing</th>
            <th>Rental</th>
            <th>Rent</th>
            <th>Tenant Preferred</th>
            {/* <th>Society</th> */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
  {homes.map((h) => (
    <tr key={h._id}>
      <td>
        {h.HomePhoto ? (
          <img
            src={h.HomePhoto?.startsWith("http")
              ? h.HomePhoto
              : `http://localhost:5000/uploads/${h.HomePhoto}`}
            alt="Home"
            className="home-photo"
          />
        ) : (
          "-"
        )}
      </td>
      <td>{h.HomeNumber}</td>
      <td>{h.StreetNumber}</td>
      <td>{h.HomeSize}</td>
      <td>{h.HomeType}</td>
      <td>{h.Furnishing}</td>
      <td>{h.IsRental ? "Yes" : "No"}</td>
      <td>{h.IsRental ? h.Rent : "-"}</td>
      <td>{h.TenantPreferred || "-"}</td>
      {/* <td>{h.SocietyName || "-"}</td> */}
      <td>
        <span
          className={
            h.Status === "Available" ? "status available" : "status occupied"
          }
        >
          {h.Status}
        </span>
      </td>
      
      <td>
        <button onClick={() => handleEdit(h)} className="edit-btn">
          Edit
        </button>
        {/* <button onClick={() => handleDelete(h._id)} className="delete-btn">
          Delete
        </button> */}
      </td>
    </tr>
  ))}
</tbody>



      </table>
      <style>{`
        .manage-homes-container { padding: 40px; font-family: 'Segoe UI', sans-serif; background: #f8f9fc; border-radius: 10px; }
        h2, h3 { color: #1a237e; margin-bottom: 20px; }
        .home-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; background: white; padding: 25px 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 40px; }
        .home-form input, .home-form select { padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; }
        .home-form input:focus, .home-form select:focus { border-color: #3f51b5; outline: none; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .home-form button { grid-column: 1 / -1; background: #3f51b5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background 0.2s ease; }
        .home-form button:hover { background: #283593; }
        .homes-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.1); }
        .homes-table th, .homes-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        .homes-table th { background: #3f51b5; color: white; }
        .home-photo { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; }
        .status { padding: 4px 10px; border-radius: 6px; font-weight: 600; color: white; }
        .status.available { background: #4caf50; }
        .status.occupied { background: #f44336; }
        .edit-btn, .delete-btn { border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: 500; }
        .edit-btn { background: #ff9800; color: white; margin-right: 5px; }
        .edit-btn:hover { background: #e68900; }
        .delete-btn { background: #f44336; color: white; }
        .delete-btn:hover { background: #d32f2f; }
      `}</style>
    </div>
  );
}
