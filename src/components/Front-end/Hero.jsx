import React, { useState, useRef } from "react";
import List from "./List";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

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
  const handleSubmit = async () => {
    try {
      const resp = await axios.post(
        url + "/addData",
        { id, name, basic }, // Correct: Data should be separate from headers
        { headers: { "skip-auth": "true" } } // Headers must be in a separate object
      );
      if (resp.status === 200) {
        navigate("/List", {
          state: { successMessage: "Data added successfully!" },
        }); // Redirect to user page
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      showMessage("error", "Failed to add data!");
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="li">
        <List />
        <a href="List">jjj</a>
        <InputText value={id} onChange={(e) => setId(e.target.value)} />
        <InputText value={name} onChange={(e) => setName(e.target.value)} />
        <InputText value={basic} onChange={(e) => setBasic(e.target.value)} />
        <Button
          label="Submit"
          severity="success"
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default Hero;
