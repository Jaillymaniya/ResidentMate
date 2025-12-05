import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageHomes() {
  const [homes, setHomes] = useState([]);
  const [streets, setStreets] = useState([]);
  const [form, setForm] = useState({
    HomePhoto: null,
    HomeNumber: "",
    Furnishing: "",
    IsRental: false,
    Rent: "",
    TenantPreferred: "",
    StreetID: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/homes";
  const STREET_API = "http://localhost:5000/api/streets";

  const isLocked = () => {
    const home = homes.find(h => h._id === editingId);
    return home && home.Status === "Occupied";
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Load all data
  const loadAllData = async () => {
    try {
      // Fetch streets
      const streetsRes = await axios.get(STREET_API);
      const streetList = streetsRes.data.data || [];
      setStreets(streetList);
      
      // Fetch homes
      const homesRes = await axios.get(API_URL);
      
      // Map homes with street data
      const mappedHomes = homesRes.data.map((h) => {
        const street = streetList.find(s => s._id === h.StreetID);
        return { 
          ...h, 
          StreetNumber: street?.streetNumber || "-"
        };
      });

      // Sort by HomeNumber (continuous across all streets)
      mappedHomes.sort((a, b) => {
        return Number(a.HomeNumber) - Number(b.HomeNumber);
      });

      setHomes(mappedHomes);
      
    } catch (err) {
      console.error("Error loading data:", err);
      setHomes([]);
      setStreets([]);
    }
  };

  // Calculate total homes that can be in each street based on capacity
  const calculateStreetRanges = () => {
    if (streets.length === 0) return [];
    
    // Sort streets by streetNumber
    const sortedStreets = [...streets].sort((a, b) => 
      a.streetNumber.localeCompare(b.streetNumber, undefined, { numeric: true })
    );
    
    let startNumber = 1;
    const ranges = [];
    
    for (const street of sortedStreets) {
      const endNumber = startNumber + street.totalHome - 1;
      ranges.push({
        streetId: street._id,
        streetNumber: street.streetNumber,
        totalHome: street.totalHome,
        startNumber,
        endNumber,
        capacity: street.totalHome
      });
      startNumber = endNumber + 1;
    }
    
    return ranges;
  };

  // Get next home number (continuous across all streets)
  const getNextHomeNumber = () => {
    if (homes.length === 0) return "1";
    
    // Get all home numbers and convert to numbers
    const homeNumbers = homes
      .map(h => parseInt(h.HomeNumber))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);
    
    // Find first missing number
    for (let i = 1; i <= homeNumbers.length + 1; i++) {
      if (!homeNumbers.includes(i)) {
        return i.toString();
      }
    }
    
    // If no missing numbers, return next number
    return (homeNumbers.length + 1).toString();
  };

  // Get street for a specific home number
  const getStreetForHomeNumber = (homeNumber) => {
    const ranges = calculateStreetRanges();
    const num = parseInt(homeNumber);
    
    for (const range of ranges) {
      if (num >= range.startNumber && num <= range.endNumber) {
        return range.streetId;
      }
    }
    
    // If home number exceeds all ranges, return first street
    return ranges[0]?.streetId || "";
  };

  // Get next available street and home number
  const getNextAvailable = () => {
    const ranges = calculateStreetRanges();
    if (ranges.length === 0) return { streetId: "", homeNumber: "1" };
    
    // Get all existing home numbers
    const existingHomeNumbers = homes
      .map(h => parseInt(h.HomeNumber))
      .filter(num => !isNaN(num));
    
    // Find first missing number
    for (let i = 1; i <= ranges[ranges.length - 1].endNumber; i++) {
      if (!existingHomeNumbers.includes(i)) {
        // Find which street this number belongs to
        for (const range of ranges) {
          if (i >= range.startNumber && i <= range.endNumber) {
            // Check if this street has capacity
            const homesInThisStreet = homes.filter(h => h.StreetID === range.streetId);
            if (homesInThisStreet.length < range.capacity) {
              return { streetId: range.streetId, homeNumber: i.toString() };
            }
          }
        }
      }
    }
    
    // If no missing numbers, find next available in any street
    for (const range of ranges) {
      const homesInThisStreet = homes.filter(h => h.StreetID === range.streetId);
      if (homesInThisStreet.length < range.capacity) {
        // Find next available number in this street's range
        const streetHomeNumbers = homesInThisStreet
          .map(h => parseInt(h.HomeNumber))
          .filter(num => !isNaN(num));
        
        for (let i = range.startNumber; i <= range.endNumber; i++) {
          if (!streetHomeNumbers.includes(i)) {
            return { streetId: range.streetId, homeNumber: i.toString() };
          }
        }
      }
    }
    
    // All streets are full
    return { streetId: ranges[0].streetId, homeNumber: "1" };
  };

  // Auto-fill form when page loads
  useEffect(() => {
    if (!editingId && streets.length > 0) {
      const { streetId, homeNumber } = getNextAvailable();
      
      // Auto-fill the form
      setForm(prev => ({
        ...prev,
        StreetID: streetId,
        HomeNumber: homeNumber
      }));
    }
  }, [streets, editingId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "HomeNumber") {
      // Allow only numbers
      if (!/^\d*$/.test(value)) return;
      
      // Update StreetID based on home number
      if (value && !editingId) {
        const streetId = getStreetForHomeNumber(value);
        setForm(prev => ({
          ...prev,
          [name]: value,
          StreetID: streetId
        }));
        return;
      }
    }

    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "IsRental" && !checked
          ? { Rent: 0, TenantPreferred: "" }
          : {}),
      }));
    } else if (name === "StreetID") {
      // When street changes, keep current home number if it's valid for new street
      const ranges = calculateStreetRanges();
      const selectedRange = ranges.find(r => r.streetId === value);
      
      if (selectedRange) {
        const currentHomeNum = parseInt(form.HomeNumber);
        let newHomeNumber = form.HomeNumber;
        
        // If current home number is outside new street's range, use first available
        if (currentHomeNum < selectedRange.startNumber || currentHomeNum > selectedRange.endNumber) {
          const homesInStreet = homes.filter(h => h.StreetID === value);
          const streetHomeNumbers = homesInStreet.map(h => parseInt(h.HomeNumber));
          
          for (let i = selectedRange.startNumber; i <= selectedRange.endNumber; i++) {
            if (!streetHomeNumbers.includes(i)) {
              newHomeNumber = i.toString();
              break;
            }
          }
        }
        
        setForm(prev => ({
          ...prev,
          [name]: value,
          HomeNumber: newHomeNumber
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic validations
    if (!form.HomeNumber.trim()) {
      alert("Home Number is required!");
      return;
    }
    
    if (!form.Furnishing.trim()) {
      alert("Furnishing type is required!");
      return;
    }
    
    if (!form.StreetID) {
      alert("Please select a street!");
      return;
    }

      // 2. File validation (if editing and no existing photo, require new photo)
    if (!editingId && !form.HomePhoto && !form.ExistingPhoto) {
      alert("Please upload a home photo!");
      return;
    }

     // 3. Rental-specific validations
  if (form.IsRental) {
    // Validate Rent field
    if (!form.Rent.trim()) {
      alert("Rent amount is required for rental homes!");
      return;
    }
    
    const rentAmount = parseFloat(form.Rent);
    if (isNaN(rentAmount) || rentAmount <= 0) {
      alert("Please enter a valid rent amount (greater than 0)!");
      return;
    }
    
    if (rentAmount > 1000000) { // Reasonable upper limit
      alert("Rent amount seems too high. Please enter a reasonable amount!");
      return;
    }
    
    // Validate Tenant Preferred (optional but good to have)
    if (!form.TenantPreferred.trim()) {
      const shouldProceed = window.confirm(
        "Tenant Preferred field is empty. Do you want to proceed without specifying tenant preference?"
      );
      if (!shouldProceed) return;
    }
  } else {
    // If not rental, clear rent and tenant preferred
    setForm(prev => ({ ...prev, Rent: "", TenantPreferred: "" }));
  }
    
    // Check for duplicate home number
    const duplicate = homes.find(
      (h) =>
        h.HomeNumber === form.HomeNumber &&
        h._id !== editingId
    );

    if (duplicate) {
      alert(`Home Number ${form.HomeNumber} already exists!`);
      return;
    }

    // Check if home number is valid for selected street
    const ranges = calculateStreetRanges();
    const selectedRange = ranges.find(r => r.streetId === form.StreetID);
    const homeNum = parseInt(form.HomeNumber);
    
    if (selectedRange && (homeNum < selectedRange.startNumber || homeNum > selectedRange.endNumber)) {
      alert(`Home number ${form.HomeNumber} is not valid for Street ${selectedRange.streetNumber}. Valid range: ${selectedRange.startNumber} to ${selectedRange.endNumber}`);
      return;
    }

    // Check street capacity
    const homesInStreet = homes.filter(h => h.StreetID === form.StreetID).length;
    const selectedStreet = streets.find(s => s._id === form.StreetID);

    if (!editingId && selectedStreet && homesInStreet >= selectedStreet.totalHome) {
      // Find next available
      const { streetId, homeNumber } = getNextAvailable();
      const nextStreet = streets.find(s => s._id === streetId);
      
      if (window.confirm(
        `Street ${selectedStreet.streetNumber} is full (${selectedStreet.totalHome} homes). ` +
        `Would you like to add to Street ${nextStreet?.streetNumber || "next available"} with Home #${homeNumber} instead?`
      )) {
        setForm(prev => ({
          ...prev,
          StreetID: streetId,
          HomeNumber: homeNumber
        }));
        return;
      } else {
        alert(`Street ${selectedStreet.streetNumber} allows only ${selectedStreet.totalHome} homes.`);
        return;
      }
    }

    // 7. Furnishing validation (specific allowed values)
  const allowedFurnishing = ["fully furnished", "semi furnished", "unfurnished"];
  const furnishingLower = form.Furnishing.toLowerCase().trim();
  
  if (!allowedFurnishing.includes(furnishingLower)) {
    const shouldProceed = window.confirm(
      `"${form.Furnishing}" is not a standard furnishing type. Standard types are: Fully Furnished, Semi Furnished, Unfurnished.\nDo you want to proceed anyway?`
    );
    if (!shouldProceed) return;
  }

    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key] !== null) formData.append(key, form[key]);
      }

      if (form.IsRental && form.Rent) {
      formData.set("Rent", parseFloat(form.Rent));
    }
      
      if (!editingId) {
        formData.append("Status", "Available");
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Reset form and get next available
      const { streetId, homeNumber } = getNextAvailable();
      setForm({
        HomePhoto: null,
        ExistingPhoto: null,
        HomeNumber: homeNumber,
        Furnishing: "",
        IsRental: false,
        Rent: 0,
        TenantPreferred: "",
        StreetID: streetId,
      });
      setEditingId(null);
      
      // Refresh data
      loadAllData();
      
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (home) => {
    setForm({
      HomePhoto: null,
      ExistingPhoto: home.HomePhoto,
      HomeNumber: home.HomeNumber,
      Furnishing: home.Furnishing,
      IsRental: home.IsRental,
      Rent: home.Rent,
      TenantPreferred: home.TenantPreferred,
      StreetID: home.StreetID || "",
    });
    setEditingId(home._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this home?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        loadAllData();
      } catch (error) {
        console.error("Error deleting home:", error);
      }
    }
  };

  // Get street info for display
  const getStreetInfo = (streetId) => {
    const street = streets.find(s => s._id === streetId);
    if (!street) return { name: "-", capacity: 0, used: 0 };
    
    const homesInStreet = homes.filter(h => h.StreetID === streetId);
    return {
      name: street.streetNumber,
      capacity: street.totalHome,
      used: homesInStreet.length,
      available: street.totalHome - homesInStreet.length
    };
  };

  // Get valid home number range for current street
  const getHomeNumberRange = (streetId) => {
    const ranges = calculateStreetRanges();
    const range = ranges.find(r => r.streetId === streetId);
    if (!range) return { min: 1, max: 100 };
    return { min: range.startNumber, max: range.endNumber };
  };

  const currentStreetInfo = getStreetInfo(form.StreetID);
  const homeNumberRange = getHomeNumberRange(form.StreetID);

  return (
    <div className="manage-homes-container">
      <h2>{editingId ? "Edit Home Details" : "Add New Home"}</h2>

      <form className="home-form" onSubmit={handleSubmit}>
        <input type="file" name="HomePhoto" onChange={handleChange} />

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

        <div className="form-group">
          <input
            type="number"
            name="HomeNumber"
            placeholder="Home Number"
            value={form.HomeNumber}
            onChange={handleChange}
            required
            disabled={isLocked()}
            min={homeNumberRange.min}
            max={homeNumberRange.max}
          />
          {form.StreetID && (
            <small className="capacity-info">
              Valid range for Street {currentStreetInfo.name}: {homeNumberRange.min} to {homeNumberRange.max}
            </small>
          )}
        </div>

        <input
          type="text"
          name="Furnishing"
          placeholder="Furnishing"
          value={form.Furnishing}
          onChange={handleChange}
          required
        />

        <label className="checkbox-label">
          Rental:
          <input
            type="checkbox"
            name="IsRental"
            checked={form.IsRental}
            onChange={handleChange}
          />
        </label>

        {form.IsRental && (
          <>
            <label className="checkbox-label">
            Rent:*
            <input
              type="number"
              name="Rent"
              placeholder="Rent Amount (required)"
              value={form.Rent}
              onChange={handleChange}
              min="1"
              max="1000000"
              required={form.IsRental}
              style={{ borderColor: form.IsRental && !form.Rent ? 'red' : '' }}
            />
          </label>

          {form.IsRental && !form.Rent && (
      <small className="error-text" style={{ color: 'red', fontSize: '12px' }}>
        Rent amount is required for rental homes
      </small>
    )}

            <div className="form-group">
      <label>Tenant Preferred:</label>
      <input
        name="TenantPreferred"
        placeholder="e.g., Family, Bachelors, Couple"
        value={form.TenantPreferred}
        onChange={handleChange}
      />
      <small className="helper-text">
        Optional but recommended
      </small>
    </div>
          </>
        )}

        <div className="form-group">
          <select
            name="StreetID"
            value={form.StreetID}
            onChange={handleChange}
            required
          >
            <option value="">Select Street</option>
            {streets.map((s) => {
              const streetHomes = homes.filter(h => h.StreetID === s._id);
              const isFull = streetHomes.length >= s.totalHome;
              return (
                <option 
                  key={s._id} 
                  value={s._id}
                  disabled={isFull && !editingId}
                >
                  {s.streetNumber} ({streetHomes.length}/{s.totalHome} homes)
                  {isFull ? " - FULL" : ""}
                </option>
              );
            })}
          </select>
          {form.StreetID && currentStreetInfo.available <= 0 && !editingId && (
            <small className="warning-text">
              ⚠️ This street is full. Consider selecting another street.
            </small>
          )}
        </div>

        <button type="submit">{editingId ? "Update Home" : "Add Home"}</button>
      </form>

      <h3>All Homes (Continuous Numbering Across Streets)</h3>
      
      {/* Show street ranges */}
      <div className="street-ranges">
        <h4>Street Number Ranges:</h4>
        {calculateStreetRanges().map((range) => (
          <div key={range.streetId} className="range-item">
            <strong>Street {range.streetNumber}:</strong> Homes {range.startNumber} to {range.endNumber} 
            ({range.capacity} homes capacity)
          </div>
        ))}
      </div>

      <table className="homes-table">
        <thead>
          <tr>
            <th>Home #</th>
            <th>Photo</th>
            <th>Furnishing</th>
            <th>Rental</th>
            <th>Rent</th>
            <th>Tenant Preferred</th>
            <th>Street</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {homes.map((h) => (
            <tr key={h._id}>
              <td><strong>{h.HomeNumber}</strong></td>
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
              <td>{h.Furnishing}</td>
              <td>{h.IsRental ? "Yes" : "No"}</td>
              <td>{h.IsRental ? h.Rent : "-"}</td>
              <td>{h.TenantPreferred || "-"}</td>
              <td>{h.StreetNumber || "-"}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style>{`
        .manage-homes-container { padding: 40px; font-family: 'Segoe UI', sans-serif; background: #f8f9fc; border-radius: 10px; }
        h2, h3, h4 { color: #1a237e; margin-bottom: 20px; }
        .home-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; background: white; padding: 25px 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 40px; }
        .home-form input, .home-form select { padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; }
        .home-form input:focus, .home-form select:focus { border-color: #3f51b5; outline: none; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .home-form button { grid-column: 1 / -1; background: #3f51b5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background 0.2s ease; }
        .home-form button:hover { background: #283593; }
        .street-ranges { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .range-item { margin-bottom: 8px; padding: 8px; background: #f5f7ff; border-radius: 6px; }
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
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .capacity-info { font-size: 12px; color: #666; }
        .warning-text { font-size: 12px; color: #f44336; }
        .error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 2px;
}
        select option:disabled { color: #999; background-color: #f5f5f5; }
      `}</style>
    </div>
  );
}