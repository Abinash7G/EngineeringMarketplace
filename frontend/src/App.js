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
import ClientNavbar from './components/ClientNavbar';
import CDProduct from './components/CDProduct';
import CDCompany from './components/CDCompany';
import CDBanner from './components/CDBanner';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import CDCheckoutForm from './components/CDCheckoutForm';
import Appointments from './components/Appointments';
import Documents from './components/Documents';
import ServicesManagement from './components/ServicesManagement';
import MaterialsManagement from './components/MaterialsManagement';
import ProfileSettings from './components/ProfileSettings';
import CompanyDetails from './components/CompanyDetails';
//import Esewa from './pages/Esewa';
import KhaltiButton from './components/KhaltiButton';
//import PaymentSuccess from './components/PaymentSuccess';
//import KhaltiPayment from './components/KhaltiPayment';
import ApprovedCompanies from './components/ApprovedCompanies';
import RejectedCompanies  from './components/RejectedCompanies';
import CDRentVerificationform from './components/CDRentVerificationform';
import RentVerificationAdmin from './components/RentVerificationAdmin';
import CDConsultingInquiryForm from './components/CDConsultingInquiryForm';
import InquiriesList from './components/InquiriesList';




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
        <Route path="/ClientNavBar" element={<ClientNavbar/>} />
        <Route path="/CDproduct" element={<CDProduct/>} />
        <Route path="/CDCompany" element={<CDCompany/>} />
        <Route path="/CDBanner" element={<CDBanner/>} />
        <Route path="/client/cart" element={<Cart/>}/>
        <Route path="/client/wishlist" element={<Wishlist/>} />
        <Route path="/upload-kyc" element={<CDRentVerificationform/>}/>

        
        <Route path="/checkout" element={<CDCheckoutForm/>}/>
        <Route path="/appointments" element={<Appointments/>} />
        <Route path="/documents" element={<Documents/>} />
        <Route path="/services-management" element={<ServicesManagement/>} />
        <Route path="/materials-management" element={<MaterialsManagement/>} />
        <Route path="/profile-settings" element={<ProfileSettings/>} />
        <Route path="/companydetails/:id" element={<CompanyDetails/>} />
        <Route path="/CDConsultingInquiryForm" element={<CDConsultingInquiryForm/>}/>
        <Route path="/InquiriesList" element={<InquiriesList/>}/>
        {/*<Route path="/esewa" element={<Esewa/>} />*/}
        <Route path="/khalti" element={<KhaltiButton/>} /> 
{/*
        <Route path="/khalti1" element={<KhaltiPayment />} />
        <Route path="/payment/callback" element={<PaymentSuccess />} /> */}
        <Route path="/admin/rejected-companies" element={<ApprovedCompanies/>} /> 
        <Route path="/admin/approved-companies" element={<RejectedCompanies/>} /> 
        <Route path="/admin/rent-verification" element={<RentVerificationAdmin/>} />


        
        
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