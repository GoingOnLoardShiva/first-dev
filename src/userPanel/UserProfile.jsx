import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { TabView, TabPanel } from "primereact/tabview";
import "./userprofile.scss";
import UserPost from "./UserPost";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
// import { Button } from "primereact/button";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Dialog } from "primereact/dialog";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [Userimage, setUserimage] = useState("");
  const [Userviews, setUserviews] = useState([]);
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
  const [userimg, setUserimg] = useState({});
  const [userve, setUserv] = useState(0);
  const [userac, setUserac] = useState(0);
  // console.log(userimg, "userimg");

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("center");
  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };

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
        {valuea}/<b>1000</b>
      </React.Fragment>
    );
  };

  const toast = useRef(null);

  const fileUploadRef = useRef(null);
  const triggerFileUpload = () => {};

  const handleUpload = async ({ files }) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email_id", userEmail);

    try {
      const res = await axios.post(`${url}/uploadProfileImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "access-key": key,
        },
      });

      if (res.data.imageUrl) {
        setUserimage(res.data.imageUrl);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Profile picture updated!",
          life: 3000,
        });
        Cookies.set(
          "user",
          JSON.stringify({ ...user, img: res.data.imageUrl })
        );
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Image upload failed!",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      const email = userEmail; 

      if (!email) {
        console.error("No email found for user.");
        return;
      }

      try {
        const response = await axios.get(
          url + /getUserpost/,
          {
            params: { email }, 
          },
          { headers: { "access-key": key } }
        );

        if (response.status === 200) {
          setUserPosts(response.data.posts); 
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      // const responsea = await axios.get(
      //   `${url}/getUserpost`,
      //   {
      //     params: { email }, // Send the email to the backend to fetch posts
      //   },
      //   { headers: { "access-key": key } }
      // );

      // if (responsea.status === 200) {
      //   setudata(responsea.data.posts); // Set the posts to the state
      // } else {
      //   console.error("Failed to fetch posts");
      // }
    };

    if (userEmail) {
      fetchUserPosts();
    }

    const fetchUserImage = async () => {
      try {
        const response = await axios.get(url +/userimagerc/+ userEmail, {
          headers: { "access-key": key },
        });
        if (response.code === 200) {
          setUserimage(response.data.user);
          Cookies.set(
            "userimg",
            JSON.stringify({ ...user, img: response.data.user })
          );
        }
        setUserimg(response.data.user);
        setUserac(response.data.followCount);
        console.log(userac);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
      setLoading(false);
    };
    const fetchUserViews = async () => {
      const response = await axios.get(url +/userviews/ + userEmail, {
        headers: { "access-key": key },
      });
      if (response.status === 200) {
        setUserv(response.data.user);
        console.log(response.data.user);
      }
    };
    fetchUserViews();
    fetchUserImage();
  }, [userEmail]);

  return (
    <div>
      <div className="usercontent">
        <div className="userdetails">
          <div className="userftext">
            <div className="useritem gap-2">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-gray-700 font-semibold text-lg">
                    Uploading...
                  </div>
                </div>
              )}
              <Toast ref={toast} />
              <div className="usersetup d-flex gap-3  justify-content-center">
                <Avatar
                  className="imageavt"
                  src={userimg.img || avatar}
                  alt="Profile"
                  sx={{ width: 64, height: 64, bgcolor: green[400] }}
                >
                  {user.email?.substring(0, 1)}
                </Avatar>
                <p className="useremailp">
                  {user ? `${user.email.substring(0, 5)}....` : ""}{" "}
                  <p>{user?.role}</p>
                </p>
                <p className="line"></p>
                {/* <hr /> */}
                <a
                  // href=""
                  label="Bottom"
                  icon="pi pi-arrow-up"
                  onClick={() => show("bottom")}
                  className="p-button-success"
                  // style={{ minWidth: "10rem" }}
                  id="a"
                >
                  <div className="useremailp">
                    <p className="userf">
                      Followers <p>{userac}</p>
                    </p>
                  </div>
                </a>

                <p className="line"></p>
                <SettingsSuggestIcon className="usericon" />
              </div>
            </div>

            <div className="userdtext">
              <div className="se d-flex gap-2 align-items-center justify-content-center">
                <UserPost />
                <Chip
                  label="Upload Profile Picture"
                  className="texta"
                  variant="outlined"
                  color="success"
                  clickable
                  onClick={triggerFileUpload} // Trigger file upload dialog
                />

                {/* Hidden FileUpload Component */}
                <FileUpload
                  ref={fileUploadRef}
                  name="avatar"
                  accept="image/*"
                  maxFileSize={1000000}
                  customUpload
                  uploadHandler={handleUpload}
                  mode="basic"
                  auto
                  style={{ display: "none" }} // Hide the FileUpload component
                />
              </div>
            </div>
          </div>
          <div className="userpost">
            <hr className="bg-red" />
            <TabView style={{ background: "transparent" }}>
              <TabPanel header="My Post" leftIcon="pi pi-desktop mr-2">
                <div className="userpostdetailswithpost gap-5">
                  {userPosts.length === 0 ? (
                    <p>Loading...</p>
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
                              {/* <img src={post.blog_img} alt="" /> */}
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
                              value={userac}
                              displayValueTemplate={valueTemplate}
                            ></ProgressBar>
                          </div>
                          <p>
                            200 Follower Required /
                            {userimg.followAc?.length || 0} Follower{" "}
                          </p>
                          <p>Hurry Up Get Your Monetize Account</p>
                        </div>
                      </div>
                      <div className="Sstep">
                        <h1>2nd Step</h1>
                        <div className="fsstepdes">
                          <div className="card">
                            <ProgressBar
                              value={userve}
                              displayValueTemplate={valueTemplatea}
                            ></ProgressBar>
                          </div>
                          <p>1000 views Required / {userve} views </p>
                          <p>Hurry Up Get Your Monetize Account</p>
                        </div>
                      </div>
                      <Button
                        icon="pi pi-check"
                        disabled
                        tooltip="You are Not eligible"
                        tooltipOptions={{ showOnDisabled: true }}
                        label="Apply"
                      />
                    </div>
                  </div>
                }
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
      <Dialog
        header="My Folllowers"
        visible={visible}
        position={position}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <div className="fac">
          {/* {userimg.followAc} */}
          {userimg?.followAc?.map((user, index) => (
            <div key={index} className="follow-card d-flex gap-2">
              <Avatar label={user.substring(0,1)} className="mr-5" size="xlarge" />
              <p className="username">{user}...</p>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
