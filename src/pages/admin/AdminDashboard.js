import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import DashboardHome from './DashboardHome';
import Owners from './owners/Owners';
import Tenants from './tenant/Tenants';
import Guards from './guard/Guards';
import Apartments from './apartments/Apartments';
import Payments from './payments/Payments';
import Surveys from './surveys/Surveys';
import Reservations from './reservations/Reservations';
import PQRS from './pqrs/PQRS';
import Notifications from './notifications/Notifications';
import Parking from './parking/Parking';
import Pets from './pets/Pets';
import Profile from './profile/Profile';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        currentPath={location.pathname}
      />
      
      <div className="dashboard-main">
        <Topbar 
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          user={user}
        />
        
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/guards" element={<Guards />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/pqrs" element={<PQRS />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 