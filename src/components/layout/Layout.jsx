// src/components/layout/Layout.jsx
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '10 min', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 1rem', backgroundColor: '#f8faf9' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Trackly
      </footer>
    </div>
  );
}