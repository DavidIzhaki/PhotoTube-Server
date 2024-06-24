// services/videoService.js
const Video = require('../models/Video');

const fetchAllVideos = async () => {
    try {
        return await Video.find().sort({ timeago: -1 });
    } catch (error) {
        throw new Error('Unable to fetch videos from the database.');
    }
};

const addVideo = async (videoData) => {
    const video = new Video(videoData);
    try {
        return await video.save();
    } catch (error) {
        throw new Error('Unable to save the video to the database.');
    }
};

module.exports = {
    fetchAllVideos,
    addVideo
};
