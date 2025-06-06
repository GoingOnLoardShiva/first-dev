import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./userall.scss";
import "primeicons/primeicons.css";
import { Skeleton } from "@mui/material";

const UserPostPage = ({ isLoading }) => {
  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const { _id } = useParams(); 
  const [data, setData] = useState([]);
  const [user, setdataUser] = useState([]);
  const [views, setViews] = useState(0);
  useEffect(() => {
    const countView = async () => {
      try {
        const res = await axios.get(API_BASE_URL + "/UserpostViews" + _id, {
          headers: { "access-key": key },
        });
        setViews(res.data.views);
      } catch (err) {
        console.error("Error fetching views", err);
      }
    };
    countView();
  }, [_id]);

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
            API_BASE_URL + "/userpostRecived/"+{_id},
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
    <div className="p">
      <div className="p">
        <p></p>
        <div className="postview">
          <div className="usercontenta color-white">
            {isLoading ? (
              <>
                <div className="userfirstcontentback pi pi-check-circle">
                  <Skeleton variant="text" width={200} height={25} />
                  <p>
                    <strong>Views:</strong>{" "}
                    <Skeleton variant="text" width={50} height={20} />
                  </p>
                </div>
                <div className="userfirstcontentdev">
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="50%" height={30} />
                </div>
                <br />
                <div className="userfirstcontent">
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="85%" />
                  <Skeleton variant="text" width="80%" />
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" height={250} />
                </div>
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" height={250} />
                </div>
                <br />
                <br />
                <br />
                <div className="userfirstcontentdev">
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="50%" height={30} />
                </div>
                <div className="userfirstcontent">
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="85%" />
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" width="100%" height={250} />
                </div>
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" width="100%" height={250} />
                </div>
                <br />
                <br />
                <div className="userfirstcontentdev">
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="50%" height={30} />
                </div>
                <div className="userfirstcontent">
                  <Skeleton variant="text" width="85%" />
                  <Skeleton variant="text" width="80%" />
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" width="100%" height={250} />
                </div>
                <div className="userfirstcontentimg">
                  <Skeleton variant="rectangular" width="100%" height={250} />
                </div>
              </>
            ) : (
              <>
                <div className="userfirstcontentback pi pi-check-circle">
                  Post By - {user.user_fName}
                  {/* <p>
                    <strong>Views:</strong> {views}
                  </p> */}
                </div>

                <div className="userfirstcontentdev">
                  1.{user.blog_title}
                  {data.blog_title}
                </div>
                <br />
                <div className="userfirstcontent">
                 {user.blog_Description}
                  {data.blog_h1}
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <img src={user.blog_img} alt="" />
                </div>
                <div className="userfirstcontentimg">
                  <img src={data.img} alt="" />
                </div>
                <br />
                <br />
                <br />
                <div className="userfirstcontentdev">
                  {user.blog_title2}
                  {data.blog_title2}
                </div>
                <div className="userfirstcontent">
                  {user.blog_Description2}
                  {data.blog_h12}
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <img src={user.blog_img2} alt="" />
                </div>
                <div className="userfirstcontentimg">
                  <img src={data.img} alt="" />
                </div>
                <br />
                <br />
                <div className="userfirstcontentdev">
                  {user.blog_title3}
                  {data.blog_title3}
                </div>
                <div className="userfirstcontent">
                  {user.blog_Description3}
                  {data.blog_h13}
                </div>
                <br />
                <div className="userfirstcontentimg">
                  <img src={user.blog_img3} alt="" />
                </div>
                <div className="userfirstcontentimg">
                  <img src={data.img} alt="" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPostPage;
