import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import "./login.scss";
import { Toast } from "primereact/toast";

const Login = () => {
  const [email_id, setEmail] = useState("");
  const [user_Pass, setPassword] = useState("");
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;
  const [user, setUser] = useState(null);
  const [value, setValue] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    const userData = Cookies.get("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);

      if (parsedUser.role !== "User") {
        alert(" Access Denied! User Only.");
        navigate("/");
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate("/Login");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(url + "/LoginData", { email_id, user_Pass });

      if (res.status === 200) {
        Cookies.set("user", JSON.stringify(res.data), { expires: 7 });
        toast.current.show({
          severity: "success",
          summary: "Ligin Success",
          detail: "Thanks For Login!",
          life: 2000, // Show toast for 2 seconds
        });
        setTimeout(() => {
          navigate("/Profile", {
            state: { successMessage: "Thanks for lgin my admin!" },
          });
        }, 3050);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        navigate("/user-not-found");
      } else {
        alert(" Something went wrong!");
        navigate("/");
      }
    }
  };

  return (
    <div className="lgin">
      <Toast ref={toast} />
      <h2>ADMIN LOGIN</h2>
      <div className="lggg">
        <FloatLabel>
          <InputText
            type="email"
            className="lge"
            id="username"
            value={email_id}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="username">Email Id</label>
        </FloatLabel>
        <br />
        <FloatLabel>
          <InputText
            className="lge"
            type="text"
            id="username"
            value={user_Pass}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="Password">Password</label>
        </FloatLabel>
        {/* <input
        type="email"
        placeholder="Enter Email"
        value={email_id}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "10px", padding: "8px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Enter Password"
        value={user_Pass}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "8px" }}
      />
      <br /> */}
        <br />
        <br />
        <div className="bt">
          <button className="bta" onClick={handleLogin}>
            Login
          </button>
          <button className="btb">
            <a href="/">Back</a>
          </button>
          <p>hii</p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Login;
