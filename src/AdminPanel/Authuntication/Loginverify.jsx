import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const [email_id, setEmail] = useState("");
  const [pass_word, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [login, setLogin] = useState(false);
  const [sendotp, setSendOtp] = useState(true);
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState({ open: false, msg: "", type: "info" });

  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;

  const handleAlert = (msg, type = "info") => {
    setAlert({ open: true, msg, type });
  };

  const verifyotp = async () => {
    try {
      const res = await axios.post(url + "/loginsendotp", { email_id });

      if (res.status === 200) {
        handleAlert("OTP sent successfully!", "success");
        setOtpSent(true);
        setLogin(true);
        setSendOtp(false);
      }
    } catch (error) {
      handleAlert(error.response?.data?.message || "OTP failed!", "error");
    }
  };

  const handleLogin = async () => {
    if (!email_id || !pass_word) {
      return handleAlert("Please enter both email and password!", "warning");
    }

    try {
      const res = await axios.post(
        url + "/LoginData",
        { email_id, pass_word, otp },
        { headers: { "skip-auth": "true" } }
      );

      if (res.status === 200) {
        const secureUID = uuidv4();

        const userData = {
          ...res.data,
          secureUID: secureUID,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        handleAlert("Login successful! Redirecting...", "success");

        setTimeout(() => {
          navigate(
            res.data.role === "admin"
              ? `/admin/${secureUID}`
              : `/User/${secureUID}`
          );
        }, 2000);
      }
    } catch (error) {
      handleAlert(
        error.response?.data?.message || "Invalid credentials!",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        marginTop: "0px",
        paddingTop: "70px",
      }}
    >
      <Stack spacing={2}>
        <Box textAlign="center">
          <img
            src={window.location.origin + "/You.png"}
            alt="Logo"
            width={60}
          />
          <Typography variant="h5" mt={1}>
            Login
          </Typography>
        </Box>

        <TextField
          type="email"
          label="Email"
          value={email_id}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          type="password"
          label="Password"
          value={pass_word}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        {otpSent && (
          <TextField
            type="text"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="error"
            href="/"
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
          {sendotp && (
            <Button
              variant="contained"
              color="primary"
              onClick={verifyotp}
              sx={{ textTransform: "none" }}
            >
              Send OTP
            </Button>
          )}
          {login && (
            <Button
              variant="contained"
              color="success"
              onClick={handleLogin}
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<i className="pi pi-google" />}
            href="/"
            sx={{ textTransform: "none" }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<i className="pi pi-facebook" />}
            href="/"
            sx={{ textTransform: "none" }}
          >
            Facebook
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.type} variant="filled">
          {alert.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
