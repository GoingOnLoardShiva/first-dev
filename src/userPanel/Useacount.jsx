import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Useacount() {
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const userEmail = user ? user.email : null;
  const [data, setData] = useState([]);

  useEffect(() => {
    const Acimage = async () => {
      const acimagere = await axios.get(url + /userimagerc/ + userEmail, {
        headers: { "access-key": key },
      });
      if (acimagere.status === 200) {
        console.log("API Response:", acimagere.data);
        setData (acimagere.data.user)
        // console.log("Image Data:", data);
        // setUserPosts(Array.isArray(data) ? data : [data]);
      }
    };
    Acimage();
  });
  return (
    <div>
      <div className="userAccontent">
        <img src={data.img} alt="" />
      </div>
    </div>
  );
}
