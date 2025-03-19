import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";

const Update = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [userId, setUserId] = useState("");
  const [img, setImage] = useState("");
  const [blog_title, setBlog] = useState("");
  const [blog_h1, setH1] = useState("");
  const [is_trending, settrending] = useState("");

  const updateUser = async () => {
    const response = await axios.put(
      url+"/updateData",{userId},
      {
        img,
        blog_title,
        blog_h1,
        is_trending,
      },
      { headers: { "access-key": key } }
    );
    if (response.status === 200) {
      navigate(0);
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
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image Link"
        value={img}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Blloger Title"
        value={blog_title}
        onChange={(e) => setBlog(e.target.value)}
      />
      <input
        type="text"
        placeholder="Blloger peragraph"
        value={blog_h1}
        onChange={(e) => setH1(e.target.value)}
      />
      <input
        type="number"
        placeholder="trending number"
        value={is_trending}
        onChange={(e) => settrending(e.target.value)}
      />
      <button onClick={updateUser}>Update User</button>
    </div>
  );
};

export default Update;
