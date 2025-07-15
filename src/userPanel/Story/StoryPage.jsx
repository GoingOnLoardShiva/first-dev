import React, { useEffect, useState } from "react";
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    Dialog,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const StoryPage = () => {
    const [rawUser, setRawUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const [user, setUser] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("user"));
        return stored?.user?.[0] || {};
    });

    const [followedStories, setFollowedStories] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeStory, setActiveStory] = useState(null);
    const [openViewer, setOpenViewer] = useState(false);
    const [error, setError] = useState("");

    const url = process.env.REACT_APP_HOST_URL || ""; // fallback to empty string if not set

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data: storyData } = await axios.get(`${url}/stories`, {
                    params: { email_id: user.email_id }
                });

                setFollowedStories(storyData);
            } catch (err) {
                console.error("Error fetching stories", err);
                setError("Failed to load stories");
            }
        };

        if (user?.email_id) {
            fetchStories();
        }
    }, [user.email_id, url]);


    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selected);
            formData.append("email_id", user.email_id);

            await axios.post(`${url}/story/upload`, formData);
            window.location.reload(); // Or trigger re-fetch
        } catch (err) {
            console.error("Upload error", err);
            setError("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleStoryClick = async (story) => {
        setActiveStory(story);
        setOpenViewer(true);
        try {
            await axios.post(`${url}/story/view/${story._id}`);
        } catch (err) {
            console.error("View update failed", err);
        }
    };

    return (
        <Box p={2}>
            {/* Upload + Your Story */}
            <Box display="flex" gap={2} mb={3}>
                <Box textAlign="center">
                    <label htmlFor="story-upload">
                        <Box position="relative" display="inline-block">
                            <Avatar
                                src={user.img || ""}
                                sx={{ width: 64, height: 64, border: "2px solid #1976d2", cursor: "pointer" }}
                            />
                            <AddCircleIcon
                                sx={{
                                    position: "absolute",
                                    bottom: -5,
                                    right: -5,
                                    color: "#1976d2",
                                    background: "#fff",
                                    borderRadius: "50%"
                                }}
                            />
                        </Box>
                    </label>
                    <input
                        type="file"
                        id="story-upload"
                        hidden
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                    <Typography variant="caption">Your Story</Typography>
                </Box>

                {/* Followed Stories */}
                <Box display="flex" gap={2} overflow="auto" sx={{ flex: 1 }}>
                    {followedStories.map(story => (
                        <Box
                            key={story._id}
                            textAlign="center"
                            onClick={() => handleStoryClick(story)}
                            sx={{ cursor: "pointer" }}
                        >
                            <Avatar
                                src={story.mediaUrl}
                                sx={{ width: 64, height: 64, border: "2px solid gray" }}
                            />
                            <Typography variant="caption">{story.userName || story.email_id}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Full Story Dialog */}
            <Dialog fullScreen open={openViewer} onClose={() => setOpenViewer(false)}>
                <Box bgcolor="#000" color="#fff" height="100vh" display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                        <Typography>{activeStory?.userName || "Story"}</Typography>
                        <IconButton onClick={() => setOpenViewer(false)}>
                            <CloseIcon sx={{ color: "#fff" }} />
                        </IconButton>
                    </Box>

                    <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                        {activeStory?.mediaType?.startsWith("video") ? (
                            <video
                                src={activeStory.mediaUrl}
                                controls
                                autoPlay
                                style={{ maxHeight: "80vh", maxWidth: "100%" }}
                            />
                        ) : (
                            <img
                                src={activeStory?.mediaUrl}
                                alt="story"
                                style={{ maxHeight: "80vh", maxWidth: "100%" }}
                            />
                        )}
                    </Box>

                    <Box textAlign="center" p={1}>
                        <Typography variant="caption">{activeStory?.views?.length || 0} views</Typography>
                    </Box>
                </Box>
            </Dialog>

            {/* Loading Spinner */}
            {uploading && (
                <Box textAlign="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error Snackbar */}
            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default StoryPage;
