import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const url = process.env.REACT_APP_HOST_URL;

  const validationSchema = yup.object({
    email_id: yup.string().email("Invalid email").required("Email is required"),
    user_Pass: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email_id: "",
      user_Pass: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${url}/LoginData`, values, { withCredentials: true });

        if (res.status === 200) {
          Cookies.set("user", JSON.stringify(res.data), { expires: 7 });
          Cookies.set("role", res.data.role, { expires: 7 });

          toast.current.show({
            severity: "success",
            summary: "Login Success",
            detail: "Thanks for logging in!",
            life: 2000,
          });

          setTimeout(() => {
            navigate(res.data.role === "admin" ? "/admin/" : "/user/", {
              state: { successMessage: "Welcome to your dashboard!" },
            });
          }, 2000);
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Login Failed",
          detail: error.response?.data?.message || "Invalid credentials!",
          life: 3000,
        });
      }
    },
  });

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <h2>Admin Login</h2>

      <form onSubmit={formik.handleSubmit} className="login-form">
        <input
          type="email"
          name="email_id"
          placeholder="Email"
          value={formik.values.email_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.errors.email_id ? "error" : ""}
        />
        {formik.touched.email_id && formik.errors.email_id && (
          <p className="error-text">{formik.errors.email_id}</p>
        )}

        <input
          type="password"
          name="user_Pass"
          placeholder="Password"
          value={formik.values.user_Pass}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.errors.user_Pass ? "error" : ""}
        />
        {formik.touched.user_Pass && formik.errors.user_Pass && (
          <p className="error-text">{formik.errors.user_Pass}</p>
        )}

        <Button label="Login" severity="success" type="submit" />
      </form>
    </div>
  );
};

export default Login;
