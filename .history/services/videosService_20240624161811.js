// services/videoService.js
import Video from '../models/videoSchema.js'

const fetchAllVideos = async () => {
    try {
        // Fetch top 10 most viewed videos
        const topViewedVideos = await Video.find().sort({ views: -1 }).limit(10);

        // Fetch additional videos excluding the top viewed ones
        const additionalVideos = await Video.find({
            _id: { $nin: topViewedVideos.map(video => video._id) }
        });

        // Combine the video arrays
        return topViewedVideos.concat(additionalVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw new Error('Failed to fetch videos');
    }
};
const getVideosByUserId = async (userId) => {
    try {
        return await Video.find({ createdBy: userId });
    } catch (error) {
        throw new Error('Database query failed');
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

export default {
    fetchAllVideos,
    addVideo
};
