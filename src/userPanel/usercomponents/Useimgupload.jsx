import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Typography, Snackbar, Alert, IconButton, Stack, Avatar, Dialog, DialogActions, DialogContent
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from './cropImageHelper';

const UseImgUpload = () => {
  const [userEmail, setUserEmail] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: 'success', msg: '' });
  const [openCrop, setOpenCrop] = useState(false);

  // 🔥 NEW: Camera-related states
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const email = parsed?.user?.[0]?.email_id;
      if (email) setUserEmail(email);
      else showAlert('error', 'User email not found in localStorage');
    } else {
      showAlert('warning', 'User not logged in');
    }
  }, []);

  const showAlert = (type, msg) => {
    setAlert({ open: true, type, msg });
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
      setOpenCrop(true);
    }
  };

  const handleCropDone = async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped);
      setOpenCrop(false);
    } catch (error) {
      showAlert('error', 'Failed to crop image');
    }
  };

  const handleUpload = async () => {
    if (!userEmail || !croppedImage) {
      return showAlert('error', 'Missing email or image');
    }

    const formData = new FormData();
    formData.append('email_id', userEmail);
    formData.append('file', croppedImage);

    try {
      const res = await fetch(`${url}/uploadProfileImage`, {
        method: 'POST',
        headers: { "access-key": key },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        showAlert('success', result.message || 'Uploaded successfully');
      } else {
        showAlert('error', result.message || 'Upload failed');
      }
    } catch (err) {
      showAlert('error', err.message || 'Upload failed');
    }
  };

  // 🔥 NEW: Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      showAlert('error', 'Camera access denied or not available');
    }
  };

  // 🔥 NEW: Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  // 🔥 NEW: Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setImageSrc(dataUrl);
    setOpenCrop(true);
    stopCamera();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>Upload Profile Image</Typography>

      {croppedImage && (
        <Avatar
          src={URL.createObjectURL(croppedImage)}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
        />
      )}

      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCamera />}
        >
          Choose Image
          <input hidden accept="image/*" type="file" onChange={handleImageSelect} />
        </Button>

        <Button variant="outlined" onClick={cameraOn ? stopCamera : startCamera}>
          {cameraOn ? "Stop Camera" : "Use Camera"}
        </Button>
      </Stack>

      {cameraOn && (
        <Box sx={{ mb: 2 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={capturePhoto}>
            Capture
          </Button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Box>
      )}

      <Button
        variant="contained"
        color="success"
        disabled={!croppedImage}
        onClick={handleUpload}
      >
        Upload
      </Button>

      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: 300, bgColor: '#333' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              cropShape="round"
              showGrid={false}
            />
          </Box>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e, z) => setZoom(z)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
          <Button onClick={handleCropDone} variant="contained">Crop</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.type}>{alert.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UseImgUpload;
