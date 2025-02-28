import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-datetime/css/react-datetime.css";
import { Toast } from "primereact/toast";
import { useLocation } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Hero = () => {
  const toast = useRef(null);
  const location = useLocation();
  const API_BASE_URL = process.env.REACT_APP_HOST_URL;
  const API_KEY = process.env.REACT_APP_APIKEY;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trending`, {
          headers: {
            "access-key": API_KEY, // Send API Key in headers
          },
        });
        if (response.status === 200) {
          setData(response.data.trending);
        } else {
          setError("Invalid API response structure");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
      console.log(data);
    };

    fetchBlogs();
    if (location.state?.successMessage) {
      toast.current.show({ severity: "success", summary: "Success", detail: location.state.successMessage, life: 3000 });
    }
  }, [location]);
  return (
    <div className="hero  bg-primary text-white d-flex gap-2 width-100% ">
      <Toast ref={toast} />
        {data.map((user) => (
          <div className="hero__container d-grid" >
            <h4 className="fs-bold">{user._id}</h4> 
            <div className="d-flex gap-2">
             <p>{user.blog_title}</p>
             <p>{user.blog_h1}</p>
             <p>{user.orderDate}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Hero;
