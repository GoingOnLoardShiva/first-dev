import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Head.scss";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

const Header = () => {
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null; // Set to null if cookie doesn't exist
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const customHeader = (
    <div className="d-flex align-items-center gap-2">
      {userData && (
        <>
          <Avatar image={userData.img} shape="circle" />
          <span className="font-bold">{userData.name}</span>
        </>
      )}
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
          {userData && (
            <>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <button
                onClick={() => {
                  Cookies.remove("user");
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
          <img className="ologo" src="/codetech.svg" alt="" />
        </a>
        <div className="login d-flex">
          {userData ? (
            // Show Dashboard button if user cookie exists
            <Chip
              label="Dashboard"
              color="primary"
              className="texta"
              component="a"
              href="/user/:uid/myprofile"
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
