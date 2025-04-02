import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./userall.scss";

const UserPostPage = () => {
  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const { _id } = useParams(); // Get blog_title from URL
  const [data, setData] = useState([]);
  const [user, setdataUser] = useState([]);

  useEffect(
    (user) => {
      // console.log("Received ID:", _id); // Debugging

      // if (!_id) {
      //   console.error("Blog ID is undefined!");
      //   return;
      // }

      const fetchBlog = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/userpostRecived/${_id}`,
            { headers: { "access-key": key } }
          );

          // console.log("API Response:", response.data);
          setData(response.data.userpostRecived);
        } catch (error) {
          console.error("Error fetching blog post:", error);
        }
      };
      console.log(data);
      const fetchBloga = async () => {
        try {
          const responsea = await axios.get(
            `${API_BASE_URL}/recivedUserallPostwithid/${_id}`,
            { headers: { "access-key": key } }
          );

          if (!responsea.data.userpostRecived) {
            console.error("Error: 'userpostRecived' is missing in response");
            return;
          }

          setdataUser(responsea.data.userpostRecived);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };

      fetchBlog();
      fetchBloga();
    },
    [_id, API_BASE_URL, key]
  );

  return (
    <div>
      <div className="p ">
        <p></p>
        <div className="postview">
          <div>
            <div className="usercontent color-white">
              <div className="userfirstcontentback"> Post By - {user.email_id ? user.email_id.substring(0, 5) : "Loading"}, </div>
              <div className="userfirstcontentdev">{user.blog_title},{data.blog_title}</div>
              <br />
              <div className="userfirstcontent">{user.blog_Description},{data.h1}</div>
              <br />
              <div className="userfirstcontentimg"><img src={user.blog_img} alt="" /></div>
              <br />
              <div className="userfirstcontentimg"><img src={user.img} alt="" /></div>
              <br />
              <br />
              <div className="userfirstcontentdev">{user.blog_title2},{data.blog_title}</div>
              <div className="userfirstcontent">{user.blog_Description2},{data.blog_title}</div>
              <br />
              <div className="userfirstcontentimg"><img src={user.blog_img2} alt="" /></div>
              <br />
              <br />
              <div className="userfirstcontentdev">{user.blog_title3},{data.blog_title}</div>
              <div className="userfirstcontent">{user.blog_Description3},{data.blog_title}</div>
              <br />
              <div className="userfirstcontentimg"><img src={user.blog_img3} alt="" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPostPage;
