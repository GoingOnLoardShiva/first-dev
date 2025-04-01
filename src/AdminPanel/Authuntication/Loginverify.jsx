import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { v4 as uuidv4 } from "uuid";
import "./Loginv.scss";


const Login = () => {
  const [step, setStep] = useState(1); // Step tracking
  const [email_id, setEmail] = useState("");
  const [user_Pass, setPassword] = useState("");
  const [o_tp, setOtp] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;


  const handleLogin = async () => {
    if (!email_id || !user_Pass) {
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
        `${url}/sendUserOtp`,
        { email_id, user_Pass },
        // { withCredentials: true }
      );

      if (res.status === 200) {

        toast.current.show({
          severity: "success",
          summary: "Otp Send",
          detail: "Redirecting...",
          life: 2000,
        });

        setTimeout(() => {
          setStep(2);

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
  const handleVerifyOTP = async ()=>{
    const senduserOtp = await axios.post (url +"/LoginData",{
      o_tp,email_id,
    })
    if (senduserOtp.status === 200) {
      const secureUID = uuidv4();
      Cookies.set("user", JSON.stringify(senduserOtp.data, secureUID), {
        expires: 7,
      });
      Cookies.set("role", senduserOtp.data.role, { expires: 7 });
      navigate(
        senduserOtp.data.role === "admin"
          ? `/admin/${secureUID}`
          : `/User/${secureUID}`
      );
    }
  }

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="logincontent">
        <div className="logos">
          <img
            className="ologo"
            src={window.location.origin + "/Code.png"}
            alt=""
          />
          <h2> Login</h2>
        </div>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={user_Pass}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="extraauth">
              <div className="g pi pi-google">
                <a href="/"> Google</a>
              </div>
              <div className="f pi pi-facebook">
                <a href="/"> Facbook</a>
              </div>
            </div>
            <Button label="Login" severity="success" onClick={handleLogin} />
            <button>
              <a href="/">Back</a>
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={o_tp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP}>Verify OTP</button>
            <button onClick={() => setStep(1)}>Back</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
