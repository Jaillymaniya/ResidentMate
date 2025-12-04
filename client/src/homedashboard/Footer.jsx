
// export default function Footer() {
//   const styles = {
//     footer: {
//       position: 'relative', // ensures it stays in flow
//       width: '100%',        // full viewport width
//       maxWidth: '100%',      // prevents overflow
//       boxSizing: 'border-box',
//       backgroundColor: '#2c3e50',
//       color: 'white',
//       textAlign: 'center',
//       // padding: '1rem 2rem',
//       fontFamily: 'Segoe UI, sans-serif',
//       fontSize: '0.95rem',
//       marginTop: 'auto',
//       overflowX: 'hidden',
//     }
//   };

//   return (
//     <footer style={styles.footer}>
//       <p>&copy; 2025 Society Management System | Made with ❤️ in Gujarat</p>
//     </footer>
//   );
// }


export default function Footer() {
  const styles = {
    footer: {
      position: "fixed",      // stays at bottom
      bottom: 0,
      left: 0,
      width: "100%",          // spans full width
      backgroundColor: "#2c3e50",
      color: "white",
      textAlign: "center",
      // padding: "1rem 2rem",
      fontFamily: "Segoe UI, sans-serif",
      fontSize: "0.95rem",
      boxSizing: "border-box",
      zIndex: 1000,

    },
  };

  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 Society Management System | Made with ❤️ in Gujarat</p>
    </footer>
  );
}
