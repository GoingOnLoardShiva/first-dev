import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";

const Profile = () => {
  const showMessage = (severity, detail) => {
    toast.current.show({
      severity,
      summary: "Notification",
      detail,
      life: 3000,
    });
  };
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const navigate = useNavigate();

  const [image, setId] = useState([]);
  const [title, setTi] = useState([]);
  const [heading, setName] = useState([]);
  const [trending, setBasic] = useState([]);
  const [Link, SetLink] = useState([]);

  const handleSubmit = async () => {
    const resp = await axios.post(
      url + "/addBlog",
      { image, title, heading, trending },
      { headers: { "skip-auth": "true" } }
    );
    if (resp.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Ligin Success",
        detail: "Thanks For Login!",
        life: 2000, // Show toast for 2 seconds
      });
      setTimeout(() => {
        navigate(0, {
          state: { successMessage: "Thanks for lgin my admin!" },
        });
      }, 1000);
    }
  };
  useEffect(() => {

    const userData = Cookies.get("user");

    if (userData) {
      const cookiData = JSON.parse(userData);


      if (cookiData.role !== "admin") {
        alert(" Access Denied Admins Only.");
        navigate("/login");
      } 
    }
  }, []);
  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        modal
        style={{ width: "50rem" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="in">
          <input
            onChange={(e) => setId(e.target.value)}
            value={image}
            type="text"
            name=""
            id=""
            placeholder="Enter Your Link"
          />
          <input
            onChange={(e) => setTi(e.target.value)}
            value={title}
            type="text"
            name=""
            id=""
            placeholder="Enter Blog Title"
          />
          <input
            onChange={(e) => setName(e.target.value)}
            value={heading}
            type="text"
            name=""
            id=""
            placeholder="Enter Blog paragraph"
          />
          <input
            onChange={(e) => setBasic(e.target.value)}
            value={trending}
            type="number"
            name=""
            id=""
            placeholder="Enter Trending No"
          />
          <input
            onChange={(e) => SetLink(e.target.value)}
            value={Link}
            type="text"
            name=""
            id=""
            placeholder="Enter Nevegate Link"
          />
          <Button
            label="Submit"
            severity="success"
            onClick={() => handleSubmit()}
          />
        </div>
      </Dialog>
      <Button
        label="Post"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />
    </div>
  );
};

export default Profile;
