import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.scss";
import TimeAgo from "timeago-react";
import moment from "moment";
import { Provider, LikeButton } from "@lyket/react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const Useralldatapostrecived = () => {
  const url = process.env.REACT_APP_HOST_URL;
  const [data, setUserdata] = useState([]); // Store posts
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
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
        `${url}/recivedUserallPost?page=${currentPage}&limit=5`
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
      const isLiked = likedPosts.has(_id); // ✅ Check if post is already liked
  
      const response = await axios.post(`${url}/likePost`, { 
        postId: _id, 
        action: isLiked ? "unlike" : "like" // ✅ Send correct action
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
  
      // ✅ Update likes count in posts state
      setUserdata((prevData) =>
        prevData.map((post) =>
          post._id === _id ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  

  return (
    <div className="heroa">
      <h1 className="h1text"></h1>
      <br />
      <div className="gridcontenta">
        <div className="trposta">
          {data.length > 0 ? (
            data.map((user) => (
              <div className="pcontent container" key={user._id}>
                <a className="alikcontent">
                  <div className="usertickandname">
                    <div className="userfirstdetails">
                      <img src={user.user_tick || defaultAvatar} alt="" />
                      <p className="pi flex">
                        {user.user_fName}
                        <br />
                        <TimeAgo
                          className="timestyle"
                          datetime={user.createdAt}
                          locale="en-US"
                        />
                      </p>
                    </div>
                    <hr />
                  </div>
                  <img src={user.blog_img} alt="Blog" />
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
                      onClick={() => handleLike(user._id)} // ✅ Pass user._id correctly
                    >
                      <motion.span
                        className="heart"
                        initial={{ scale: 0.8 }}
                        animate={
                          likedPosts.has(user._id) ? { scale: [1, 1.4, 1] } : {}
                        }
                      >
                        {likedPosts.has(user._id) ? "💙" : "🤍"}
                      </motion.span>
                    </motion.button>
                    <p>{user.likes} Likes</p> 
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p></p>
          )}
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
