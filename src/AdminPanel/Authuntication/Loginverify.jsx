import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { v4 as uuidv4 } from "uuid";
import "./Loginv.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please enter both email and password!",
        life: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        url + "/LoginData",
        { email_id: email, pass_word: password },
        { headers: { "skip-auth": "true" } }
      );

      if (response.status === 200) {
        const secureUID = uuidv4();

        // Combine response data with secureUID
        const userData = {
          ...response.data,
          secureUID: secureUID,
        };

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        setTimeout(() => {
          navigate(
            response.data.role === "admin"
              ? "/admin/" + secureUID
              : "/User/" + secureUID
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
            alt="Logo"
          />
          <h2>Login</h2>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="extraauth">
          <div className="g pi pi-google">
            <a href="/">Google</a>
          </div>
          <div className="f pi pi-facebook">
            <a href="/">Facebook</a>
          </div>
        </div>

        <Button label="Login" severity="success" onClick={handleLogin} />

        <button>
          <a href="/">Back</a>
        </button>
      </div>
    </div>
  );
};

export default Login;







