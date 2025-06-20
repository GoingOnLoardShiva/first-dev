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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import moment from "moment-timezone";
import { Global } from '@emotion/react';
// import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import IosShareIcon from '@mui/icons-material/IosShare';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // MUI icon
import { blue } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';



import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Useimgupload from "./usercomponents/Useimgupload";




//drawer
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




const UserProfile = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [Userimage, setUserimage] = useState("");
  const [Userviews, setUserviews] = useState([]);
  const [userPosts, setUserPosts] = useState([]); // Initialize as an empty array
  const [data, setudata] = useState({}); // Initialize as an empty array
  const [thisemail, setUserEmail] = useState(""); // Track email state
  const userData = localStorage.getItem("user");
  const parsed = userData ? JSON.parse(userData) : null;
  const user = parsed?.user?.[0] || null;
  const userEmail = user?.email_id || null;
  const userRole = parsed?.role || "";
  const Userfname = user?.user_fName || "";
  const secureUID = parsed?.secureUID || "";
  const avatar = user?.img || null; // Get avatar image
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [userimg, setUserimg] = useState({});
  const [userve, setUserv] = useState(0);
  const [userac, setUserac] = useState(0);
  const formatDate = (date) => {
    return moment(date).format("DD MMMM")
  };
  // console.log(userimg, "userimg");

  const formatRelativeTime = (date) => {
    if (!date) return "No date";
    return moment(date).fromNow(); // Example: "2 days ago"
  };


  //logout
  const handleLogout = ()=>{
    localStorage.removeItem('user');
    // nevigate(0)
  }

  //Drawer
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  const [visible, setVisible] = useState(false);
  const [visibleb, setVisibleb] = useState(false);
  const [visiblea, setVisiblea] = useState(false);
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
        {valuea}/<b>200</b>
      </React.Fragment>
    );
  };

  const toast = useRef(null);


  useEffect(() => {
    const userData = localStorage.getItem("user");
    const parsed = userData ? JSON.parse(userData) : null;
    const user = parsed?.user?.[0] || null;
    const userEmail = user?.email_id;


    if (!userEmail) {
      console.error("No email found for user.");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${url}/getUserpost/`, {
          params: { email: userEmail },
          headers: { "access-key": key },
        });
        if (response.status === 200) {
          setUserPosts(response.data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUserImage = async () => {
      try {
        const response = await axios.get(`${url}/userimagerc/${userEmail}`, {
          headers: { "access-key": key },
        });
        if (response.status === 200) {
          setUserimage(response.data.user);
          setUserimg(response.data.user);
          setUserac(response.data.followCount || 0);
          Cookies.set("userimg", JSON.stringify({ ...user, img: response.data.user?.img || "" }));
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserViews = async () => {
      try {
        const response = await axios.get(`${url}/userviews/${userEmail}`, {
          headers: { "access-key": key },
        });
        if (response.status === 200) {
          setUserv(response.data.user);
          console.log(userve)
        }
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    fetchUserPosts();
    fetchUserImage();
    fetchUserViews();
  }, []);


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
                  {/* {Userfname} */}
                </Avatar>
                <div className="userverifiyed" style={{ position: "absolute", marginRight: "230px", marginTop: "45px" }}>
                  {userimg.verified && (
                    <CheckCircleIcon style={{ color: blue[500], fontSize: 18 }} titleAccess="Verified User" />
                  )}
                </div>


                <p className="useremailp" style={{ fontWeight: "bold" }}>
                  {Userfname}
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>Creator</p>
                </p>
                <p className="line" ></p>
                {/* <hr /> */}
                <a
                  // href=""
                  label="Bottom"
                  icon="pi pi-arrow-up"
                  onClick={() => show("bottom")}
                  className="p-button-success"
                  id="a"
                  style={{ alignItems: "center", }}
                >
                  <div className="useremailp">
                    <p className="userf" style={{ fontWeight: "bold" }}>
                      Followers <p style={{ fontSize: "12px", fontWeight: "bold" }}>{userac}</p>
                    </p>
                  </div>
                </a>

                <p className="line" style={{ marginLeft: "15px" }}></p>
                <IconButton style={{ marginBottom: "35px" }} onClick={toggleDrawer(true)}>
                  <MoreVertIcon />
                </IconButton>
                <Root>
                  <CssBaseline />
                  <Global
                    styles={{
                      '.MuiDrawer-root > .MuiPaper-root': {
                        height: 'fitcontent', // Increase drawer height here
                        maxWidth: '500px',
                        justifyContent: "center",
                        display: "flex",
                        margin: "auto", // Increase drawer height here
                        overflow: 'visible',
                        borderRadius: '50px', // Add border radius to the drawer
                      },
                    }}
                  />
                  {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
                    <Button onClick={toggleDrawer(true)}>Open</Button>
                  </Box> */}
                  <SwipeableDrawer
                    container={container}
                    anchor="bottom"
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={false}
                    keepMounted
                    style={{ borderRadius: '50px', }}
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
                      style={{ borderRadius: '50px', }}
                    >
                      {/* <Puller /> */}
                      {/* <SettingsIcon/> */}
                      {/* <Typography sx={{ p: 2, color: 'text.secondary' }}  ></Typography> */}
                    </StyledBox>

                    <StyledBox sx={{ padding: "40px", height: '100%', overflow: 'auto', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                      {/* <Skeleton variant="rectangular" height="100%" /> */}
                      <div className="setting" style={{ alignItems: "ceneter", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px" }}>
                        <SettingsIcon />
                        Setting
                      </div>
                      <div className="setting" style={{ alignItems: "ceneter", marginTop: "10px", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px" }}>
                        <AccountCircleIcon />
                        Account Setting
                      </div>
                      <div className="setting" style={{ alignItems: "ceneter", marginTop: "10px", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px", }}>
                        <AdminPanelSettingsIcon />
                        Security Setting
                      </div>
                      <div className="setting" style={{ alignItems: "ceneter", marginTop: "10px", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px" }}>
                        <MonetizationOnIcon />
                        Monetization Setting
                      </div>
                      <div className="setting" style={{ alignItems: "ceneter", marginTop: "10px", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px" }}>
                        <IosShareIcon />
                        Share
                      </div>
                      <div className="setting"onClick={handleLogout} style={{ alignItems: "ceneter", marginTop: "10px", background: "rgba(212, 212, 212, 0.322)", padding: "10px", borderRadius: "20px" }}>
                        <LogoutIcon  />
                        Logout
                      </div>

                    </StyledBox>
                  </SwipeableDrawer>
                </Root>

              </div>
            </div>

            <div className="userdtext">
              <div className="se d-flex gap-2 align-items-center justify-content-center">

                <Chip
                  label="Create post" icon="pi pi-external-link" onClick={() => setVisibleb(true)}  // Trigger file upload dialog
                />
                <Chip
                  label="Upload Picture" icon="pi pi-external-link" onClick={() => setVisiblea(true)}  // Trigger file upload dialog
                />
                <Dialog header="Upload Picture" visible={visiblea} style={{ width: '100vw' }} onHide={() => { if (!visiblea) return; setVisiblea(false); }}>
                  <Useimgupload />
                </Dialog>
                <Dialog header="Create Post" visible={visibleb} style={{ width: '100vw' }} onHide={() => { if (!visibleb) return; setVisibleb(false); }}>
                  <UserPost />
                </Dialog>
              </div>
            </div>
          </div>
          <div className="userpost">
            <hr className="bg-red" />
            <TabView style={{ background: "transparent" }}>
              <TabPanel header="My Post" leftIcon="pi pi-desktop">
                <div className="userpostdetailswithpost gap-5">
                  {userPosts.length === 0 ? (
                    <p>Loading...</p>
                  ) : (
                    <ul>
                      {userPosts.map((post, index) => (
                        <div key={index._id} style={{ gap: "20px", }} className="userpostwithgap ">
                          <div className="userdeatilswithacs d-flex " style={{ alignItems: "center" }}>
                            <div className="userfirstdetails d-flex gap-2" >
                              <Avatar
                                style={{ margin: "0px" }}
                                src={userimg.img}
                                sx={{ bgcolor: grey[400], width: 40, height: 40 }}
                              />
                              <p className="pi flex">
                                <div className="pverify d-flex" style={{ alignItems: "center" }}>
                                  {userimg.user_fName} <br />
                                  {userimg.verified && (
                                    <CheckCircleIcon style={{ color: blue[500], fontSize: 18 }} titleAccess="Verified User" />
                                  )}
                                </div>
                                <p style={{ fontSize: "11px", marginLeft: "0px", marginTop: "2px", display: "flex" }}>{formatDate(userimg.createAt)} <b></b><p> <b></b>{formatRelativeTime(userimg.createAt)}</p></p>
                              </p>
                            </div>
                            <IconButton style={{position: "relative",marginBottom: "35px"}} >
                              <MoreVertIcon />
                            </IconButton>

                          </div>
                          <div className="accesimguser">
                            <img src={post.image} alt="" />
                          </div>
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
                          <p>1000 Likes Required / {userve} Likes </p>
                          <p>Hurry Up Get Your Monetize Account</p>
                        </div>
                      </div>
                      <Chip
                        label="Monetize Account" disabled icon="pi pi-external-link"
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
              <Avatar className="mr-5" size="xlarge" />
              <p className="username">{user}...</p>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;