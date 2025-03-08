import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import TimeAgo from "timeago-react";

import Cookies from "js-cookie";
import "./all.scss";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const Alllist = () => {
  const toast = useRef(null);
  const [user, setUser] = useState(null);
  const buttonEl = useRef(null);
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visiblea, setVisiblea] = useState(false);
  const [userId, setUserId] = useState("");
  const [img, setImage] = useState("");
  const [blog_title, setBlog] = useState("");
  const [blog_h1, setH1] = useState("");
  const [is_trending, settrending] = useState("");
  const [link, setelink] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const navigate = useNavigate();
  const reject = ({ all }) => {
    toast.current.show({
      severity: "warn",
      summary: "Cancel",
      detail: "You have Cancel",
      life: 3000,
    });
  };
  const showTemplate = (id) => {
    confirmDialog({
      group: "templating",
      header: "Confirmation",
      message: (
        <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
          <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
          <span>Please confirm to Delete Blog</span>
        </div>
      ),
      accept: () => handleDelete(id),
      reject,
    });
  };
  const handleDelete = async (id) => {
    const de = await axios.delete(`${url}/Delete/${id}`);
    console.log("Deleted successfully");
    if (de.status === 200) {
      toast.current.show({
        severity: "info",
        summary: "Deleted",
        detail: "Blog Delete Sucsessfull",
        life: 3000,
      });
      navigate(0);
    }
  };

  const updateUser = async () => {
    const response = await axios.put(
      `${url}/updateData/${userId}`,
      {
        img,
        blog_title,
        blog_h1,
        is_trending,
        link,
      },
      { headers: { "access-key": key } }
    );
    if (response.status === 200) {
      navigate(0);
    }
    if (response.status === 500) {
      alert(response);
    }
  };

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
    const userData = Cookies.get("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);

      // ❌ If the user is NOT an admin, redirect to login
      if (parsedUser.role !== "admin") {
        alert("❌ Access Denied! Admins Only.");
        navigate("/login");
      } else {
        setUser(parsedUser); // ✅ Set user data if admin
      }
    } else {
      // ❌ If no user data, redirect to login
      navigate("/login");
    }

    fetchdata();
  }, []);
  return (
    <div>
      <Toast ref={toast} />
      <Accordion activeIndex={0}>
        <AccordionTab header="All Blog" className="heada">
          <div className="TrendingBlogdataa d-grid gap-2">
            {data.map((all) => (
              <div id="bd" className="b gap-2">
                <div className="flexpostiona  d-grid">
                  <img src={all.img} alt="" />
                  <div className="text">
                    <h2>{all.blog_title}</h2>
                    <p>{all.blog_h1}</p>
                    <TimeAgo datetime={all.createdAt} locale="en-US" />
                  </div>
                </div>
                <div className="functionaa d-flex">
                  <Button
                    label="Edit"
                    severity="success"
                    rounded
                    onClick={() => {
                      setSelectedBlogId(all._id); // Set only the ID
                      setVisiblea(true); // Open the dialog
                    }}
                  />
                  <Button
                    label="Delete"
                    severity="denger"
                    onClick={() => {
                      showTemplate(all._id);
                    }}
                  />
                </div>
                <Dialog
                  header="Edit"
                  visible={visiblea}
                  style={{ width: "50vw" }}
                  onHide={() => {
                    if (!visiblea) return;
                    setVisiblea(false);
                    setSelectedBlogId(null);
                  }}
                >
                  {selectedBlogId ? (
                    <p>
                      <strong>ID:</strong> {selectedBlogId}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Image Link"
                    value={img}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Blloger Title"
                    value={blog_title}
                    onChange={(e) => setBlog(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Blloger peragraph"
                    value={blog_h1}
                    onChange={(e) => setH1(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="trending number"
                    value={is_trending}
                    onChange={(e) => settrending(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Site link"
                    value={link}
                    onChange={(e) => setelink(e.target.value)}
                  />
                  <button onClick={updateUser}>Submit</button>
                </Dialog>
              </div>
            ))}
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Alllist;
