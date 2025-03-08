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
      }
    };

    fetchdata();
  }, []);
  return (
    <div>
        <h1>Letest Post</h1>
        <br />
      <div className="TrendingBlogdata gap-5">
        {data.map((all) => (
          <div className="flexpostion">
            <img src={all.img} alt="" />
            <div className="text">
              <h2>{all.blog_title}</h2>
              <p>{all.blog_h1}</p>
              <TimeAgo datetime={all.createdAt} locale="en-US" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alllist;
