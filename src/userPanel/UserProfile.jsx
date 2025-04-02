import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { TabView, TabPanel } from "primereact/tabview";
import "./userprofile.scss";
import UserPost from "./UserPost";
import axios from "axios";

const UserProfile = () => {
  const [userPosts, setUserPosts] = useState([]); // Initialize as an empty array
  const [thisemail, setUserEmail] = useState(""); // Track email state
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const avatar = user?.img || null; // Get avatar image
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const userEmail = user ? user.email : null; // User email from cookies
  const url = process.env.REACT_APP_HOST_URL;

  useEffect(() => {
    // Fetch posts for the logged-in user
    const fetchUserPosts = async () => {
      const email = userEmail; // Get email from the state

      if (!email) {
        console.error("No email found for user.");
        return;
      }

      try {
        const response = await axios.get(`${url}/getUserpost`, {
          params: { email }, // Send the email to the backend to fetch posts
        });

        if (response.status === 200) {
          setUserPosts(response.data.posts); // Set the posts to the state
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        <div className="userdetails">
          <div className="userftext">
            <p>{user?.email}</p>
            <div className="userdtext">
              <p>{user?.role}</p>
              <UserPost />
            </div>
          </div>
          <div className="userpost">
            <hr className="bg-red" />
            <TabView>
              <TabPanel header="My Post" leftIcon="pi pi-desktop mr-2">
                <div className="userpostdetailswithpost gap-5">
                  {userPosts.length === 0 ? (
                    <p>No posts available.</p>
                  ) : (
                    <ul>
                      {userPosts.map((post, index) => (
                        <div className="userpostwithgap">
                          <li key={index}>
                            <img src={post.blog_img} alt="" />
                            <div className="userdetailwithdata">
                              <div className="userafirsttext">
                                {post.blog_title}
                              </div>
                              <p>{post.blog_Description}</p>
                              <br />
                            </div>
                          </li>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              </TabPanel>
              <TabPanel header="Likes" leftIcon="pi pi-heart ml-2">
                <p>Like</p>
              </TabPanel>
              <TabPanel header="_Monetization"  className = "icon " leftIcon="pi  pi-indian-rupee ml-7">
                <p>Monitaigetion</p>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
