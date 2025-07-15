import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";

const Sigin = () => {
  const [useremail_id, setEmail] = useState("");
  const [useName, setUname] = useState("");
  const [user_password, setPassword] = useState("");
  const [user_conform_password, setConformPassword] = useState("");
  const [user_dob, setDob] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [regOtp, setRegOtp] = useState(false);
  const [sendOtp, setSendOtp] = useState(true);
  const [otp, setOtp] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  const [role] = useState("user");
  const [userCategory, setUserCategory] = useState("");
  const [contentCategories, setContentCategories] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", msg: "" });

  const navigate = useNavigate();
  const url = process.env.REACT_APP_HOST_URL;

  const userCategoryOptions = ["Creator", "Editor", "Entertainment", "News"];
  const contentCategoryOptions = [
    "Education",
    "Technology",
    "Politics",
    "Health",
    "News",
    "Entertainment",
    "Travel",
    "Gaming",
  ];

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(url + "/sendotp", {
        useremail_id,
      });

      if (res.status === 200) {
        setAlert({ open: true, type: "success", msg: "OTP sent to email" });
        setOtpSent(true);
        setRegOtp(true);
        setSendOtp(false);
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        msg: error.response?.data?.message || "OTP failed",
      });
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(url + "/verifyotp", {
        useremail_id,
        otp,
        user_password,
        user_conform_password,
        user_dob,
        role,
        useName,
        user_category: userCategory,
        content_categories: contentCategories,
        address,
        pincode,
      });

      if (res.status === 200) {
        setAlert({ open: true, type: "success", msg: "Registered successfully" });
        setTimeout(() => navigate("/Login"), 2000);
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        msg: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const handlePincodeLookup = async () => {
    if (!pincode || pincode.length !== 6) {
      setAlert({ open: true, type: "error", msg: "Enter valid 6-digit pincode" });
      return;
    }

    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = res.data[0];

      if (data.Status === "Success") {
        const postOffice = data.PostOffice[0];
        const fullAddress = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
        setAddress(fullAddress);
        setAlert({ open: true, type: "success", msg: "Address detected" });
      } else {
        setAddress("");
        setAlert({ open: true, type: "error", msg: "Invalid Pincode" });
      }
    } catch (err) {
      setAlert({ open: true, type: "error", msg: "Failed to detect address" });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 6, px: 2 ,marginTop: "0px", paddingTop: "70px", borderRadius: "10px", boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Create Account
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={useremail_id}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Full Name"
        fullWidth
        margin="normal"
        value={useName}
        onChange={(e) => setUname(e.target.value)}
      />

      <TextField
        label="Date of Birth"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={user_dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>User Category</InputLabel>
        <Select
          value={userCategory}
          onChange={(e) => setUserCategory(e.target.value)}
          label="User Category"
        >
          {userCategoryOptions.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Content Categories</InputLabel>
        <Select
          multiple
          value={contentCategories}
          onChange={(e) => setContentCategories(e.target.value)}
          input={<OutlinedInput label="Content Categories" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {contentCategoryOptions.map((cat) => (
            <MenuItem key={cat} value={cat}>
              <Checkbox checked={contentCategories.includes(cat)} />
              <ListItemText primary={cat} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Pincode"
        fullWidth
        margin="normal"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        onBlur={handlePincodeLookup}
      />

      <TextField
        label="Detected Address"
        fullWidth
        margin="normal"
        value={address}
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={user_password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={user_conform_password}
        onChange={(e) => setConformPassword(e.target.value)}
      />

      {otpSent && (
        <TextField
          label="OTP"
          fullWidth
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      {sendOtp && (
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSendOtp}>
          Send OTP
        </Button>
      )}

      {regOtp && (
        <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>
      )}

      <Button fullWidth sx={{ mt: 2 }} href="/">
        Back
      </Button>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.type} sx={{ width: "100%" }}>
          {alert.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sigin;
