import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './O.scss'
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import TimeAgo from "timeago-react";


const Alllist = () => {

  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const res = await axios.get(url + "/list", {
        headers: {
          "access-key": key,
        },
      });
      if (res.status === 200) {
        setData(res.data.list);
        const shuffledData = res.data.list.sort(() => Math.random() - 0.5); // Shuffle data
        setData(shuffledData);
      }
    };

    fetchdata();
  }, []);
  return (
    <div className="hero text-white width-100% ">
      <h1 className="h1text">Trending  Post</h1>
      <br />
      <div className="gridcontnent">
        <div className="trpost">
          {data.map((user) => (
            <div className="pcontent container d-grid">
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

export default Alllist;
