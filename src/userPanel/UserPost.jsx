import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Cookies from "js-cookie";

const UserPost = () => {
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImg, setBlogImg] = useState("");
  const url = process.env.REACT_APP_HOST_URL;
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userEmail = user ? user.email : null; 

  // Submit the user post
  const userPostsubmit = async () => {
    if (!blogImg || !blogTitle || !blogDescription) {
      alert("Please fill in all fields!");
      return;
    }

    const postData = {
      blog_img: blogImg,
      blog_title: blogTitle,
      blog_Description: blogDescription,
      email: userEmail,
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
    <div>
      <Button
        label="Create Post"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Create Post"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div>
          <input
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
          <input
            type="text"
            value={blogImg}
            onChange={(e) => setBlogImg(e.target.value)}
            placeholder="Image URL"
            className="p-inputtext p-component"
          />
        </div>
        <div>
      </div>
      </Dialog>
      <Toast ref={toast}></Toast>
    </div>
  );
};

export default UserPost;
