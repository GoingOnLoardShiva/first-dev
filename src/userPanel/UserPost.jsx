import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import Cookies from "js-cookie";
import "./userpostd.scss";
import Chip from "@mui/material/Chip";

const UserPost = () => {
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [sectionCount, setSectionCount] = useState(1);

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
  const userEmail = user?.email;
  const userName = user?.useName;

  const userPostsubmit = async () => {
    if (!blogTitle || !blogDescription || !blogImg) {
      toast.current.show({
        severity: "warn",
        summary: "Missing",
        detail: "First section must be complete!",
      });
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
      useName: userName,
    };

    try {
      const res = await axios.post(`${url}/userPosta`, postData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Post uploaded successfully!",
        });

        // Reset fields
        setBlogTitle("");
        setBlogDescription("");
        setBlogImg("");

        setBlogTitle2("");
        setBlogDescription2("");
        setBlogImg2("");

        setBlogTitle3("");
        setBlogDescription3("");
        setBlogImg3("");

        setSectionCount(1);
        setVisible(false);
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to upload post!",
      });
      console.error("Upload Error:", err);
    }
  };

  const footerContent = (
    <div className="flex justify-end gap-5">
      <Chip
        // label="Login"
        color="primary"
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
        component="a"
        variant="outlined"
        clickable
      />
      <Chip
        // label="Login"
        color="primary"
        label="Submit" icon="pi pi-check" onClick={userPostsubmit}
        className="p-button-text"
        component="a"
        variant="outlined"
        clickable
      />
    </div>
  );

  return (
    <div className="user-post-container">
      <Chip
        label="Create Post"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
        color="primary"
        className="texta"
        component="a"
        // href="/login"
        variant="outlined"
        clickable
      />
      {/* <Button
        label="Create Post"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
      /> */}

      <Dialog
        header="Create Blog Post"
        visible={visible}
        className="dialog-post w-full max-w-3xl"
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Section 1 */}
          <div className="p-4 d-grid border rounded-xl shadow bg-white">
            <InputText
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Blog Title"
              className="w-full font-semibold text-lg"
            />
            <InputTextarea
              rows={5}
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              placeholder="Blog Description"
              className="w-full mt-2"
            />
            {/* <InputText
              value={blogImg}
              onChange={(e) => setBlogImg(e.target.value)}
              placeholder="Image URL"
              className="w-full mt-2"
            /> */}
          </div>

          {/* Section 2 */}
          {sectionCount >= 2 && (
            <div className="p-4 d-grid border rounded-xl shadow bg-white">
              <InputText
                value={blogTitle2}
                onChange={(e) => setBlogTitle2(e.target.value)}
                placeholder="Blog Title 2"
                className="w-full font-semibold text-lg"
              />
              <InputTextarea
                rows={5}
                value={blogDescription2}
                onChange={(e) => setBlogDescription2(e.target.value)}
                placeholder="Blog Description 2"
                className="w-full mt-2"
              />
              {/* <InputText
                value={blogImg2}
                onChange={(e) => setBlogImg2(e.target.value)}
                placeholder="Image URL 2"
                className="w-full mt-2"
              /> */}
            </div>
          )}

          {/* Section 3 */}
          {sectionCount >= 3 && (
            <div className="p-4 d-grid border rounded-xl shadow bg-white">
              <InputText
                value={blogTitle3}
                onChange={(e) => setBlogTitle3(e.target.value)}
                placeholder="Blog Title 3"
                className="w-full font-semibold text-lg"
              />
              <InputTextarea
                rows={5}
                value={blogDescription3}
                onChange={(e) => setBlogDescription3(e.target.value)}
                placeholder="Blog Description 3"
                className="w-full mt-2"
              />
              {/* <InputText
                value={blogImg3}
                onChange={(e) => setBlogImg3(e.target.value)}
                placeholder="Image URL 3"
                className="w-full mt-2"
              /> */}
            </div>
          )}

          {/* Add & Remove Section Buttons */}
          <div className="flex gap-2 justify-between">
            {sectionCount < 3 && (
              <Chip
                // label="Login"
                color="primary"
                // className="texta"
                component="a"
                label="Add Section"
                icon="pi pi-plus"
                onClick={() => setSectionCount(sectionCount + 1)}
                className="w-full"
                variant="outlined"
                clickable
              />
              // <Button
              //   label="Add Section"
              //   icon="pi pi-plus"
              //   onClick={() => setSectionCount(sectionCount + 1)}
              //   className="w-full"
              // />
            )}
            {sectionCount > 1 && (
              <Chip
                //  label="Login"
                color="primary"
                //  className="texta"
                component="a"
                label="Remove Section"
                icon="pi pi-minus"
                severity="danger"
                onClick={() => {
                  if (sectionCount === 2) {
                    setBlogTitle2("");
                    setBlogDescription2("");
                    setBlogImg2("");
                  } else if (sectionCount === 3) {
                    setBlogTitle3("");
                    setBlogDescription3("");
                    setBlogImg3("");
                  }
                  setSectionCount(sectionCount - 1);
                }}
                className="w-full"
                variant="outlined"
                clickable
              />
            )}
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default UserPost;
