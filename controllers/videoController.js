// controllers/videoController.js
import videoService from '../services/videoService.js'
import userService from '../services/userService.js';
import User from '../models/userSchema.js'

//Gets all the videos
const getVideos = async (req, res) => {
    try {
        const videos = await videoService.fetchAllVideos();
         // Fetch all user data in parallel for better performance
         const userPromises = videos.map(video => userService.getUser(video.createdBy));
         const users = await Promise.all(userPromises);

         // Create a map of userId to username for quick lookup
         const userMap = users.reduce((map, user) => {
             map[user._id.toString()] = user.displayname; // Ensure correct key type
             return map;
         }, {});
 
         // Replace createdBy field with the corresponding username and ensure date formatting
         const modifiedVideos = videos.map(video => ({
             _id:video._id,
             title: video.title,
             views: video.views,
             likes: video.likes, 
             imageUrl: video.imageUrl,
             videoUrl: video.videoUrl,
             userId: video.createdBy, 
             createdBy: userMap[video.createdBy.toString()], 
             date: new Date(video.date).toISOString() ,
             comments: video.comments,
             _Id: video._id
         }));
         
         res.json(modifiedVideos);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//Gets one video by UserId
const getVideo = async (req, res) => {
    const { id, pid } = req.params;  // id is userId, pid is videoId
    try {
        const videoResponse = await videoService.getVideo(id, pid);
        const userResponse = await userService.getUser(id);

        const videoData = {
            title: videoResponse.title,
            views: videoResponse.views,
            likes: videoResponse.likes,
            date: videoResponse.date,
            imageUrl: videoResponse.imageUrl,
            videoUrl: videoResponse.videoUrl,
            createdBy: userResponse.displayname, 
            userId:userResponse._id, 
            comments: videoResponse.comments,
            _Id: videoResponse._id
        };
        
        res.send(videoData); // Send only the selected user data
    } catch (error) {
        console.error('Failed to fetch video:', error.message);
        res.status(500).json({ message: error.message });
    }
};


const getUserVideos = async (req, res) => {
    try {
        const userId = req.params.id;
        const videos = await videoService.getVideosByUserId(userId);
         const userResponse = await userService.getUser(userId);
         const modifiedVideos = videos.map(video => ({
            _id:video._id,
            title: video.title,
            views: video.views,
            likes: video.likes, 
            imageUrl: video.imageUrl,
            videoUrl: video.videoUrl,
            userId: video.createdBy, 
            createdBy: userResponse.displayname, 
            userProfileImg: userResponse.profileImg,
            date: new Date(video.date).toISOString() ,
            comments: video.comments
        })); 
        res.json(modifiedVideos);
    } catch (error) {
        console.error('Failed to fetch videos for user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Update Video by UserId
const updateVideo = async (req, res) => {
    const { id, pid } = req.params;  // id is userId, pid is videoId
    const updateData = req.body;  // Data to update the video with

    try {
        // First, verify that the video belongs to the user making the request
        const video = await videoService.getVideo(id, pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (video.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this video" });
        }
    
        const updatedVideo = await videoService.updateVideo(id, pid, updateData);
        const userResponse = await userService.getUser(id);
        const videoData = {
            title: updatedVideo.title,
            views: updatedVideo.views,
            likes: updatedVideo.likes,
            date: updatedVideo.date,
            imageUrl: updatedVideo.imageUrl,
            videoUrl: updatedVideo.videoUrl,
            createdBy: userResponse.username, 
            userId:userResponse._id, 
            comments: updatedVideo.comments,
            _Id: updatedVideo._id
              
        };
        res.send(videoData); // Send only the selected user data
    } catch (error) {
        console.error('Failed to update video:', error.message);
        res.status(500).json({ message: error.message });
    }
};

//Delete Video by UserId
const deleteVideo = async (req, res) => {
    const { id, pid } = req.params;  // id is userId from URL, pid is videoId

    try {
        // Check if the authenticated user is the same as the user id from URL
        if (req.user.id !== id) {
            return res.status(403).json({ message: "Unauthorized to delete video from another user" });
        }

        // Fetch the video to ensure it belongs to the user
        const video = await videoService.getVideo(id, pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        await videoService.deleteVideo(id, pid);
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
         // Update the user's videoList to include the new video
         await userService.updateUser(req.user.id, { $push: { videoList: newVideo._id } });

        res.status(201).json(newVideo);
    } catch (error) {
        console.error('Error creating video:', error);  // More detailed error logging
        res.status(500).json({ message: 'Failed to create video', error: error.message });
    }
};

const likeAction = async (req, res) => {
    try {      
        const { id, pid } = req.params;  // id is userId, pid is videoId
        const {  action } = req.body;      
        const videoResponse = await videoService.likeAction(pid, id, action);
        const userResponse = await userService.getUser(id);

        const updatedVideo = {
            title: videoResponse.title,
            views: videoResponse.views,
            likes: videoResponse.likes,
            date: videoResponse.date,
            imageUrl: videoResponse.imageUrl,
            videoUrl: videoResponse.videoUrl,
            userId:videoResponse.createdBy,    
            createdBy: userResponse.username,
            comments: videoResponse.comments ,
            _Id: videoResponse._id   
        };
        res.send(updatedVideo); // Send only the selected user data
       
    } catch (error) {
        console.error('Error liking video:', error);  // More detailed error logging
        res.status(500).json({ message: 'Failed to like video', error: error.message });
    }
};






export default { getVideos, updateVideo, deleteVideo, createVideo, getVideo, getUserVideos,likeAction }