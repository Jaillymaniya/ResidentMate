
export default function About() {
  const styles = {
    page: {
      fontFamily: 'Segoe UI, sans-serif',
      color: '#2c3e50',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      marginLeft: '410px',
      marginTop: '15px',
    },
    container: {
      maxWidth: '800px',
      width: '100%',
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      boxSizing: 'border-box',
      justifyContent: 'center',
    },
    title: {
      fontSize: '2.5rem',
      textAlign: 'center',
      color: '#2980b9',
    },
    subtitle: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#555',
    },
    paragraph: {
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    highlight: {
      color: '#2980b9',
      fontWeight: '600',
    },
    
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.subtitle}>Empowering families with simple, secure, and beautiful homes</p>

        <p style={styles.paragraph}>
          <span style={styles.highlight}>Society Management</span> is a community-driven platform designed to simplify home rentals. Whether you're a family looking for a peaceful house or seeking reliable tenants, our portal bridges the gap with trust and transparency.
        </p>
        <p style={styles.paragraph}>
          We focus on showcasing <span style={styles.highlight}>houses</span> that are perfect for long-term living, offering comfort, affordability, and architectural charm.
        </p>
        <p style={styles.paragraph}>
          Built with modern web technologies and a user-first mindset, our goal is to make housing discovery as seamless as possible. We believe in <span style={styles.highlight}>clarity, simplicity</span>.
        </p>
        <p style={styles.paragraph}>
          Thank you for being part of our journey. Let’s build better neighborhoods together.
        </p>
        <p style={styles.paragraph}>
          Along with rental homes, we also manage <span style={styles.highlight}>society events</span> to bring communities together. 
          Our platform helps residents collaborate, celebrate, and stay connected through cultural programs, meetings, and special occasions.
        </p>
        <p style={styles.paragraph}>
          We also work on solving <span style={styles.highlight}>society-related problems</span> in a simple and transparent way. 
          From managing maintenance issues to handling community discussions, our system ensures smooth communication and quick resolutions.
        </p>
      </div>
      
    </div>
  );
}
