import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import `useLocation` correctly
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CompanyRegistration from './components/companyregistration';
import AdminDashboard from './pages/AdminDashboard';
import EmailConfirmation from "./components/EmailConfirmation";
import ViewCompanyDetails from "./components/ViewCompanyDetails";
import CompanyDashboard from './pages/CompanyDashboard';
import ClientDashboard from './pages/ClientDashboard';
import RestPasswordView from './pages/RestPassswordView';
import ClientProfile from './pages/ClientProfile';
const App = () => {
  const location = useLocation(); // Correct hook name
  const navbarRoutes = ["/","/home", "/login", "/signup", "/companyregistration"];

  return (
    <>
      {navbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
      <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/companyregistration" element={<CompanyRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/confirm-email/:token" element={<EmailConfirmation />} />
        <Route path="/view-company-details/:id" element={<ViewCompanyDetails />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/restpasswordview/:token" element={<RestPasswordView/>} />
        <Route path="/client/client-profile" element={<ClientProfile/>} />

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
