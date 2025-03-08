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
    try {
      const response = await axios.put(
        `${url}/updateData/${userId}`,
        {
          // Fix URL
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
    } catch (error) {
      console.error("Error updating user", error);
      alert(error);
    }
  };
  useEffect(() => {
    // ✅ Get user data from cookies
    const userData = Cookies.get("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);

      // ❌ If the user is NOT an admin, redirect to login
      if (parsedUser.role !== "admin") {
        alert("❌ Access Denied! Admins Only.");
        navigate("/login");
      } else {
        setUser(parsedUser); // ✅ Set user data if admin
      }
    } else {
      // ❌ If no user data, redirect to login
      navigate("/login");
    }
  }, [navigate]);
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
