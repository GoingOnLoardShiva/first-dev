import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { v4 as uuidv4 } from "uuid";
import "./Loginv.scss";

const Login = () => {
  const [email_id, setEmail] = useState("");
  const [pass_word, setPassword] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [login, setLogin] = useState(false);
  const [sendotp, setsendotp] = useState(true);
  const url = process.env.REACT_APP_HOST_URL;
  const [otp, setOtp] = useState("");
  const verifyotp = async () => {
    try {
      const res = await axios.post(url + "/loginsendotp", {
        email_id,
      });

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "OTP Verified",
          detail: "You can now login",
          life: 3000,
        });
        setOtpSent(true);
        setLogin(true);
        setsendotp(false);
        
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Verification Failed",
        detail: error.response?.data?.message || "Invalid OTP!",
        life: 3000,
      });
    }
  }

  const handleLogin = async () => {
    if (!email_id || !pass_word) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please enter both email and password!",
        life: 3000,
      });
      return;
    }

    try {
      const res = await axios.post(
        url + "/LoginData",
        { email_id, pass_word, otp },
        { headers: { "skip-auth": "true" } }
        // { withCredentials: true }
      );

      if (res.status === 200) {
        const secureUID = uuidv4();

        // Combine response data with secureUID
        const userData = {
          ...res.data,
          secureUID: secureUID,
        };

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        toast.current.show({
          severity: "success",
          summary: "Login Successful",
          detail: "Redirecting...",
          life: 2000,
        });

        setTimeout(() => {
          navigate(
            res.data.role === "admin"
              ? `/admin/${secureUID}`
              : `/User/${secureUID}`
          );
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
          <img
            className="ologo"
            src={window.location.origin + "/You.png"}
            alt=""
          />
          <h2> Login</h2>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email_id}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass_word}
          onChange={(e) => setPassword(e.target.value)}
        />
        {otpSent && (
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        )}
        <div className="extraauth">
          <div className="g pi pi-google">
            <a href="/"> Google</a>
          </div>
          <div className="f pi pi-facebook">
            <a href="/"> Facbook</a>
          </div>
        </div>
        {login && (
           <Button label="Login" severity="success" onClick={handleLogin} />
        )}
        {sendotp && (
           <Button label="Send Otp" severity="success" onClick={verifyotp} />
        )}
       
        
        <button>
          <a href="/">Back</a>
        </button>
      </div>
    </div>
  );
};

export default Login;