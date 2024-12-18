import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Views/Components/header/Header';
import Sidebar from '../Views/Components/sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MainLayoutProps {
  component: React.ReactNode;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ component, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    setChangePassword(location.pathname === '/change_password');
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render only Header if changePassword is true
  if (changePassword) {
    return (
      <div>
        <main className="center-scroll main-container">{component}</main>
      </div>
    );
  }

  // Render Header and Sidebar if changePassword is false
  return (
    <div>
      <ToastContainer/>
      <div>
        {/* Render Sidebar */}
        {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} pathname={pathname} />}
      </div>
      <div className="side-container">
        {/* Render Header */}
        <Header onLogout={onLogout} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} pathname={pathname}/>
        <main className="center-scroll main-container">{component}</main>
      </div>
    </div>
  );
};

export default MainLayout;