import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./header.scss";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
// import { Avatar } from "primereact/avatar";
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SecureLink from "../Authuntication/SecuireLink";
import { green } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const userData = Cookies.get("user"); // Get user data from cookies
  const user = userData ? JSON.parse(userData) : null; // Parse if exists

  // const avatar = user?.img || null; // Get avatar image
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const [visible, setVisible] = useState(false);
  const [visiblea, setVisiblea] = useState(false);
  const navigate = useNavigate();
  const customIcons = (
    <React.Fragment>
      <button className="p-sidebar-icon p-link mr-2"></button>
    </React.Fragment>
  );

  const customHeader = (
    <div>
      <Avatar sx={{ bgcolor: green[400] }}>{user.name?.substring(0, 1)}</Avatar>
    </div>
  );
  return (
    <div className="header bg-black">
      <div className="headercontentnt">
        <Sidebar
          header={customHeader}
          visible={visible}
          onHide={() => setVisible(false)}
          icons={customIcons}
        >
          <p>
            <strong>Email:</strong> {user.email}
            {/* <strong>role:</strong> {user.role} */}
          </p>
          <p>
            {/* <strong>Email:</strong> {user.email} */}
            <strong>role:</strong> {user.role}
          </p>
          <Chip
            label="Logout"
            onClick={() => {
              Cookies.remove("user");
              navigate("/");
            }}
          />
          {/* <button
            onClick={() => {
              Cookies.remove("user");
              navigate("/");
            }}
          >
            Logout
          </button> */}
        </Sidebar>
      </div>
      <div className="logo d-flex">
        <img
          className="ologo"
          src={window.location.origin + "/Code.png"}
          alt=""
        />
        <div className="login d-flex">
          <Chip
            label="Dasboard"
            icon={<FaceIcon />}
            className="text"
            component="a"
            href="/user/:uid/myprofile"
            variant="outlined"
            clickable
          />
          {/* <Chip
            icon={<FaceIcon />}
            className="text"
            label="With Icon"
            href="/user/:uid/myprofile"
            variant="outlined"
          /> */}
          {/* <Button className="text">
            
            <a className="texta" href="/user/:uid/myprofile">
              My Profile
            </a>
          </Button> */}
          <Chip
            label="Menu"
            icon={<MenuIcon />}
            className="text"
            component="a"
            // href="/user/:uid/myprofile"
            variant="outlined"
            clickable
            onClick={() => setVisible(true)}
          />
          {/* <Button
            className="pi pi-align-justify"
            onClick={() => setVisible(true)}
          /> */}
        </div>
      </div>
      {/* <div className="line" /> */}
    </div>
  );
};

export default Header;
