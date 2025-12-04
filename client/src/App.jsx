import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./homedashboard/Home";
import About from "./homedashboard/About";
import Login from "./homedashboard/Login";
import Contact from "./homedashboard/Contactus";
import NotFound from "./homedashboard/NotFound";
import RentalProperties from "./homedashboard/RentalProperties";

import ManageHomes from "./admin/ManageHomes";
import AdminDashboard from "./admin/AdminDashboard";
import ManageSocieties from "./admin/ManageSocieties";
import OwnerRegistration from "./admin/OwnerRegistration";  
import ChooseSecretary from "./admin/ChooseSecretary";
import AdminProfile from "./admin/AdminProfile";
import ChangePassword from "./admin/AdminChangePassword";
import TenentRequestAdminPanel from "./admin/TenentRequestAdminPanel";


import RoleSelection from "./secretory/RoleSelectionPage";
import SecretaryLayout from "./layouts/SecretoryLayout";
import SecretoryDashboard from "./secretory/SecretoryDashboard";
import PostAnnouncement from "./secretory/PostAnnouncement";
import SecretaryChangePassword from "./secretory/SecretoryChangePassword";
import ManageComplaints from "./secretory/ManageComplaints";
import ManageHallBooking from "./secretory/ManageHallBooking";
import ViewFeedback from "./secretory/ViewFeedback";
import SecretaryProfile from "./secretory/SecretaryProfile";
import ManageMaintenance from "./secretory/ManageMaintenance";
import PaidMaintenanceList from "./secretory/ViewPaidMaintenance";

import OwnerDashboard from "./owner/OwnerDashboard";
import OwnerLayout from "./layouts/OwnerLayout";
import ViewAnnouncement from "./owner/ViewAnnouncement";
import Appoinment from "./owner/AppointmentRequest";
import SubmitComplaint from "./owner/SubmitComplaint";
import OwnerChangePassword from "./owner/OwnerChangePassword";
import HallBooking from "./owner/HallBooking";
import OwnerProfile from "./owner/OwnerProfile";  
import ActiveMaintenanceList from "./owner/ActiveMaintenanceList";

