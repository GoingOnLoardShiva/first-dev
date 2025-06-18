import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./header.scss";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import MenuIcon from '@mui/icons-material/Menu';

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
          {userData && (
            <>
              <p>
                <strong>Email:</strong> {userData.user?.[0]?.email_id || "N/A"}
              </p>
              <p>
                <strong>Name:</strong> {userData.user?.[0]?.user_fName || "User"}
              </p>
              <Chip
                label="Logout"
                color="primary"
                className="texta"
                component="a"
                onClick={handleLogout}
                variant="outlined"
                clickable
              />
              {/* <button >Logout</button> */}
            </>
          )}
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
