import React from "react";

export default function ContactUs() {
  const styles = {
    container: {
      marginLeft: "310px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Segoe UI, sans-serif",
      minHeight: "calc(90vh - 70px)",
      background: "#f5f7fa",
      padding: "2rem",
      width: "100%",
    },
    card: {
      background: "#fff",
      borderRadius: "20px",
      padding: "2.5rem",
      maxWidth: "600px",
      width: "100%",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      color: "#333",
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1877f2",
      marginBottom: "1rem",
    },
    subtitle: {
      fontSize: "1rem",
      color: "#555",
      marginBottom: "2rem",
    },
    infoItem: {
      fontSize: "1rem",
      marginBottom: "1rem",
      lineHeight: "1.6",
    },
    divider: {
      height: "1px",
      width: "80%",
      background: "#e0e0e0",
      margin: "1.5rem auto",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📞 Contact Us</h2>
        <p style={styles.subtitle}>
          We’d love to help! Reach out to us using the details below.
        </p>

        <div style={styles.infoItem}>
          <strong>🏘 Society Name:</strong><br />
          Subhas Park
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoItem}>
          <strong>📍 Address:</strong><br />
          Sartahana Jakatnaka,<br />
          Surat, Gujarat – 395006
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoItem}>
          <strong>👨‍💼 Admin Name:</strong><br />
          Admin (Male)
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoItem}>
          <strong>📧 Email:</strong><br />
          admin@gmail.com
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoItem}>
          <strong>📱 Phone:</strong><br />
          +91 98789 87878
        </div>

        <div style={styles.divider}></div>

        <div style={styles.infoItem}>
          <strong>🕒 Working Hours:</strong><br />
          Monday – Saturday: 9:00 AM – 6:00 PM
        </div>

        <div style={styles.divider}></div>

        
      </div>
    </div>
  );
}
