import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { TabView, TabPanel } from "primereact/tabview";
import "./userprofile.scss";
import UserPost from "./UserPost";
import axios from "axios";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from 'primereact/button';

const UserProfile = () => {
  const [Userimage, setUserimage] = useState("");
  const [userPosts, setUserPosts] = useState([]); // Initialize as an empty array
  const [data, setudata] = useState({}); // Initialize as an empty array
  const [thisemail, setUserEmail] = useState(""); // Track email state
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const avatar = user?.img || null; // Get avatar image
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const userEmail = user ? user.email : null; // User email from cookies
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const valueTemplate = (value) => {
    return (
      <React.Fragment>
        {value}/<b>200</b>
      </React.Fragment>
    );
  };
  const valueTemplatea = (valuea) => {
    return (
      <React.Fragment>
        {valuea}/<b>200</b>
      </React.Fragment>
    );
  };

  const toast = useRef(null);

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const imageSub = async () => {
    const sub = await axios.post(url + "/submitimage", {
      Userimage,
    });
  };

  useEffect(() => {
    // Fetch posts for the logged-in user
    const fetchUserPosts = async () => {
      const email = userEmail; // Get email from the state

      if (!email) {
        console.error("No email found for user.");
        return;
      }

      try {
        const response = await axios.get(
          `${url}/getUserpost`,
          {
            params: { email }, // Send the email to the backend to fetch posts
          },
          { headers: { "access-key": key } }
        );

        if (response.status === 200) {
          setUserPosts(response.data.posts); // Set the posts to the state
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      const responsea = await axios.get(
        `${url}/getUserpost`,
        {
          params: { email }, // Send the email to the backend to fetch posts
        },
        { headers: { "access-key": key } }
      );

      if (responsea.status === 200) {
        setudata(responsea.data.posts); // Set the posts to the state
      } else {
        console.error("Failed to fetch posts");
      }
    };

    if (userEmail) {
      fetchUserPosts();
    }
  }, [userEmail]); // Dependency on userEmail to refetch when it changes

  return (
    <div>
      <div className="usercontent">
        <div
          className="useritem d-flex align-items-center gap-2"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: avatar ? "transparent" : "#007bff",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            overflow: "hidden",
          }}
        >
          <div className="div">
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              firstLetter
            )}
          </div>
        </div>

        <div className="userdetails">
          <div className="userftext">
            {/* <div className="card flex justify-content-center bg-black ">
              <Toast ref={toast}></Toast>
              <input type="file" onChange={imageSub} accept="image/*" />
            </div> */}
            <p>{user?.email}</p>
            <div className="userdtext">
              <p>{user?.role}</p>
              <UserPost />
            </div>
          </div>
          <div className="userpost">
            <hr className="bg-red" />
            <TabView style={{ background: "transparent" }}>
              <TabPanel header="My Post" leftIcon="pi pi-desktop mr-2">
                <div className="userpostdetailswithpost gap-5">
                  {userPosts.length === 0 ? (
                    <p>No posts available.</p>
                  ) : (
                    <ul>
                      {userPosts.map((post, index) => (
                        <div className="userpostwithgap d-flex">
                          <li className="flex" key={index._id}>
                            <a
                              className="atag"
                              href={`/user/blogpage/${
                                index?._id
                                  ? encodeURIComponent(
                                      index._id.toString().trim()
                                    )
                                  : ""
                              }`}
                              onClick={() =>
                                console.log("Navigating to:", index?._id)
                              }
                            >
                              <img src={post.blog_img} alt="" />
                              <div className="userdetailwithdata ">
                                <div className="userafirsttext">
                                  {post.blog_title
                                    ? post.blog_title.substring(0, 30)
                                    : "Loading"}
                                </div>
                                <p>
                                  {post.blog_Description
                                    ? post.blog_Description.substring(0, 100)
                                    : "Loading"}
                                </p>
                                <br />
                                <div className="likeview d-flex gap-3">
                                  <p>{post.likes}Likes</p>
                                  <p>{post.views}Views</p>
                                </div>
                              </div>
                            </a>
                          </li>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              </TabPanel>
              {/* <TabPanel header="Likes" leftIcon="pi pi-heart ml-2">
                <p>Like</p>
              </TabPanel> */}
              <TabPanel
                header="_Monetization"
                className="icon "
                leftIcon="pi  pi-indian-rupee ml-7"
              >
                {
                  <div>
                    <div className="monetizationfirst">
                      <div className="monete">
                        <p className="mon">Monetization</p>
                        <p>Earn money with your blog</p>
                      </div>
                      <div className="fstep">
                        <h1>1st Step</h1>
                        <div className="fsstepdes">
                          <div className="card">
                            <ProgressBar
                              value={0}
                              displayValueTemplate={valueTemplate}
                            ></ProgressBar>
                          </div>
                          <p>200 Follower Required / 0 Follower </p>
                          <p>Hurry Up Get Your Monetize Account</p>
                        </div>
                      </div>
                      <div className="Sstep">
                        <h1>2nd Step</h1>
                        <div className="fsstepdes">
                          <div className="card">
                            <ProgressBar
                              value={0}
                              displayValueTemplate={valueTemplatea}
                            ></ProgressBar>
                          </div>
                          <p>1000 views Required / {data.views} 0 views </p>
                          <p>Hurry Up Get Your Monetize Account</p>
                        </div>
                      </div>
                      <Button icon="pi pi-check" disabled tooltip="You are Not eligible" tooltipOptions={{ showOnDisabled: true }} label="Apply" />
                    </div>
                  </div>
                }
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
