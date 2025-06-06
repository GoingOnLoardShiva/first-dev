import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./useracces.scss";
import "primeicons/primeicons.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import TimeAgo from "timeago-react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserProfileAcces = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const { user_fName } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [data, setData] = useState([]);

  //   const { email_id } = useParams();

  useEffect(() => {
    const useproacc = async () => {
      try {
        const response = await axios.get(
          API_BASE_URL + "/userprofileacces/" + user_fName,
          { headers: { "access-key": key } }
        );

        setData(response.data.userprofileacces);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    const useproaccPost = async () => {
      try {
        const responsea = await axios.get(
          API_BASE_URL + /accespost/ + user_fName,
          {
            headers: { "access-key": key },
          }
        );

        console.log("API Response:", responsea.data);

        if (responsea.status === 200) {
          // Check if it's an array or single object
          const data = responsea.data.userprofileaccesdetail;
          setUserPosts(Array.isArray(data) ? data : [data]);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    useproacc();
    useproaccPost();
  }, [user_fName]);

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div className="pcontent container" key={i}>
        <a className="alikcontent">
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
  const defaultAvatar =
    "https://img.freepik.com/premium-photo/png-cartoon-adult-white-background-photography_53876-905932.jpg?uid=R188847859&ga=GA1.1.1946957145.1736441514&semt=ais_hybrid&w=740";

  return (
    <div>
      {/* <p>{data.user_fName}</p>
       */}
      <div className="userprofileaccesPage">
        <div className="useraccesContent">
          <div className="useraccesContent1">
            <div className="useraccesContent2">
              <img src={data.img || defaultAvatar} alt="" />
              <p>{user_fName}</p>
            </div>
            <div className="useraccesContent3">
              {/* <p>{data.email_id} H</p> */}
            </div>
          </div>
          <div className="useraccesContent4">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Post" {...a11yProps(0)} />
                  <Tab label="About" {...a11yProps(1)} />
                  {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {userPosts.length > 0
                  ? userPosts.map((user) => (
                      <div className="useracdetailscontainer" key={user._id}>
                        <a className="alikcontentac">
                          {/* <img src={user.blog_img} alt="Blog" /> */}
                          {/* <div className="gapss"></div>
                           */}
                          <br />
                          {/* <br /> */}
                          <h3>
                            {user.blog_title?.substring(0, 20) || "Loading"}..
                          </h3>

                          <div className="toptoolfe d-flex">
                            <b></b> <p>{user.likes} Like</p>
                            <b></b>
                            <p className="views pi pi-chart-bar " id="views">
                              <b></b> {user.views} <b></b>
                            </p>
                            <a
                              className="atagac"
                              href={`/user/blogpage/${encodeURIComponent(
                                user._id
                              )}`}
                            >
                              Read now
                            </a>
                          </div>
                        </a>
                      </div>
                    ))
                  : renderSkeleton()}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                Coming Soon
              </CustomTabPanel>
              {/* <CustomTabPanel value={value} index={2}>
                Item Three
              </CustomTabPanel> */}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileAcces;
