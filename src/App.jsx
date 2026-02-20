// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals'; // ← اضافه شد

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/goals" element={<Layout><Goals /></Layout>} /> {/* ← اضافه شد */}
      </Routes>
    </BrowserRouter>
  );
}