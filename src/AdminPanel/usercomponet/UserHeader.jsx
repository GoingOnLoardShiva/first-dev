import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./header.scss";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const customHeader = (
    <div>
      <Avatar sx={{ bgcolor: green[400] }}>
        {user?.useName?.substring(0, 1).toUpperCase() || "?"}
      </Avatar>
    </div>
  );

  return (
    <div className="header">
      <div className="headercontentnt">
        <Sidebar
          header={customHeader}
          visible={visible}
          onHide={() => setVisible(false)}
        >
          {user && (
            <>
              <p>
                <strong>Email:</strong> {user.email_id}
              </p>
              <p>
                <strong>Role:</strong> {user.role || "user"}
              </p>
              <Chip
                label="Logout"
                color="error"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("loggedIn");
                  navigate("/");
                }}
              />
            </>
          )}
        </Sidebar>
      </div>

      <div className="logo d-flex">
        <a href="/">
          <img
            className="ologo"
            src={window.location.origin + "/You.png"}
            alt="Logo"
          />
        </a>

        <div className="login d-flex">
          {user && (
            <Chip
              label="Dashboard"
              icon={<FaceIcon />}
              className="text"
              component="a"
              href={`/user/${user.secureUID}/myprofile`}
              variant="outlined"
              clickable
            />
          )}

          <Chip
            label="Menu"
            icon={<MenuIcon />}
            className="text"
            component="a"
            variant="outlined"
            clickable
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
