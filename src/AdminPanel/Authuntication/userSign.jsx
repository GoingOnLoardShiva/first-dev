// React Component: Sigin.js
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
  const [role, setRole] = useState("user");
  const [otpSent, setOtpSent] = useState(false);
  const [regOtp, setRejotp] = useState(false);
  const [sendOtp, setSendotp] = useState(true);
  const [otp, setOtp] = useState("");

  const toast = useRef(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;

  const roles = [
    { label: "User", value: "user" },
  ];

  const handleSendOtp = async () => {
    try {
      const res = await axios.post( url + "/sendotp", {
        useremail_id,
      });

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "Check your email",
          life: 3000,
        });
        setOtpSent(true);
        setRejotp(true)
        setSendotp(false)
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "OTP Failed",
        detail: error.response?.data?.message || "Try again",
        life: 3000,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(url + "/verifyotp", {
        useremail_id,
        otp,
        user_password,
        user_conform_password,
        user_dob,
        role,
        useName,
      });

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Registration Successful",
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
        summary: "Registration Failed",
        detail: error.response?.data?.message || "Invalid OTP or details",
        life: 3000,
      });
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="logincontent">
        <div className="logos">
          <img className="ologo" src={window.location.origin + "/You.png"} alt="Logo" />
          <h2>Create Account</h2>
        </div>

        <Dropdown value={role} hidden options={roles} onChange={(e) => setRole(e.value)} placeholder="Select Role" />

        <InputText type="email" placeholder="Enter  Email" value={useremail_id} onChange={(e) => setEmail(e.target.value)} />
        <InputText type="text" placeholder="Enter Full Name" value={useName} onChange={(e) => SetUname(e.target.value)} />
        <InputText type="date" placeholder="Enter Your Date Of Birth" value={user_dob} onChange={(e) => setDob(e.target.value)} />
        <InputText type="password" placeholder="Enter 6 Digit Password" value={user_password} onChange={(e) => setPassword(e.target.value)} />
        <InputText type="password" placeholder="Enter 6 Digit Confirm Password" value={user_conform_password} onChange={(e) => setConformPassword(e.target.value)} />

        {otpSent && (
          <InputText type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        )}
        {regOtp && (
            <Button label="Register" severity="success" onClick={handleLogin} />
        )}
        {sendOtp && (
             <Button label="Send OTP" severity="info" onClick={handleSendOtp} />
        )}

       
                
        <button><a href="/">Back</a></button>
      </div>
    </div>
  );
};

export default Sigin;