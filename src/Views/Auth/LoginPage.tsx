import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import axios from 'axios';
import "./loginPage.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BaseUrl } from "../../App";
import { toast } from 'react-toastify';

interface LoginPageProps {
  onLogin: (useremail: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authData, setAuthData] = useState({ useremail: "", password: "" });
  const [errors, setErrors] = useState({ useremail: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prevAuthData) => ({ ...prevAuthData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleLogin = async () => {
    const newErrors = { useremail: "", password: "" };

    if (!authData.useremail) {
      newErrors.useremail = "Email is required";
    }

    if (!authData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (newErrors.useremail || newErrors.password) {
      return;
    }

    const formData = new FormData();
    formData.append("name", authData.useremail);
    formData.append("password", authData.password);

    try {
      const response = await axios.post(BaseUrl + "auth/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      onLogin(authData.useremail, authData.password);
      window.location.replace("/");

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("employeeId", response.data.employeeId);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("userId", (response.data.id));
      localStorage.setItem("roleId", (response.data.roleId));
      localStorage.setItem("organizationId", (response.data.organizationId));
      localStorage.setItem("roleSet", (response.data.roleSet));
      localStorage.setItem("organizationSet", (response.data.organizationSet));

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        toast.error("User Name or Password is Incorrect");
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Grid container className="login_page">
      <Grid item xs={6} className="d-flex justify-content-center">
        <div className="login_bg align-self-center">
          <img src="logo.png" className="login-logo" alt="logo" width={100} />
          <div className="text-left">
            <h1>Login</h1>
            <p className="c-000 font_ReadexPro fw-300 fs-20 text-left mb-3">
              Please Sign In to continue
            </p>
          </div>
        <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
          <Typography component="h5">
            Email <sup className="text-danger">*</sup>
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            type="email"
            required
            fullWidth
            id="useremail"
            name="useremail"
            autoComplete="email"
            className="textfield"
            autoFocus
            value={authData.useremail}
            onChange={handleInputChange}
            error={!!errors.useremail}
            helperText={errors.useremail}
          />
          <Typography component="h5">
            Password <sup className="text-danger">*</sup>
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            className="textfield"
            type={passwordVisible ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={authData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: '#fff' }}
          >
            Sign In
          </Button>
        </Box>
        </div>
      </Grid>
      <Grid item xs={6} className="">
        <img src="assets/images/auth-img.jpg" alt="" width={'90%'} />
      </Grid>
      {/* <div className="circle-container">
        <div className="circle light"></div>
        <div className="circle medium"></div>
        <div className="circle dark"></div>
        <div className="circle darker"></div>
      </div> */}
    </Grid>
  );
};

export default LoginPage;
