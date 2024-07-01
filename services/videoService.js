// services/videoService.js
import Video from '../models/videoSchema.js'
import commentService from './commentService.js';
import userService from './userService.js';

const fetchAllVideos = async () => {
    try {
        // Fetch top 10 most viewed videos
        const topViewedVideos = await Video.find().sort({ views: -1 }).limit(10);
        // Get IDs of top viewed videos
        const topViewedIds = topViewedVideos.map(video => video._id);

        // Fetch additional 10 random videos excluding the top viewed ones
        const additionalVideos = await Video.aggregate([
            { $match: { _id: { $nin: topViewedIds } } },
            { $sample: { size: 10 } }
        ]);

        // Combine the video arrays
        const combinedVideos = topViewedVideos.concat(additionalVideos);

        // Shuffle the combined videos
        for (let i = combinedVideos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinedVideos[i], combinedVideos[j]] = [combinedVideos[j], combinedVideos[i]];
        }

        return combinedVideos;
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
        if (video.likes[likeIndex].action === action) {
            // Remove the like/dislike if the action is the same
            video.likes.splice(likeIndex, 1);
        } else {
            // Update the existing like/dislike action if the action is different
            video.likes[likeIndex].action = action;
        }
    } else {
        // Add a new like/dislike action
        video.likes.push({ userId, action });
    }

    await video.save();
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
        // Delete all comments associated with the video
        await commentService.deleteCommentsByVideoId(videoId);
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
const addCommentToVideo = async (videoId, commentId) => {
    await Video.findByIdAndUpdate(videoId, { $push: { comments: commentId } });
};
const deleteCommentFromVideo = async (videoId, commentId) => {

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { comments: commentId } },
        { new: true }
    );

    return video;
};

const incrementViews = async (videoId) => {
    try {
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    } catch (error) {
        console.error('Failed to increment views:', error.message);
        throw error;
    }
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
    deleteVideosByUserId,
    addCommentToVideo,
    deleteCommentFromVideo,
    incrementViews
};
