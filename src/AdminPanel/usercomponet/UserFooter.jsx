import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./footer.scss";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axios from "axios";
const Footer = () => {
  const showMessage = (severity, detail) => {
    toast.current.show({
      severity,
      summary: "Notification",
      detail,
      life: 3000,
    });
  };
  const [usermail, setEmail] = useState([]);
  const [massege, setmasage] = useState([]);
  const toast = useRef(null);
  const url = process.env.REACT_APP_HOST_URL;

  const handelsubmit = async () => {
    const add = await axios.post(
      url + "/email",
      { usermail, massege },
      { headers: { "skip-auth": "true" } }
    );
    if (add.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Feedback",
        detail: "Thanks For Give Feedback!",
        life: 2000, // Show toast for 2 seconds
      });
    }
  };
  return (
    <div>
      <Toast ref={toast} />
      <div className="Foot">
        <div className="details d-grid">
          <a href="">info@codetech.com</a>
          <p>
            Contact :- 8967895690 <br />{" "}
            <p>
              Email :- codetech@email.com <br />
              <p>
                Address:- Siliguri ,Hakim Para, <br />
                West Bengal - 734001
              </p>
            </p>
          </p>
        </div>
        <div className="quicklink d-flex">
          <div className="qlinka d-grid">
            <h3>Quick Link</h3>
            <a href="">Home</a>
            <a href="/">Feature</a>
            <a href="/">Trending</a>
            <a href="/">Letest Tech</a>
          </div>
          <div className="treams d-grid">
            <h3>Policy</h3>
            <a href="/">About me</a>
            <a href="/">Licence</a>
            <a href="/">Disclaimer</a>
            <a href="/">Contact Me</a>
          </div>
        </div>
        <div className="subscrib d-grid">
          <h3>Feedback </h3>
          <input spellCheck="true" type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email" />
          <input
            spellCheck="true"
            type="text"
            className="at"
            placeholder="Tel me your Feedback"
            onChange={(e)=> setmasage(e.target.value)}
          />
          <button
            label="Submit"
            severity="success"
            onClick={() => handelsubmit()}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="copy">
        <a href="" className="taa">
          Coustomer Service
        </a>
        <p>
          &#169;Copyright by <a href="">CodeTech</a>
        </p>
        <a href="">Treams & Condition</a>
      </div>
    </div>
  );
};

export default Footer;
