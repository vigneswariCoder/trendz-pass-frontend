import React from "react";
import axios from 'axios';
import { Menu, MenuItem, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PiUsersThreeLight } from "react-icons/pi";
import { PiUserSwitch } from "react-icons/pi";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./header.css";
import { BaseUrl, FileUrl } from "../../../App";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { refreshToken } from "../../../redux/slice/apiSlice";

interface HeaderProps {
  onLogout: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  pathname: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, sidebarOpen, pathname }) => {
  const userName = localStorage.getItem("name");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorOrg, setAnchorOrg] = React.useState<null | HTMLElement>(null);
  const [anchorRole, setAnchorRole] = React.useState<null | HTMLElement>(null);
  const [orgName, setOrgName] = React.useState<any>("");
  const [roleName, setRoleName] = React.useState<any>("");
  const [orgMenuItem, setOrgMenuItem] = React.useState<any>("");
  const [roleMenuItem, setRoleMenuItem] = React.useState<any>("");
  const [orgLogo, setOrgLogo] = React.useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
    const handleTokenRefresh = async () => {
      const response = await dispatch(refreshToken())
      if (response.payload === 'Failed to refresh token') {
        onLogout();
        console.log('Unauthorized error detected. Calling onLogout...');
      }
  };
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


    handleTokenRefresh();
    const handleClose = () => {
      setAnchorEl(null);
      setAnchorOrg(null);
      setAnchorRole(null);
    };
    const handleLogout = async () => {

      const apiUrl = `${BaseUrl}auth/signout`;
      try {
        const response = await axios.post(apiUrl, {}, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          localStorage.clear();
          onLogout();
          return response.data;
        }
      } catch (error) {
        throw new Error('Failed to Sign Out..!');
      }

    };

  const getHeaderTitle = (path: string) => {
    return path.toUpperCase;
    };

    const headerTitle = pathname.toUpperCase().replace('/', '');

    return (
      <div className={sidebarOpen ? "header-open mb-5" : ""}>
        <div className="justify-between">
          <div>
            <p className="fs-18 fw-700 m-0">{headerTitle}</p>
            <p className="fs-12 m-0 c_919EAB">{headerTitle}</p>
          </div>
          <div className="d-flex align-center header">
            <IconButton onClick={handleMenu}>
              <AccountCircleIcon className="img_35" sx={{ fontSize: '40px', color: '#919EAB', }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem className="fw-700 fs-20 no-hover text-center d-block">{userName}</MenuItem>
              <MenuItem onClick={handleLogout}>SignOut</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    );
  };

  export default Header;