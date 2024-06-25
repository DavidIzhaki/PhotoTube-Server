// services/videoService.js
import Video from '../models/videoSchema.js'
import userService from './userService.js';

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

const likeAction = async (videoId, userId,action) => { 
    const video = await Video.findById(videoId).exec();
    if (!video) {
      throw new Error('Video not found');
    }

    // Check if the user already liked/disliked the video
    const likeIndex = video.likes.findIndex(like => like.userId.toString() === userId);

    if (likeIndex !== -1) {
        // Update the existing like/dislike action
        video.likes[likeIndex].action = action;
    } else {
        // Add a new like/dislike action
        video.likes.push({ userId, action });
    }

    await video.save();
    return video;
    return video;
  };

  

const isLiked = async (videoId, userId) => { 
    const video = await Video.findById(videoId).exec();
    if (!video) {
      throw new Error('Video not found');
    }
    
    // Find if the user has liked the video
    const likeEntry = video.likes.find(like => like.userId.toString() === userId.toString() && like.action === 'like');
    return likeEntry !== undefined;
  };
  
  // Similarly, you can create an `isDisliked` function if needed
  const isDisliked = async (videoId, userId) => {
    const video = await Video.findById(videoId).exec();
    if (!video) {
      throw new Error('Video not found');
    }
    
    // Find if the user has disliked the video
    const dislikeEntry = video.likes.find(like => like.userId.toString() === userId.toString() && like.action === 'dislike');
    return dislikeEntry !== undefined;
  };

const getVideo = async (userId, videoId) => {
    try {
        
        const video = await Video.findOne({ _id: videoId, createdBy: userId });
        if (!video) {
            throw new Error('Video not found or does not belong to the user');
        }
        return video;
    } catch (error) {
        throw new Error('Database query failed');
    }
};



const updateVideo = async (userId, videoId, updateData) => {
    try {
        const video = await Video.findOneAndUpdate(
            { _id: videoId, createdBy: userId },
            { $set: updateData },
            { new: true }  // Return the updated object
        );
        if (!video) {
            throw new Error('Video not found or does not belong to the user');
        }
        return video;
    } catch (error) {
        throw new Error('Database query failed');
    }
};

const deleteVideo = async (userId, videoId) => {
    try {
        const video = await Video.findOneAndDelete({ _id: videoId, createdBy: userId });
        // Update the user's videoList to remove the deleted video
        const user = await userService.updateUser(userId, { $pull: { videoList: videoId } });
        if (!user) {
            throw new Error('Failed to update user video list');
        }

        if (!video) {
            throw new Error('Video not found or user does not have permission to delete this video');
        }
        return video;
    } catch (error) {
        throw new Error('Database operation failed');
    }
};

const deleteVideosByUserId = async (userId) => {
    try {
        const result = await Video.deleteMany({ createdBy: userId });
        return result;
    } catch (error) {
        throw new Error('Failed to delete videos');
    }
};

const addVideo = async (videoData) => {
    const video = new Video(videoData);
    await video.save();
    return video;
};


export default {
    fetchAllVideos,
    addVideo,
    getVideosByUserId,
    getVideo,
    updateVideo,
    deleteVideo,
    isLiked,
    isDisliked,
    likeAction,
    deleteVideosByUserId
};
