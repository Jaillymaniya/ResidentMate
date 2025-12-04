import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageSocieties() {
  const [societies, setSocieties] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    SocietyName: "",
    Area: "",
    City: "",
    State: "",
    Pincode: "",  
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/societies";

  const fetchSocieties = async () => {
    try {
      const res = await axios.get(API_URL);
      setSocieties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSocieties(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingId) {
  //       await axios.put(`${API_URL}/${editingId}`, form);
  //     } else {
  //       await axios.post(API_URL, form);
  //     }
  //     setForm({ SocietyName: "", Area: "", City: "", State: "", Pincode: "" });
  //     setEditingId(null);
  //     fetchSocieties();
  //   } catch (err) { console.error(err); }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear old errors

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setForm({ SocietyName: "", Area: "", City: "", State: "", Pincode: "" });
      setEditingId(null);
      fetchSocieties();

    } catch (err) {
      if (err.response && err.response.data.message) {
        setErrorMsg(err.response.data.message);  // <-- Show backend message
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };


  const handleEdit = (soc) => {
    setForm(soc);
    setEditingId(soc._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchSocieties();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI" }}>
      <h2>{editingId ? "Edit Society" : "Add New Society"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input name="SocietyName" placeholder="Society Name" value={form.SocietyName} onChange={handleChange} required />
        <input name="Area" placeholder="Area" value={form.Area} onChange={handleChange} required />
        <input name="City" placeholder="City" value={form.City} onChange={handleChange} required />
        <input name="State" placeholder="State" value={form.State} onChange={handleChange} />
        <input name="Pincode" placeholder="Pincode" value={form.Pincode} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {errorMsg && (
          <div style={{
            color: "white",
            background: "#e41e3f",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontWeight: "600"
          }}>
            {errorMsg}
          </div>
        )}

      </form>

      <h3>All Societies</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th><th>Area</th><th>City</th><th>State</th><th>Pincode</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {societies.map(s => (
            <tr key={s._id}>
              <td>{s.SocietyName}</td>
              <td>{s.Area}</td>
              <td>{s.City}</td>
              <td>{s.State || "-"}</td>
              <td>{s.Pincode || "-"}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
  h2, h3 {
    color: #1a237e;
    margin-bottom: 15px;
  }

  form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    max-width: 600px;
  }

  form input {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    width: 90%;
    transition: border-color 0.2s;
  }

  form input:focus {
    border-color: #1a237e;
    outline: none;
  }

  form button {
    grid-column: 1 / -1;
    padding: 10px 25px;
    background: #3f51b5;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
    width: 96%;
  }

  form button:hover {
    background: #1a237e;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }

  table th, table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 0.95rem;
  }

  table th {
    background: #3f51b5;
    color: #fff;
    font-weight: 600;
  }

  button.edit-btn, button.delete-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    margin-right: 5px;
  }

  button.edit-btn {
    background: #ffb400;
    color: #fff;
  }

  button.edit-btn:hover {
    background: #e09e00;
  }

  button.delete-btn {
    background: #e41e3f;
    color: #fff;
  }

  button.delete-btn:hover {
    background: #c10f1a;
  }
`}</style>

    </div>
  );
}
