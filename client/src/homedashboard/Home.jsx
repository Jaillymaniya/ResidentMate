// import React from 'react';
// import './home.css';

// export default function Home() {
//   return (
//     <>
//       <section className="row-gallery">
//         <h1 className="site-title">Welcome to Society Management System</h1>
//         <p className="site-subtitle">Browse simple Indian row houses perfect for families and rentals.</p>
//         <div className="row-cards">
//          </div>
//         </div>
//       </section>


//       <section className="features">
//   <h2>Key Features of Society Management</h2>
//   <div className="cards">
//     <div className="card">
//       <h3>Member Management</h3>
//       <p>Maintain records of all society members, their houses, and contact details.</p>
//     </div>
//     <div className="card">
//       <h3>Maintenance Tracking</h3>
//       <p>Generate and manage monthly/annual maintenance bills and doing payments easily.</p>
//     </div>
//     <div className="card">
//       <h3>Event & Hall Booking</h3>
//       <p>Allow members to book society halls, gardens, or common spaces for events and activities.</p>
//     </div>
//     <div className="card">
//       <h3>Complaint & Feedback</h3>
//       <p>Residents can submit complaints, suggestions, and feedback for better society governance.</p>
//     </div>
//     <div className="card">
//       <h3>Notice Board</h3>
//       <p>Share important updates, circulars, and announcements digitally with all members.</p>
//     </div>

//   </div>
// </section>


//     </>
//   );
// }


import React from "react";
import "./Home.css";
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to Society Management System</h1>
          <p className="hero-subtitle">
            Manage your society efficiently — maintenance, bookings, members and
            more. Experience hassle-free community management.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started →</button>
            {/* <button className="btn-outline"><Link to="/login"><LogIn size={17} /> Login</Link></button> */}
            <Link to="/login" className="btn-outline">
              <LogIn size={17} /> Login
            </Link>

          </div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ----------------
      <section className="features">
        <h2>Key Features of Society Management</h2>

        <div className="cards">
          <div className="card">
            <h3>Member Management</h3>
            <p>
              Maintain records of all society members, their houses, and contact
              details.
            </p>
          </div>

          <div className="card">
            <h3>Maintenance Tracking</h3>
            <p>
              Generate and manage monthly maintenance bills and payments
              effortlessly.
            </p>
          </div>

          <div className="card">
            <h3>Event & Hall Booking</h3>
            <p>
              Members can book halls, gardens or common spaces for events.
            </p>
          </div>

          <div className="card">
            <h3>Complaint & Feedback</h3>
            <p>Residents can raise complaints and suggestions easily.</p>
          </div>

          <div className="card">
            <h3>Digital Notice Board</h3>
            <p>Share important announcements with residents instantly.</p>
          </div>
        </div>
      </section> */}

      {/* ---------------- ROW HOUSE SECTION ---------------- */}
      <section className="rowhouse-section">
        <h2 className="section-title">
          Explore our range of beautifully designed row houses,
          perfect for modern family living
        </h2>

        <div className="rowhouse-cards">

          {/* Card 1 */}
          <div className="rowhouse-card">
            <div className="card-img">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdbLqIfwfPmCCES6l3095uwyjNKR5gCnIb3BBTxZxZvIrWQ6adHjsvv-QXH1q8_awqeec&usqp=CAU" alt="" />
              <span className="card-badge">📍 </span>
            </div>

            <div className="card-body">
              <h3>🏠 Simple 1BHK Row House</h3>
              <p>Perfect for small families with modern amenities and spacious interiors</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rowhouse-card">
            <div className="card-img">
              <img src="https://i.ytimg.com/vi/cHRjKNePdtQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB6OShXvYAEJGlw-28RJ4tUkmRNEA" alt="" />
              <span className="card-badge">📍 </span>
            </div>

            <div className="card-body">
              <h3>🏠 Modern 2BHK Row House</h3>
              <p>Spacious family home with contemporary design and premium finishes</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rowhouse-card">
            <div className="card-img">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80" alt="" />
              <span className="card-badge">📍 </span>
            </div>

            <div className="card-body">
              <h3>🏠 Luxury 3BHK Houses</h3>
              <p>Premium living space with elegant architecture and modern facilities</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rowhouse-card">
            <div className="card-img">
              <img src="https://i.pinimg.com/736x/ff/e6/d3/ffe6d32f5f81a6fffcf8f3842fb17de2.jpg" alt="" />
              <span className="card-badge">📍 </span>
            </div>

            <div className="card-body">
              <h3>🏠 Luxury 4BHK Houses</h3>
              <p>Premium living space with full family Luxury architecture and customize options</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rowhouse-card">
            <div className="card-img">
              <img src="https://i.ytimg.com/vi/cHRjKNePdtQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB6OShXvYAEJGlw-28RJ4tUkmRNEA" alt="" />
              <span className="card-badge">📍 </span>
            </div>

            <div className="card-body">
              <h3>🏠 Modern 2BHK Row House</h3>
              <p>Spacious family home with contemporary design and premium finishes</p>
            </div>
          </div>


        </div>
      </section>

      {/* ---------------- KEY FEATURES ---------------- */}
      <section className="features-modern">
        <h2>Key Features of Society Management</h2>
        <p className="subtext">
          Powerful tools designed to make community management effortless and efficient
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="icon blue">$</div>
            <h3>Maintenance Payment Tracking</h3>
            <p>Manage all maintenance payments with automated reminders.</p>
          </div>

          <div className="feature-card">
            <div className="icon green">📅</div>
            <h3>Hall / Facility Booking</h3>
            <p>Book community halls and facilities with real-time availability.</p>
          </div>

          <div className="feature-card">
            <div className="icon purple">👥</div>
            <h3>Member Directory</h3>
            <p>Comprehensive resident details with unit information.</p>
          </div>

          <div className="feature-card">
            <div className="icon pink">💬</div>
            <h3>Complaint & Feedback</h3>
            <p>Track and resolve complaints with transparency.</p>
          </div>

        </div>
      </section>


    </>
  );
}
