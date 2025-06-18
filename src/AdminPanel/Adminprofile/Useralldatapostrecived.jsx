import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.scss";
import { Skeleton } from "@mui/material";
// import TimeAgo from "timeago-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
// import moment from "moment";
import moment from "moment-timezone";
import { grey } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { DateTime } from "luxon"; // Import Luxon
import Stack from "@mui/material/Stack";
import { Dialog } from "primereact/dialog";
import TimeAgo from "timeago-react"
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import Chip from "@mui/material/Chip";











const drawerBleeding = 56;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

const Useralldatapostrecived = (props: Props) => {

  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setUserdata] = useState([]); // Store posts
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState('center');

  const localUserData = JSON.parse(localStorage.getItem("user"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserEmail = currentUser?.user?.[0]?.email_id;

  const userObject = localUserData?.user?.[0]; // safely get first user object
  const userEmail = userObject?.email_id;
  const userId = userObject?._id;
  const user_fName = userObject?.user_fName;
  const userImage = userObject?.img;
  const [postusede, setpostusede] = useState([])
  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };
  const formatDate = (date) => {
    return moment(date).format("DD MMMM")
  };
  // const timeAgo = new TimeAgo('en-US')
  // const timeAgo = moment("YYYY-MM-DD").fromNow();
  const [selectedPost, setSelectedPost] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const defaultAvatar = (
    <img
      className="imagani"
      style={{ width: "40px", height: "40px" }}
      src="/lovea.gif"
      alt=""
    />
  );

  const defaultAvatarl = (
    <img
      className="imagani"
      style={{ width: "40px", height: "40px" }}
      src="/love.gif"
      alt=""
    />
  );
  const defaultAvatara = (
    <img style={{ width: "30px", height: "30px" }} src="/growtha.gif" alt="" />
  );

  useEffect(() => {
    fetchUserPosts(1, true);
    // fetchUserImage() 
  }, []);
  const followverify = async () => {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;


    if (!user) {
      alert("You must be logged in to follow users.");
      return;
    }

    const userEmail = user.email;

    try {
      const response = await axios.get(url + "/followverify", {
        headers: { "access-key": key },
      });
      if (response.data.followingAuthors) {
        setFollowingAuthors(response.data.followingAuthors);
      }
    } catch (error) {
      console.error("Error verifying follows:", error);
    }
  }
  const fetchUserImage = async () => {
    // const userEmail = user;
    try {
      const response = await axios.get(url + /userimagerc/ + userEmail, {
        headers: { "access-key": key },
      });
      if (response.code === 200) {
        setpostusede(response.data);
      }
      console.log("User image fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
    setLoading(false);
  };

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
        );
        Cookies.set("postdetails", JSON.stringify(response.data), { expires: 7 });

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

  console.log([{ data }]);
  const handleLike = async (_id) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user cookie

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
    // const userCookie = Cookies.get("user");
    const user = userObject

    if (!user) {
      alert("You must be logged in to follow users.");
      return;
    }

    // const userEmail = user.email;

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
            ? data.map((usera) => (
              <div className="pcontent container" key={usera._id} onClick={() => {
                setSelectedPost(usera);
                setDrawerOpen(true);
              }}>
                <a className="alikcontent">
                  <div className="usertickandname d-flex" style={{ margin: "0px" }}>
                    <a
                      className="allaccespostuser"
                      href={`/user/userid/${encodeURIComponent(
                        usera.user_fName
                      )}`}
                    >
                      <div className="userfirstdetails">
                        <Avatar
                          src={usera.userProfileImage}
                          sx={{ bgcolor: grey[400], width: 40, height: 40 }}
                        />
                        <p className="pi flex">
                          {usera.user_fName} <br />
                          <p style={{ fontSize: "10px", marginLeft: "0px" }}>{formatDate(usera.createdAt)}</p>
                        </p>
                      </div>
                    </a>
                    <Chip
                      className="folowbutton"
                      color="primary"
                      label={
                        followingAuthors.includes(usera.user_fName)
                          ? "Following"
                          : "Follow"
                      }
                      variant="outlined"
                      onClick={() => followbutton(usera.user_fName)}
                      disabled={followingAuthors.includes(usera.user_fName)}
                    >
                    </Chip>
                    <hr />
                  </div>
                  <div className="imgscale" style={{ margin: "0px", width: "300px", height: "200px", backgroundColor: "white", margin: "0px", padding: "0px", overflow: "hidden", backgroundClip: "cover" }}>
                    <img src={usera.image} style={{ margin: "0px" }} alt="Blog" onClick={toggleDrawer(true)} />
                  </div>

                  <br />
                  <br />
                  <p style={{ margin: "0px", fontSize: "20px" }} onClick={() => show('bottom')} >{usera.writecontnet?.substring(0, 40) || "Loading"}</p>
                  <div className="toptoolfe" style={{ margin: "0px" }}>
                    <motion.button
                      className={`like-button ${likedPosts.has(usera._id) ? "liked" : ""
                        }`}
                      whileTap={{ scale: 1.3 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleLike(usera._id)}
                      style={{ margin: "0px" }}
                    >
                      <motion.span
                        className="heart"
                        initial={{ scale: 0.8 }}
                        animate={
                          likedPosts.has(usera._id)
                            ? { scale: [0.5, 0.6, 0.5] }
                            : {}
                        }
                        style={{ margin: "0px" }}
                      >
                        {likedPosts.has(usera._id)
                          ? defaultAvatarl
                          : defaultAvatar}
                      </motion.span>
                      <p style={{ margin: "0px" }} className="color-black" id="viewsa"><b>{usera.likes}</b></p>
                    </motion.button>

                    {/* <p className="pi" id="views" style={{ margin: "0px" }}>
                      {defaultAvatara}
                      <p id="viewsb"><b>{usera.views}</b> </p>
                    </p> */}
                  </div>
                  <Root >
                    <CssBaseline style={{ height: "1000px" }} />
                    <Global
                      styles={{
                        '.MuiDrawer-root > .MuiPaper-root': {
                          height: '80%', // Increase drawer height here
                          maxWidth: '500px',
                          justifyContent: "center",
                          display: "flex",
                          margin: "auto", // Increase drawer height here
                          overflow: 'visible',
                        },
                      }}


                    />
                    <SwipeableDrawer
                      container={container}
                      anchor="bottom"
                      open={open}
                      onClose={toggleDrawer(false)}
                      onOpen={toggleDrawer(true)}
                      swipeAreaWidth={drawerBleeding}
                      disableSwipeToOpen={false}
                      keepMounted


                    >
                      <StyledBox
                        sx={{
                          position: 'absolute',
                          top: -drawerBleeding,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          visibility: 'visible',
                          right: 0,
                          left: 0,
                        }}
                      // style={{ height: "100%" }}
                      //  style={{padding: "10px"}}
                      // style={{ margin: "0px", width: "300px", }}
                      >
                        <Puller />
                        {/* <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography> */}
                      </StyledBox>
                      {selectedPost && (


                        <StyledBox sx={{ px: 2, pb: 2, padding: "20px", height: '100%', width: "400px", margin: "auto", msOverflowStyle: "none", scrollbarWidth: "none", overflow: 'auto' }}>
                          {/* <Skeleton variant="rectangular" height="100%" /> */}
                          <div className="userfirstdetails" style={{ display: "flex" }}>
                            <Avatar
                              src={selectedPost.userProfileImage}
                              sx={{ bgcolor: grey[400], width: 40, height: 40 }}
                            />
                            <p className="pi flex">
                              {usera.user_fName} <br />
                              <p style={{ fontSize: "10px", marginLeft: "0px" }}>{formatDate(selectedPost.createdAt)}</p>
                            </p>
                            <Chip
                              className="folowbutton"
                              color="primary"
                              style={{ marginLeft: "auto" }}
                              label={
                                followingAuthors.includes(selectedPost.user_fName)
                                  ? "Following"
                                  : "Follow"
                              }
                              variant="outlined"
                              onClick={() => followbutton(selectedPost.user_fName)}
                              disabled={followingAuthors.includes(selectedPost.user_fName)}
                            >
                            </Chip>
                          </div>
                          <div className="imgscale" >
                            <img src={selectedPost.image} style={{ margin: "0px", width: "300px", justifyContent: "center", display: "flex", alignItems: "center", margin: "auto" }} alt="Blog" />
                          </div>
                          <p style={{ margin: "0px", fontSize: "20px" }} onClick={() => show('bottom')} >{usera.writecontnet?.substring(0, 40) || "Loading"}</p>
                          <div className="toptoolfe" style={{ margin: "0px" }}>
                            <motion.button
                              className={`like-button ${likedPosts.has(selectedPost._id) ? "liked" : ""
                                }`}
                              whileTap={{ scale: 1.3 }}
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleLike(selectedPost._id)}
                              style={{ margin: "0px", border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
                            >
                              <motion.span
                                className="heart"
                                initial={{ scale: 0.8 }}
                                animate={
                                  likedPosts.has(selectedPost._id)
                                    ? { scale: [1, 1.4, 1] }
                                    : {}
                                }
                                style={{ margin: "0px" }}
                              >
                                {likedPosts.has(selectedPost._id)
                                  ? defaultAvatarl
                                  : defaultAvatar}
                              </motion.span>
                              <p style={{ margin: "0px" }} className="color-black" id="viewsa"><b>{selectedPost.likes}</b></p>
                            </motion.button>


                          </div>

                        </StyledBox>
                      )}
                    </SwipeableDrawer>
                  </Root>
                </a>
              </div>
            ))
            : renderSkeleton()}
        </div>
      </div>

      {/* Load More Button */}
      <div className="text-center mt-6">
        {hasMore ? (
          <Chip label="Load More" onClick={() => fetchUserPosts(page)} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Chip>
        ) : (
          <p>No more posts to show.</p>
        )}
      </div>

    </div>
  );
};

export default Useralldatapostrecived;