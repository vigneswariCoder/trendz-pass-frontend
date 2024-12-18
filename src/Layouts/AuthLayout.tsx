// layouts/AuthLayout.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthLayoutProps {
  component: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ component }) => {
  return (
    <div>
      <ToastContainer />
      <div>
        {component}
      </div></div>);
};

export default AuthLayout;
