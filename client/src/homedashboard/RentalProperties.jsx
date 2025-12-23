import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function RentalProperties() {
  const [homes, setHomes] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [bhk, setBhk] = useState("");
  const [furnish, setFurnish] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/homes/rental`)
      .then(res => res.json())
      .then(data => setHomes(data))
      .catch(err => {
        setHomes([]);
        console.error("Failed to fetch rental homes:", err);
      });

    fetch(`${API_BASE}/api/appointments/accepted`)
      .then(res => res.json())
      .then(data => setAccepted(data))
      .catch(() => setAccepted([]));
  }, []);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }
    fetch(`${API_BASE}/api/appointments/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, homeId: selectedHome._id })
    }).then(res => res.json()).then(result => {
      if (result.success) {
        alert("Appointment Requested!");
        setShowForm(false);
        setForm({ name: "", email: "", phone: "" });
      } else {
        alert(result.message || "Error");
      }
    });
  }

  const acceptedHomeIds = new Set(
    accepted.map(a => a.AssignID?.HomeID?._id?.toString())
  );

  // const filteredHomes = homes.filter(h =>
  //   (bhk ? h.HomeType === bhk : true) &&
  //   (furnish ? h.Furnishing.toLowerCase() === furnish.toLowerCase() : true) &&
  //   !acceptedHomeIds.has(h._id?.toString())
  // );
  const filteredHomes = homes.filter(h =>
    (bhk ? h.StreetID?.type === bhk : true) &&
    (furnish ? h.Furnishing.toLowerCase() === furnish.toLowerCase() : true) &&
    !acceptedHomeIds.has(h._id?.toString())
  );


  return (
    <div className="rental-container">
      {/* Hero Section */}
      <div className="rental-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Home</h1>
          <p className="hero-subtitle">Discover perfect rental properties tailored to your lifestyle</p>
        </div>
        <div className="rental-hero-background"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h2 className="section-title">Available Rental Homes</h2>

          {/* Fixed Filter Bar */}
          <div className="filter-container">
            <div className="filter-bar">
              <div className="filter-group">
                <label className="filter-label">Home Type</label>
                <select value={bhk} onChange={e => setBhk(e.target.value)} className="filter-select">
                  <option value="">All</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Furnishing</label>
                <select value={furnish} onChange={e => setFurnish(e.target.value)} className="filter-select">
                  <option value="">All</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi Furnished">Semi Furnished</option>
                </select>
              </div>

              <div className="results-count">
                {filteredHomes.length} {filteredHomes.length === 1 ? 'Property' : 'Properties'} Found
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredHomes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No Properties Available</h3>
              <p>Try adjusting your filters to see more options</p>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredHomes.map((home, idx) => (
                <div className="property-card" key={idx}>
                  <div className="property-image">
                    {home.HomePhoto ? (
                      <img src={home.HomePhoto} alt="Home" className="property-img" />
                    ) : (
                      <div className="property-placeholder">
                        <span className="placeholder-icon">🏡</span>
                      </div>
                    )}
                    <div className="property-badge">{home.HomeType}</div>
                  </div>

                  <div className="property-content">
                    <div className="property-header">
                      <h3 className="property-name">
                        {home.StreetID?.streetNumber || "N/A"} - Home number : {home.HomeNumber}
                      </h3>
                      <div className="property-price">₹{home.Rent}/month</div>
                    </div>

                    <div className="property-details">
                      <div className="detail-item">
                        <span className="detail-icon">📐</span>
                        <span>{home.HomeSize}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🛋️</span>
                        <span>Furnishing : {home.Furnishing}</span>
                      </div>
                    </div>

                    <div className="property-features">
                      <span className="feature-tag">{home.StreetID?.type}</span>
                      <span className="feature-tag">Home area : {home.StreetID?.homeArea} sqft</span>
                    </div>

                    <button
                      className="cta-button"
                      onClick={() => {
                        setSelectedHome(home);
                        setShowForm(true);
                      }}
                    >
                      <span className="button-icon">📅</span>
                      Request Viewing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule Viewing</h3>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <div className="property-preview">
              <div className="preview-image">
                {selectedHome?.HomePhoto ? (
                  <img src={selectedHome.HomePhoto} alt="Home" />
                ) : (
                  <div className="preview-placeholder">🏡</div>
                )}
              </div>
              <div className="preview-info">
                <h4>{selectedHome?.SocietyID?.SocietyName} : {selectedHome?.HomeNumber}</h4>
                <p>{selectedHome?.HomeType} • {selectedHome?.HomeSize} sqft • {selectedHome?.Furnishing}</p>
                <div className="preview-price">₹{selectedHome?.Rent}/month</div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="appointment-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  required
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  required
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  <span className="button-icon">📅</span>
                  Schedule Appointment
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        
        .rental-container {
        width: 100%;
        }

        /* Hero Section */
        .rental-hero-section {
          position: relative;
           height: 300px;
          width: 100%;
          // background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0n6tOtVq-z6q4TMSXqQbHWrJL_Zg4BptC4w&s");
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(137, 148, 199, 0.9) 0%, rgba(147, 115, 181, 0.9) 100%),
                      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,1000 1000,0 1000,1000"/></svg>');
          background-size: cover;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          font-weight: 300;
        }

        /* Main Content */
        .main-content {
          background: #f8fafc;
          border-radius: 40px 40px 0 0;
          margin-top: -40px;
          position: relative;
          min-height: calc(100vh - 260px);
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        /* Filter Container */
        .filter-container {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          position: sticky;
          top: 20px;
          z-index: 100;
        }

        .filter-bar {
          display: flex;
          align-items: end;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          color: #2d3748;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .results-count {
          background: #667eea;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Properties Grid */
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .property-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .property-image {
          position: relative;
          height: 250px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          overflow: hidden;
        }

        .property-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-img {
          transform: scale(1.05);
        }

        .property-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .placeholder-icon {
          font-size: 4rem;
          opacity: 0.7;
        }

        .property-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255,255,255,0.95);
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.8rem;
          backdrop-filter: blur(10px);
        }

        .property-content {
          padding: 1.5rem;
        }

        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .property-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          flex: 1;
        }

        .property-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          white-space: nowrap;
        }

        .property-details {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .detail-icon {
          font-size: 1rem;
        }

        .property-features {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .feature-tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .cta-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .button-icon {
          font-size: 1.1rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .modal-header {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          font-size: 1.5rem;
          color: #2d3748;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #2d3748;
        }

        .property-preview {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .preview-image {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-placeholder {
          width: 100%;
          height: 100%;
          background: #edf2f7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .preview-info {
          flex: 1;
        }

        .preview-info h4 {
          font-size: 1.1rem;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .preview-info p {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .preview-price {
          font-size: 1.2rem;
          font-weight: 600;
          color: #667eea;
        }

        .appointment-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
        }

        .form-input {
          width: 95%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .submit-button {
          flex: 2;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .cancel-button {
          flex: 1;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background: #cbd5e0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .filter-bar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .filter-group {
            min-width: 100%;
          }
          
          .properties-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .content-wrapper {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}