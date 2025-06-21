import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./header.scss";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // MUI icon
import { blue } from '@mui/material/colors'; 
import SettingsIcon from '@mui/icons-material/Settings';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // ✅ Get user data from localStorage
  const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const customHeader = (
    <div className="d-flex align-items-center gap-2">
      {userData && (
        <>
          <Avatar image={userData.user?.[0]?.img || ""} shape="circle" />
          {userData.user?.[0]?.user_fName || "User"}
        </>
      )}
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="headera">
      <div className="headercontentnt">
        <Sidebar
          header={customHeader}
          visible={visible}
          onHide={() => setVisible(false)}
        >
          <div className="profilecontnet " >
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <AccountCircleIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>Profile Dasboard</a>
            </div>
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <PeopleIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>Friends</a>
            </div>
            
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <ManageAccountsIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>ManageAccount</a>
            </div>
            
            <div className="godasboard" style={{ alignItems: "center", display: "flex", gap: "10px", backgroundColor: "rgba(143, 139, 139, 0.06)", padding: "10px", }}>
              <CheckCircleIcon style={{ color: blue[500]}}  />
              <a href="/" style={{ textDecoration: "none", color: "black", fontSize: "20px", alignItems: "center" }}>Apply Verify Account</a>
            </div>
            
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <PaidIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>Monetize Account</a>
            </div>
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <PaymentsIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>Payment Method</a>
            </div>
            <div className="godasboard" style={{alignItems: "center",display: "flex" ,gap: "10px",backgroundColor: "rgba(143, 139, 139, 0.06)",padding: "10px",}}>
              <SettingsIcon/>
              <a href="/" style={{textDecoration: "none", color:"black" , fontSize: "20px",alignItems: "center"}}>Setting</a>
            </div>
            


          </div>
        </Sidebar>
      </div>

      <div className="logo d-flex">
        <a href="/">
          <img className="ologo" src={window.location.origin + "/You.png"} alt="logo" />
        </a>

        <div className="login d-flex">
          {userData ? (
            <>
              <Chip
                label="Dashboard"
                color="primary"
                className="texta"
                component="a"
                href={`/user/${userData.secureUID}`}
                variant="outlined"
                clickable
              />
              <Chip
                label="Menu"
                icon={<MenuIcon />}
                className="texta"
                variant="outlined"
                clickable
                onClick={() => setVisible(true)}
              />
            </>
          ) : (
            <>
              <Chip
                label="Login"
                color="primary"
                className="texta"
                component="a"
                href="/login"
                variant="outlined"
                clickable
              />
              <Chip
                label="Sign In"
                className="texta"
                component="a"
                href="/sign"
                variant="outlined"
                color="success"
                clickable
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
