import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./header.scss";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SecureLink from "../Authuntication/SecuireLink";

const Header = () => {
  const userData = Cookies.get("user"); // Get user data from cookies
  const user = userData ? JSON.parse(userData) : null; // Parse if exists

  const avatar = user?.img || null; // Get avatar image
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
    <div
      className=" d-flex align-items-center gap-2"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: avatar ? "transparent" : "#007bff",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        overflow: "hidden",
      }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt="User Avatar"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      ) : (
        firstLetter
      )}
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
          <button
            onClick={() => {
              Cookies.remove("user");
              navigate("/");
            }}
          >
            Logout
          </button>
        </Sidebar>
      </div>
      <div className="logo d-flex">
        <img
          className="ologo"
          src={window.location.origin + "/Code.png"}
          alt=""
        />
        <div className="login d-flex">
          <Button className="text"><a className="texta" href="/user/:uid/myprofile">My Profile</a></Button>
          <Button
            className="pi pi-align-justify"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      {/* <div className="line" /> */}
    </div>
  );
};

export default Header;
