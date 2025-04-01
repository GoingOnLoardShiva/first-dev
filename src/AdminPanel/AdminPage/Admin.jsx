import React, { useState, useRef } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./Adm.scss";

const Hero = () => {
  const showMessage = (severity, detail) => {
    toast.current.show({
      severity,
      summary: "Notification",
      detail,
      life: 3000,
    });
  };

  const toast = useRef(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [basic, setBasic] = useState("");
  const [cpass, setpass] = useState("");
  const handleSubmit = async () => {
    const resp = await axios.post(
      url + "/addData",
      { id, name, basic, cpass }, // Correct: Data should be separate from headers
      { headers: { "skip-auth": "true" } } // Headers must be in a separate object
    );

    if (resp.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Ligin Success",
        detail: "Thanks For Login!",
        life: 2000, // Show toast for 2 seconds
      });
      setTimeout(() => {
        navigate("/Login", {
          state: { successMessage: "Thanks for lgin my admin!" },
        });
      }, 3050);
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="li">
        <div className="mdg  d-grid">
          <InputText
            className="Ina"
            value={id}
            type="Email"
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter Admin Email"
          />
          <InputText
            className="Inb"
            value={name}
            type="password"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Admin Password"
          />
          <InputText
            className="Inb"
            value={basic}
            type="password"
            onChange={(e) => setBasic(e.target.value)}
            placeholder="Enter Admin Password"
          />
          <InputText
            className="Inb"
            value={cpass}
            type="password"
            onChange={(e) => setpass(e.target.value)}
            placeholder="Enter Admin Password"
          />
          <Button
            label="Login"
            severity="success"
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
