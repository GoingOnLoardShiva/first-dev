import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { InputTextarea } from 'primereact/inputtextarea';
import Chip from "@mui/material/Chip";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const UserPost = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [useName, setUseName] = useState('');
  const [writecontnet, setWritecontnet] = useState('');
  const [totalSize, setTotalSize] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const fileInputRef = useRef(null);

  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const email = parsed?.user?.[0]?.email_id;
        const name = parsed?.user?.[0]?.user_fName;

        if (email) {
          setUserEmail(email);
          setUseName(name);
        } else {
          showAlert('error', 'Email field missing in user data');
        }
      } catch (error) {
        showAlert('error', 'Invalid user data format');
      }
    } else {
      showAlert('warning', 'Please log in to upload your image.');
    }
  }, []);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const uploadHandler = async () => {
    if (!selectedFile) {
      showAlert('warning', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('email_id', userEmail);
    formData.append('file', selectedFile);
    formData.append('writecontnet', writecontnet);
    formData.append('useName', useName);

    try {
      const res = await fetch(url + "/uploadPostuser", {
        method: 'POST',
        headers: {
          "access-key": key,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        showAlert('success', result.message || 'Upload successful');
        setWritecontnet('');
        setSelectedFile(null);
        setTotalSize(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        showAlert('error', result.message || 'Upload failed');
      }
    } catch (err) {
      showAlert('error', err.message || 'Upload failed');
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTotalSize(file.size);
    }
  };

  const onClear = () => {
    setSelectedFile(null);
    setWritecontnet('');
    setTotalSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 max-w-2xl mx-auto shadow-md rounded-md bg-white">
      {/* Material UI Alert */}
      <Collapse in={alert.open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => setAlert((prev) => ({ ...prev, open: false }))}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      {/* Chip Buttons */}
      <div className="flex gap-5 flex-wrap mb-4" >
        <Chip
          icon={<ImageIcon />}
          label="Choose Image"
          onClick={() => fileInputRef.current.click()}
          clickable
          variant="outlined"
          color="primary"
        />
        <Chip
          icon={<CloudUploadIcon />}
          label="Upload"
          onClick={uploadHandler}
          clickable
          variant="outlined"
          color="success"
        />
        <Chip
          icon={<CancelIcon />}
          label="Cancel"
          onClick={onClear}
          clickable
          variant="outlined"
          color="error"
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      {/* Textarea for post */}
      <InputTextarea
        autoResize
        rows={4}
        cols={60}
        placeholder="Write your post here..."
        value={writecontnet}
        onChange={(e) => setWritecontnet(e.target.value)}
        className="mb-4 w-full"
        style={{ width: '100%', resize: 'none' }}
      />

      {/* Image Preview */}
      {selectedFile && (
        <div className="mb-4">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-full max-h-80 object-contain rounded"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
          <div className="mt-2">
            <ProgressBar
              value={Math.min(totalSize / 10000, 100)}
              showValue={false}
              style={{ height: '10px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPost;
