import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./sidebar.css";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { LuLayoutDashboard } from "react-icons/lu";
import { MdCardMembership } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { Typography } from '@mui/material';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar, pathname }) => {
  const [organizationId, setOrganizationId] = useState<string | null>(localStorage.getItem("organizationId"));
  const splitLocation = pathname.split("/");

  const dispatch = useDispatch<AppDispatch>();

  const sidebarItems = [
    {
      path: '/dashboard',
      icon: <LuLayoutDashboard style={{ fontSize: '22px', alignSelf: 'center'}} />,
      activeIcon: <LuLayoutDashboard style={{ fontSize: '25px', alignSelf: 'center'}} />,
      label: 'Dashboard',
      key: 'dashboard'
    },
    {
      path: '/customer',
      icon: <LuUsers2 style={{ fontSize: '22px', alignSelf: 'center' }} />,
      activeIcon: <LuUsers2 style={{ fontSize: '25px', alignSelf: 'center' }} />,
      label: 'Customer',
      key: 'customer'
    },
    {
      path: '/membership',
      icon: <MdCardMembership style={{ fontSize: '22px', alignSelf: 'center' }} />,
      activeIcon: <MdCardMembership style={{ fontSize: '25px', alignSelf: 'center' }} />,
      label: 'Membership',
      key: 'membership'
    },
  ];

  useEffect(() => {
    const handleStorageChange = () => {
      setOrganizationId(localStorage.getItem("organizationId"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
      <div className="logo d-flex">
        <div>
          <img src="logo_white.png" alt="" width={50}/>
        </div>
        <div className="logo-name d-flex">
          <Typography className='align-self-center' color='primary'>New Trndz Pass</Typography>
        </div>
      </div>
      <div className="mt-1 sidebar_css">
        <ul className="mt-0">
          {sidebarItems.map((item) => (
            <li
              key={item.key}
              className={`mt-2 ${splitLocation[1] === item.key ? 'sidebar_active' : ''}`}
            >
              <Link to={item.path}>
                <div className="d-flex">
                  {splitLocation[1] === item.key ? item.activeIcon : item.icon}
                  {item.label && <span className="ml-1">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
