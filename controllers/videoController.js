// controllers/videoController.js
import videoService from '../services/videoService.js'

const getVideos = async (req, res) => {
    try {
        const videos = await videoService.fetchAllVideos();
        console.log(videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVideoOfUser = async (req, res) => {
    const { id, pid } = req.params;  // id is userId, pid is videoId
    const updateData = req.body;  // Data to update the video with

    try {
        // First, verify that the video belongs to the user making the request
        const video = await videoService.getVideoByUserAndVideoId(id, pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (video.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this video" });
        }

        const updatedVideo = await videoService.updateVideoByUserAndVideoId(id, pid, updateData);
        res.json(updatedVideo);
    } catch (error) {
        console.error('Failed to update video:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const deleteVideoOfUser = async (req, res) => {
    const { id, pid } = req.params;  // id is userId from URL, pid is videoId

    try {
        // Check if the authenticated user is the same as the user id from URL
        if (req.user.id !== id) {
            return res.status(403).json({ message: "Unauthorized to delete video from another user" });
        }

        // Fetch the video to ensure it belongs to the user
        const video = await videoService.getVideoByUserAndVideoId(id, pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (video.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this video" });
        }

        const deletedVideo = await videoService.deleteVideoByUserAndVideoId(id, pid);
        res.json({ message: 'Video successfully deleted', videoId: pid });
    } catch (error) {
        console.error('Failed to delete video:', error.message);
        res.status(500).json({ message: error.message });
    }
};


const createVideo = async (req, res) => {
    try {
        const videoData = {
            ...req.body,
            createdBy: req.user.id,  // Set the creator of the video to the logged-in user
        };
        const newVideo = await videoService.addVideo(videoData);
        res.status(201).json(newVideo);
    } catch (error) {
        console.error('Error creating video:', error);  // More detailed error logging
        res.status(500).json({ message: 'Failed to create video', error: error.message });
    }
};

const getVideoOfUser = async (req, res) => {
    const { id, pid } = req.params;  // id is userId, pid is videoId
    try {
        const video = await videoService.getVideoByUserAndVideoId(id, pid);
        res.json(video);
    } catch (error) {
        console.error('Failed to fetch video:', error.message);
        res.status(500).json({ message: error.message });
    }
};


const getUserVideos = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const videos = await videoService.getVideosByUserId(userId);
        res.json(videos);
    } catch (error) {
        console.error('Failed to fetch videos for user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



export default { getVideos, updateVideoOfUser, deleteVideoOfUser, createVideo, getVideoOfUser, getUserVideos }