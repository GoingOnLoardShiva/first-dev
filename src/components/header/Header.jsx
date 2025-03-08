import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Head.scss";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : true;
  const [visible, setVisible] = useState(false);
  const [visiblea, setVisiblea] = useState(false);
  const navigate = useNavigate();
  const customIcons = (
    <React.Fragment>
      <button className="p-sidebar-icon p-link mr-2">
        
      </button>
    </React.Fragment>
  );

  const customHeader = (
    <div className=" d-flex align-items-center gap-2">
      <Avatar
        image={userData.img}
        shape="circle"
      />
      <span className="font-bold">{userData.name}</span>
    </div>
  );
  return (
    <div className="bg-black">
      <div className="a">
        <Sidebar
          header={customHeader}
          visible={visible}
          onHide={() => setVisible(false)}
          icons={customIcons}
        >
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
        </Sidebar>
      </div>
      <div className="logo d-flex">
        <img src={window.location.origin + "/Code.png"} alt="" />
        <div className="login d-flex">
          <div className="text">
            <a href="Login">Login</a>
          </div>
          <Button icon="pi pi-user" onClick={() => setVisible(true)} />
        </div>
      </div>
    </div>
  );
};

export default Header;
