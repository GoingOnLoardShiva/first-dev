import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.scss";
import TimeAgo from "timeago-react";

const Useralldatapostrecived = () => {
  const url = process.env.REACT_APP_HOST_URL;
  const [data, setUserdata] = useState({});

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
                <a href={user.link}>
                  <img src={user.blog_img} />
                  <h3>
                    {user.blog_title
                      ? user.blog_title.substring(0, 80)
                      : "Loading"}
                  </h3>
                  <div className="pblogcontent gap-2">
                    <p className="mb-2">
                      {user.blog_Description
                        ? user.blog_Description.substring(0, 120)
                        : ""}
                    </p>
                    <p>{user.orderDate}</p>
                    <TimeAgo datetime={user.createdAt} locale="en-US" />
                  </div>
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
