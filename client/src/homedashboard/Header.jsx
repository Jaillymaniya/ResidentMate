
import { Link } from 'react-router-dom';

export default function Header() {
  const styles = {
    header: {
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#ffffffff',
      color: 'black',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      overflowX: 'hidden',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
    nav: {
      listStyle: 'none',
      display: 'flex',
      gap: '1rem',
      margin: 0,
      padding: 0,
      flexWrap: 'wrap',
    },
    link: {
      // color: 'white',
      textDecoration: 'none',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      color: 'black',
    },
    spacer: {
      height: '80px', // Adjust based on header height
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logo}>🏠 ResidentMate</div>
        <nav>
       

            <ul style={styles.nav}>
            <li><Link to="/" style={styles.link}>Home</Link></li>
            <li><Link to="/rental-properties" style={styles.link}>Rental Properties</Link></li>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            {/* <li><Link to="/register" style={styles.link}>Register</Link></li> */}
            <li><Link to="/contactus" style={styles.link}>Contact</Link></li>
             <li><Link to="/about" style={styles.link}>About Us</Link></li>
            </ul>
        </nav>
      </header>
      <div style={styles.spacer}></div>
    </>
  );
}