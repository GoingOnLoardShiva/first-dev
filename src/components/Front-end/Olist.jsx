import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-datetime/css/react-datetime.css";
import "./list.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TimeAgo from "timeago-react";

const List = () => {
  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list`, {
          headers: {
            "access-key": key, // Send API Key in headers
          },
        });

        // Check if the response contains data
        if (response.status === 200 && response.data.list) {
          const shuffledData = response.data.list.sort(
            () => Math.random() - 0.5
          ); // Shuffle data
          setData(shuffledData);
        } else {
          setError("No data found");
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchBlogs();
  }, [API_BASE_URL, key]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="heroa">
      <h1 className="h1text">All Post</h1>
      <br />
      <div className="gridcontenta">
        <div className="trposta">
          {data.length > 0 ? (
            data.map((user) => (
              <div className="pcontent container" key={user.id}>
                <a href={user.link}>
                  <div className="usertickandname">
                    <img src={user.user_tick} alt="" />
                    <p className="pi">
                      {user.email_id ? user.email_id.substring(0, 5) : "User"}
                    </p>
                  </div>
                  <img src={user.img} alt={user.blog_title} />
                  <h3>
                    {user.blog_title
                      ? user.blog_title.substring(0, 120)
                      : "Loading"}
                  </h3>
                  <div className="pblogcontent gap-2">
                    <p className="mb-2">
                      {user.blog_h1
                        ? user.blog_h1.substring(0, 120)
                        : "Loading"}
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
                  <br />
                </a>
              </div>
            ))
          ) : (
            <div className="loading-message">Loading trending posts...</div>
          )}
        </div>
      </div>
      {/* <Container>
        <Row>
          <Col xs={{ order: "last" }}>First, but last</Col>
          <Col xs>Second, but unordered</Col>
          <Col xs={{ order: "first" }}>Third, but first</Col>
          <Col xs={{ order: "first" }}>Third, but first</Col>
        </Row>
      </Container> */}
    </div>
  );
};

export default List;
