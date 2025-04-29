import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Cookies from "js-cookie";
import "./userpostd.scss";

const UserPost = () => {
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImg, setBlogImg] = useState("");

  const [blogTitle2, setBlogTitle2] = useState("");
  const [blogDescription2, setBlogDescription2] = useState("");
  const [blogImg2, setBlogImg2] = useState("");

  const [blogTitle3, setBlogTitle3] = useState("");
  const [blogDescription3, setBlogDescription3] = useState("");
  const [blogImg3, setBlogImg3] = useState("");
  const url = process.env.REACT_APP_HOST_URL;
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userEmail = user ? user.email : null;
  const userName = user ? user.useName : null;

  // Submit the user post
  const userPostsubmit = async () => {
    if (!blogImg || !blogTitle || !blogDescription) {
      alert("Please fill in all fields!");
      return;
    }

    const postData = {
      blog_title: blogTitle,
      blog_Description: blogDescription,
      blog_img: blogImg,

      blog_title2: blogTitle2,
      blog_Description2: blogDescription2,
      blog_img2: blogImg2,

      blog_title3: blogTitle3,
      blog_Description3: blogDescription3,
      blog_img3: blogImg3,
      email: userEmail,
      useName:userName,
    };

    try {
      const response = await axios.post(`${url}/userPosta`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Post uploaded successfully!",
        });
        setBlogTitle("");
        setBlogDescription("");
        setBlogImg("");
        setVisible(false);
      } else {
        throw new Error("Failed to upload post.");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error uploading post, please try again!",
      });
      console.error("Error uploading post:", error);
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={userPostsubmit}
        autoFocus
      />
    </div>
  );

  return (
    <div className="diloag">
      <Button
        label="Create Post"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Create Post"
        className="diloagbox"
        visible={visible}
        // style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className="userpostdata bg-balck">
          <textarea
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog Title"
            className="p-inputtext p-component"
          />

          <textarea
            value={blogDescription}
            onChange={(e) => setBlogDescription(e.target.value)}
            placeholder="Blog Description"
            rows={4}
            className="p-inputtext p-component"
          />
          <br />
          <br />
          <textarea
            type="text"
            value={blogTitle2}
            onChange={(e) => setBlogTitle2(e.target.value)}
            placeholder="Blog Title"
            className="p-inputtext p-component"
          />
          <textarea
            value={blogDescription2}
            onChange={(e) => setBlogDescription2(e.target.value)}
            placeholder="Blog Description"
            rows={4}
            className="p-inputtext p-component"
          />

          <br />
          <br />
          <textarea
            type="text"
            value={blogTitle3}
            onChange={(e) => setBlogTitle3(e.target.value)}
            placeholder="Blog Title"
            className="p-inputtext p-component"
          />
          <textarea
            value={blogDescription3}
            onChange={(e) => setBlogDescription3(e.target.value)}
            placeholder="Blog Description"
            rows={4}
            className="p-inputtext p-component"
          />
        </div>
        <div></div>
      </Dialog>
      <Toast ref={toast}></Toast>
    </div>
  );
};

export default UserPost;
