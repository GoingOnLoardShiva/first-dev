import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "./Loginv.scss";

const Sigin = () => {
  const [useremail_id, setEmail] = useState("");
  const [useName, SetUname] = useState("");
  const [user_password, setPassword] = useState("");
  const [user_conform_password, setConformPassword] = useState("");
  const [user_dob, setDob] = useState("");
  const [role, setRole] = useState("user");  // Default role is "user"
  const toast = useRef(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;

  const roles = [
    { label: "User", value: "user" },
    { label: "Editor", value: "editor" },
  ];

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${url}/aluserLogin`, {
        useremail_id,
        user_password,
        user_conform_password,
        user_dob,
        role, 
        useName, // Send role in request
      });

      if (res.status === 200) {
        const secureUID = uuidv4();
        Cookies.set("user", JSON.stringify(res.data, secureUID), {
          expires: 7,
        });
        Cookies.set("role", res.data.role, { expires: 7 });

        toast.current.show({
          severity: "success",
          summary: "Login Successful",
          detail: "Redirecting...",
          life: 2000,
        });

        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Login Failed",
        detail: error.response?.data?.message || "Invalid credentials!",
        life: 3000,
      });
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="logincontent">
        <div className="logos">
          <img className="ologo" src={window.location.origin + "/Code.png"} alt="Logo" />
          <h2>Register</h2>
        </div>

        <Dropdown 
          value={role} 
          options={roles} 
          onChange={(e) => setRole(e.value)} 
          placeholder="Select Role" 
        />

        <InputText 
          type="email" 
          placeholder="Enter Your Email" 
          value={useremail_id} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <InputText 
          type="email" 
          placeholder="Enter Your Full Name" 
          value={useName} 
          onChange={(e) => SetUname(e.target.value)} 
        />

        <InputText 
          type="date" 
          placeholder="Enter Your Date Of Birth" 
          value={user_dob} 
          onChange={(e) => setDob(e.target.value)} 
        />

        <InputText 
          type="password" 
          placeholder="Enter Your Password" 
          value={user_password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <InputText 
          type="password" 
          placeholder="Enter Your Confirm Password" 
          value={user_conform_password} 
          onChange={(e) => setConformPassword(e.target.value)} 
        />

        <div className="extraauth">
          <div className="g pi pi-google"><a href="/">Google</a></div>
          <div className="f pi pi-facebook"><a href="/">Facebook</a></div>
        </div>

        <Button label="Register" severity="success" onClick={handleLogin} />
        <button><a href="/">Back</a></button>
      </div>
    </div>
  );
};

export default Sigin;