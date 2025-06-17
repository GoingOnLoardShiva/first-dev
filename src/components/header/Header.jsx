import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Head.scss";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  // Get user from localStorage
  const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const customHeader = (
    <div className="d-flex align-items-center gap-2">
      {userData && (
        <>
          <Avatar image={userData.img} shape="circle" />
          <span className="font-bold">{userData.useName}</span>
        </>
      )}
    </div>
  );

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
                <strong>Email:</strong> {userData.useName}
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("user"); // Remove from localStorage
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </Sidebar>
      </div>
      <div className="logo d-flex">
        <a href="/">
          <img className="ologo" src={window.location.origin + "/You.png"} alt="" />
        </a>
        <div className="login d-flex">
          {userData ? (
            // Show Dashboard button if user cookie exists
            <Chip
              label="Dashboard"
              color="primary"
              className="texta"
              component="a"
              href={
                userData.role === "admin"
                  ? `/admin/${userData.secureUID}`
                  : `/user/${userData.secureUID}`
              }
              variant="outlined"
              clickable
            />
          ) : (
            // Show Login and Sign In buttons if user cookie does not exist
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
