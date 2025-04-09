import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.scss";
import { Skeleton } from "@mui/material";
import TimeAgo from "timeago-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
// import moment from "moment";
import moment from "moment-timezone";
import { green } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const Useralldatapostrecived = () => {
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setUserdata] = useState([]); // Store posts
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const formatDate = (rowData) => {
    return moment(rowData.do_b).format("DD-MM-YYYY");
  };
  const defaultAvatar =
    "https://img.freepik.com/premium-photo/png-cartoon-adult-white-background-photography_53876-905932.jpg?uid=R188847859&ga=GA1.1.1946957145.1736441514&semt=ais_hybrid&w=740";

  useEffect(() => {
    fetchUserPosts(1, true); // Fetch new posts on refresh
  }, []);

  const fetchUserPosts = async (currentPage, reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/recivedUserallPost?page=${currentPage}&limit=8`,
        { headers: { "access-key": key } }
      );

      if (Array.isArray(response.data)) {
        const newPosts = response.data.filter(
          (post) => !data.some((existingPost) => existingPost._id === post._id)
        ); // Remove duplicates

        if (newPosts.length === 0) {
          setHasMore(false); // No more new posts
        } else {
          setUserdata((prev) => (reset ? newPosts : [...prev, ...newPosts]));
          setPage(currentPage + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
    setLoading(false);
  };

  const handleLike = async (_id) => {
    const user = Cookies.get("user"); // Retrieve user cookie

    if (!user) {
      alert("You must be logged in to like posts.");
      return;
    }
    try {
      const isLiked = likedPosts.has(_id);

      const response = await axios.post(`${url}/likePost`, {
        postId: _id,
        action: isLiked ? "unlike" : "like",
      });

      setLikedPosts((prev) => {
        const updatedLikes = new Set(prev);
        if (isLiked) {
          updatedLikes.delete(_id);
        } else {
          updatedLikes.add(_id);
        }
        return updatedLikes;
      });
      setUserdata((prevData) =>
        prevData.map((post) =>
          post._id === _id ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  const followbutton = async (user_fName) => {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user) {
      alert("You must be logged in to follow users.");
      return;
    }

    const userEmail = user.email;

    try {
      const response = await axios.post(url + "/followuser", {
        userEmail,
        user_fName,
      });
      setFollowingAuthors((prev) => [...prev, user_fName]);
    } catch (error) {
      if (error.response?.data?.message === "You have already followed") {
        alert("You have already followed this user.");
      } else {
        console.error("Follow failed:", error);
        alert("Something went wrong.");
      }
    }
  };

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div className="pcontent container" key={i}>
        <a className="alikcontent">
          <div className="usertickandname">
            <div className="userfirstdetails">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="pi flex" style={{ marginLeft: "10px" }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={60} />
              </div>
            </div>
            <hr />
          </div>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="40%" height={20} />
          <div className="toptoolfe" style={{ marginTop: "10px" }}>
            <Skeleton variant="rectangular" width={80} height={30} />
            <Skeleton variant="text" width={40} />
          </div>
        </a>
      </div>
    ));
  };

  return (
    <div className="heroa">
      <h1 className="h1text"></h1>
      <br />
      <div className="gridcontenta">
        <div className="trposta">
          {data.length > 0
            ? data.map((user) => (
                <div className="pcontent container" key={user._id}>
                  <a className="alikcontent">
                    <div className="usertickandname d-flex">
                      <a
                        className="allaccespostuser"
                        href={`/user/userid/${encodeURIComponent(
                          user.user_fName
                        )}`}
                      >
                        <div className="userfirstdetails">
                          <Avatar sx={{ bgcolor: green[400] }}>
                            {user.user_fName?.substring(0, 1)}
                          </Avatar>
                          {/* <img src={user.user_tick || defaultAvatar} alt="" /> */}
                          <p className="pi flex">
                            {user.user_fName} <br />
                            {/* <div className="time "  moment="true">
                            {user.createdAt}
                            
                          </div> */}
                            <TimeAgo
                              className="timestyle"
                              datetime={user.createdAt}
                              locale="en-US"
                            />
                            {/* <TimeAgo date="Aug 29, 2014" /> */}
                          </p>
                        </div>
                      </a>
                      <Chip
                        className="folowbutton"
                        color="primary"
                        label={followingAuthors.includes(user.user_fName)
                          ? "Following"
                          : "Follow"}
                        variant="outlined"
                        onClick={() => followbutton(user.user_fName)}
                        disabled={followingAuthors.includes(user.user_fName)}
                      >
                        {/* <label htmlFor="">
                          {" "}
                          {followingAuthors.includes(user.user_fName)
                            ? "Following"
                            : "Follow"}
                        </label> */}
                      </Chip>
                      {/* <button
                        onClick={() => followbutton(user.user_fName)}
                        disabled={followingAuthors.includes(user.user_fName)}
                      >
                        {followingAuthors.includes(user.user_fName)
                          ? "Following"
                          : "Follow"}
                      </button> */}

                      <hr />
                    </div>
                    <img src={user.blog_img} alt="Blog" />
                    {/* <div className="gapss"></div>
                     */}
                    <br />
                    <br />
                    <h3>{user.blog_title?.substring(0, 40) || "Loading"}</h3>
                    <a
                      className="atag"
                      href={`/user/blogpage/${encodeURIComponent(user._id)}`}
                    >
                      Read more
                    </a>

                    <div className="toptoolfe">
                      <motion.button
                        className={`like-button ${
                          likedPosts.has(user._id) ? "liked" : ""
                        }`}
                        whileTap={{ scale: 1.3 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleLike(user._id)}
                      >
                        <motion.span
                          className="heart"
                          initial={{ scale: 0.8 }}
                          animate={
                            likedPosts.has(user._id)
                              ? { scale: [1, 1.4, 1] }
                              : {}
                          }
                        >
                          {likedPosts.has(user._id) ? "💙" : "🤍"}
                        </motion.span>
                        <p>{user.likes}</p>
                      </motion.button>

                      <p className="pi pi-chart-bar" id="views">
                        <b></b> {user.views}
                      </p>
                    </div>
                  </a>
                </div>
              ))
            : renderSkeleton()}
        </div>
      </div>

      {/* Load More Button */}
      <div className="text-center mt-6">
        {hasMore ? (
          <button onClick={() => fetchUserPosts(page)} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        ) : (
          <p>No more posts to show.</p>
        )}
      </div>
    </div>
  );
};

export default Useralldatapostrecived;
