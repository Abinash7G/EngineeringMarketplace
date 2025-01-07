import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import `useLocation` correctly
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CompanyRegistration from './components/companyregistration';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const location = useLocation(); // Correct hook name
  const navbarRoutes = ["/", "/login", "/signup", "/companyregistration"];

  return (
    <>
      {navbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/companyregistration" element={<CompanyRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

const AppWithRouter = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWithRouter;
