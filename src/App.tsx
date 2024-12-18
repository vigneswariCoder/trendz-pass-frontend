import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthLayout from './Layouts/AuthLayout';
import MainLayout from './Layouts/MainLayout';
import LoginPage from './Views/Auth/LoginPage';
import Dashboard from './Views/pages/Dashboard';
import MembershipCard from './Views/pages/member/MemberShipCard';
import Customer from './Views/pages/customer/Customer';
import Membership from './Views/pages/member/MemberShip';
import MemberOffers from './Views/pages/member/MemberOffers';
import axios from 'axios';

const App: React.FC = () => {
  const initialAuthenticatedState = localStorage.getItem('authenticated') === 'true';
  const [authenticated, setAuthenticated] = useState(initialAuthenticatedState);

  const handleLogin = (username: string, password: string) => {
    setAuthenticated(true);
    localStorage.setItem('authenticated', 'true');
  };
  
  const handleLogout = async () => {
    
    const apiUrl = `${BaseUrl}auth/expired_signout1`;
    try {
      const response = await axios.post(apiUrl, {}, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setAuthenticated(false);
        // localStorage.clear();
        return response.data;
      }
    } catch (error) {
      throw new Error('Failed to Sign Out..!');
    }

  };

  useEffect(() => {
    const tokenExpired = localStorage.getItem("token");
    if (tokenExpired) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('authenticated');
      // window.location.href = '/';
    }
  }, []);

  const routes = [
    {
      path: '/',
      element: authenticated ? <Navigate to="/dashboard" /> : <AuthLayout component={<LoginPage onLogin={handleLogin} />} />
    },
    {
      path: '/dashboard',
      element: authenticated ? <MainLayout component={<Dashboard />} onLogout={handleLogout} /> : <Navigate to="/" />
    },
    {
      path: '/membership-card/:id',
      element: authenticated ? <MainLayout component={<MembershipCard />} onLogout={handleLogout} /> : <Navigate to="/" />
    },
    {
      path: '/customer',
      element: authenticated ? <MainLayout component={<Customer />} onLogout={handleLogout} /> : <Navigate to="/" />
    },
    {
      path: '/membership',
      element: authenticated ? <MainLayout component={<Membership />} onLogout={handleLogout} /> : <Navigate to="/" />
    },
    {
      path: '/member-offers/:id',
      element: authenticated ? <MainLayout component={<MemberOffers/>} onLogout={handleLogout} /> : <Navigate to="/" />
    },
  ];


  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};
export const BaseUrl = 'http://localhost:8090/';
export const FileUrl = 'http://localhost:8090/';

export default App;