import TenantLayout from "./layouts/TenantLayout";
import TenantDashboard from "./tenant/TenantDashboard";
import TenantAnnouncements from "./tenant/TenantAnnouncements";
import TenantComplaints from "./tenant/SubmitComplaint";
import TenantChangePassword from "./tenant/TenantChangePassword";
import HallBookings from "./tenant/HallBooking";
import TenantProfile from "./tenant/TenantProfile";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public/User Pages */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/about" element={<UserLayout><About /></UserLayout>} />
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/contactus" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/rental-properties" element={<UserLayout><RentalProperties /></UserLayout>} />

        {/* Protected Admin Pages */}
        <Route path="/admindashboard" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />

        <Route path="/admin/homes" element={<PrivateRoute><AdminLayout><ManageHomes /></AdminLayout></PrivateRoute> } />

        <Route path="/admin/society" element={<PrivateRoute><AdminLayout><ManageSocieties /></AdminLayout></PrivateRoute> } />
        
        <Route path="/admin/owners" element={<PrivateRoute><AdminLayout><OwnerRegistration /></AdminLayout></PrivateRoute> } />

        <Route path="/admin/secretary" element={<PrivateRoute><AdminLayout><ChooseSecretary /></AdminLayout></PrivateRoute> } />

        <Route path="/admin/profile" element={<PrivateRoute><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute> } />

        <Route path="/admin/change-password" element={<PrivateRoute><AdminLayout><ChangePassword /></AdminLayout></PrivateRoute>} />

        <Route path="/admin/tenent-requests" element={<PrivateRoute><AdminLayout><TenentRequestAdminPanel /></AdminLayout></PrivateRoute>} />


        <Route path="/ownerdashboard" element={<PrivateRoute><OwnerLayout><OwnerDashboard /></OwnerLayout></PrivateRoute>} />

        <Route path="/owner/announcement" element={<PrivateRoute><OwnerLayout><ViewAnnouncement /></OwnerLayout></PrivateRoute>} />

        <Route path="/owner/appointments" element={<PrivateRoute><OwnerLayout><Appoinment /></OwnerLayout></PrivateRoute>} />
        
        <Route path="/owner/SubmitComplaint" element={<PrivateRoute><OwnerLayout><SubmitComplaint /></OwnerLayout></PrivateRoute>} />

        <Route path="/owner/change-password" element={<PrivateRoute><OwnerLayout><OwnerChangePassword /></OwnerLayout></PrivateRoute>} />
   
        <Route path="/owner/hall-booking" element={<PrivateRoute><OwnerLayout><HallBooking /></OwnerLayout></PrivateRoute>} />

        <Route path="/owner/OwnerProfile" element={<PrivateRoute><OwnerLayout><OwnerProfile /></OwnerLayout></PrivateRoute>} />

        <Route path="/owner/active-maintenance" element={<PrivateRoute><OwnerLayout><ActiveMaintenanceList /></OwnerLayout></PrivateRoute>} />



        <Route path="/secretorydashboard" element={<PrivateRoute><SecretaryLayout><SecretoryDashboard /></SecretaryLayout></PrivateRoute>} />

        <Route path="/secretory/announcement" element={<PrivateRoute><SecretaryLayout><PostAnnouncement /></SecretaryLayout></PrivateRoute>} />
                
        <Route path="/secretory/change-password" element={<PrivateRoute><SecretaryLayout><SecretaryChangePassword /></SecretaryLayout></PrivateRoute>} /> 

        <Route path="/secretory/complaints" element={<PrivateRoute><SecretaryLayout><ManageComplaints /></SecretaryLayout></PrivateRoute>} />

        <Route path="/secretory/hall-booking" element={<PrivateRoute><SecretaryLayout><ManageHallBooking /></SecretaryLayout></PrivateRoute>} />

        <Route path="/secretory/ViewFeedback" element={<PrivateRoute><SecretaryLayout><ViewFeedback /></SecretaryLayout></PrivateRoute>} />
        
        <Route path="/secretory/SecretaryProfile" element={<PrivateRoute><SecretaryLayout><SecretaryProfile /></SecretaryLayout></PrivateRoute>} />

        <Route path="/secretory/maintenance" element={<PrivateRoute><SecretaryLayout><ManageMaintenance /></SecretaryLayout></PrivateRoute>} />

        <Route path="/secretory/paidMaintainance" element={<PrivateRoute><SecretaryLayout><PaidMaintenanceList /></SecretaryLayout></PrivateRoute>} />


        <Route path="/tenantdashboard" element={<PrivateRoute><TenantLayout><TenantDashboard /></TenantLayout></PrivateRoute>} />
        
        <Route path="/tenant/announcements" element={<PrivateRoute><TenantLayout><TenantAnnouncements /></TenantLayout></PrivateRoute>} />
        
        <Route path="/tenant/complaints" element={<PrivateRoute><TenantLayout><TenantComplaints /></TenantLayout></PrivateRoute>} />
        
        <Route path="/tenant/change-password" element={<PrivateRoute><TenantLayout><TenantChangePassword /></TenantLayout></PrivateRoute>} /> 
        
        <Route path="/tenant/hall-booking" element={<PrivateRoute><TenantLayout><HallBookings /></TenantLayout></PrivateRoute>} />
        
        <Route path="/tenant/TenantProfile" element={<PrivateRoute><TenantLayout><TenantProfile /></TenantLayout></PrivateRoute>} />

        {/* Optional: Catch-all redirect to login */}
        <Route path="*" element={<NotFound />} />

        <Route path="/role-selection" element={<RoleSelection />} />

      </Routes>
    </Router>
  );
}

export default App;
