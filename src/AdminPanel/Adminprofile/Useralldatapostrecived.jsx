import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.scss";
import TimeAgo from "timeago-react";
import moment from "moment";

const Useralldatapostrecived = () => {
  const url = process.env.REACT_APP_HOST_URL;
  const [data, setUserdata] = useState({});
  const formatDate = (rowData) => {
    return moment(rowData.do_b).format("DD-MM-YYYY");
  };
  const defaultAvatar =
    "https://img.freepik.com/premium-photo/png-cartoon-adult-white-background-photography_53876-905932.jpg?uid=R188847859&ga=GA1.1.1946957145.1736441514&semt=ais_hybrid&w=740";

  const [isFollowing, setIsFollowing] = useState("");

  const handleFollow = () => {
    setIsFollowing(true);
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userres = await axios.get(`${url}/recivedUserallPost`);
        console.log("API Response:", userres.data); // Debugging

        // Set response directly since it's already an array
        if (Array.isArray(userres.data)) {
          const shuffledData = userres.data.sort(() => Math.random() - 0.5);
          setUserdata(shuffledData);
        } else {
          console.error("Unexpected API response format:", userres.data);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [url]);

  return (
    <div className="heroa">
      <h1 className="h1text"></h1>
      <br />
      <div className="gridcontenta">
        <div className="trposta">
          {data.length > 0 ? (
            data.map((user) => (
              <div className="pcontent container" key={user.id}>
                <a
                  href={`/user/blogpage/${
                    user?._id
                      ? encodeURIComponent(user._id.toString().trim())
                      : ""
                  }`}
                  onClick={() => console.log("Navigating to:", user?._id)}
                  className="alikcontent"
                >
                  <div className="usertickandname">
                    <div className="userfirstdetails">
                      <img src={user.user_tick || defaultAvatar} alt="" />
                      <p className="pi flex">
                        {user.user_fName}{" "}
                        <button onClick={handleFollow} disabled={isFollowing}>
                          {isFollowing ? "Following" : "Follow"}
                        </button>{" "}
                        <br />{" "}
                        {/* <p className="pfodate" body={formatDate}>{user.createdAt}</p> */}
                        <TimeAgo
                          className="timestyle"
                          datetime={user.createdAt}
                          locale="en-US"
                        />
                      </p>
                    </div>
                    <hr />
                  </div>
                  <img src={user.blog_img} />
                  <h3>
                    {user.blog_title
                      ? user.blog_title.substring(0, 40)
                      : "Loading"}
                  </h3>
                  {/* <div className="pblogcontent gap-2">
                    <p className="mb-2">
                      {user.blog_Description
                        ? user.blog_Description.substring(0, 120)
                        : ""}
                    </p>
                    <p>{user.orderDate}</p>
                  </div> */}
                  <a
                    className="atag"
                    href={`/user/blogpage/${
                      user?._id
                        ? encodeURIComponent(user._id.toString().trim())
                        : ""
                    }`}
                    onClick={() => console.log("Navigating to:", user?._id)}
                  >
                    Read more
                  </a>
                  <div className="toptoolfe">
                    <div className="like pi pi-heart">
                      {" "}
                      <b></b>Like <div className="views pi pi-eye"> Views</div>
                      {/* <div className="send pi pi-send"> Share</div> */}
                    </div>
                    <b></b>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p>Loading or No Data Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Useralldatapostrecived;
