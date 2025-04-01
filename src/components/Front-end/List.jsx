import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-datetime/css/react-datetime.css";
import "./list.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TimeAgo from "timeago-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Hero = () => {
  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get(`${API_BASE_URL}/trending`, {
        headers: {
          "access-key": key, // Send API Key in headers
        },
      });
      
      if (response.status === 200) {
        setData(response.data.trending);
        const shuffledData = response.data.trending.sort(() => Math.random() - 0.5); // Shuffle data
        setData(shuffledData);
      } 
    };

    fetchBlogs();
  }, []);
  return (
    <div className="hero text-white width-100% ">
      <h1 className="h1text">Trending  Post</h1>
      <br />
      <div className="gridcontnent">
        <div className="trpost">
          {data.map((user) => (
            <div className="pcontent container d-grid" key={user.id}>
              <a href={user.link}>
                <img src={user.img} alt="" />
                <h3>{user.blog_title}</h3>
                <div className="pblogcontent gap-2">
                  <p className="mb-2">{user.blog_h1}</p>
                  <p>{user.orderDate}</p>
                  <TimeAgo datetime={user.createdAt} locale="en-US" />
                </div>
                <a className="atag" href={user.link}>
                  Read more
                </a>
              </a>
            </div>
          ))}
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

export default Hero;
