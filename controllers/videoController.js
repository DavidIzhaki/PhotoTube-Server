// controllers/videoController.js
import videoService from '../services/videoService.js'
import userService from '../services/userService.js';
import customEnv from 'custom-env'
import * as recommendationService from '../services/recommendationService.js';
import Video from '../models/videoSchema.js'; // Adjust the path as necessary to point to where your Video model is defined


customEnv.env(process.env.NODE_ENV, './config');

//Gets all the videos
const getVideos = async (req, res) => {
    try {
        const videos = await videoService.fetchAllVideos();
        // Fetch all user data in parallel for better performance
        const userPromises = videos.map(video => userService.getUser(video.createdBy));
        const users = await Promise.all(userPromises);

        // Create a map of userId to username for quick lookup
        const userMap = users.reduce((map, user) => {

            map[user._id.toString()] = { username: user.displayname, userProfileImg: user.profileImg };  // Ensure correct key type

            return map;
        }, {});

        // Replace createdBy field with the corresponding username and ensure date formatting
        const modifiedVideos = videos.map(video => ({
            _id: video._id,
            title: video.title,
            views: video.views,
            likes: video.likes,
            videoUrl: `${process.env.PORT}${video.videoUrl}`,
            creatorImg: `${process.env.PORT}${userMap[video.createdBy.toString()].userProfileImg}`,
            userId: video.createdBy,
            createdBy: userMap[video.createdBy.toString()].username,
            date: new Date(video.date).toISOString(),
            comments: video.comments,

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
        // Increment the view count
        await videoService.incrementViews(pid);

        const videoData = {
            title: videoResponse.title,
            views: videoResponse.views + 1,
            likes: videoResponse.likes,
            date: videoResponse.date,
            videoUrl: `${process.env.PORT}${videoResponse.videoUrl}`,
            creatorImg: `${process.env.PORT}${userResponse.profileImg}`,
            createdBy: userResponse.displayname,
            userId: userResponse._id,
            comments: videoResponse.comments,
            _id: videoResponse._id
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
            _id: video._id,
            title: video.title,
            views: video.views,
            likes: video.likes,
            videoUrl: `${process.env.PORT}${video.videoUrl}`,
            userId: video.createdBy,
            createdBy: userResponse.displayname,
            creatorImg: `${process.env.PORT}${userResponse.profileImg}`,
            date: new Date(video.date).toISOString(),
            comments: video.comments
        }));
        res.json(modifiedVideos);
    } catch (error) {
        console.error('Failed to fetch videos for user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const updateVideo = async (req, res) => {
    const { id, pid } = req.params;  // id is userId, pid is videoId

    try {
        // First, verify that the video belongs to the user making the request
        const video = await videoService.getVideo(id, pid);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (video.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this video" });
        }

        // Prepare the update data
        const updateData = {};
        if (req.body.title) updateData.title = req.body.title;

        // Handle video file upload
        if (req.file) {
            updateData.videoUrl = `/uploads/${req.file.filename}`;
        }

        const updatedVideo = await videoService.updateVideo(id, pid, updateData);
        const userResponse = await userService.getUser(id);
        const videoData = {
            title: updatedVideo.title,
            views: updatedVideo.views,
            likes: updatedVideo.likes,
            date: updatedVideo.date,
            creatorImg: `${process.env.PORT}${userResponse.profileImg}`,
            videoUrl: `${process.env.PORT}${updatedVideo.videoUrl}`,
            createdBy: userResponse.displayname,
            userId: userResponse._id,
            comments: updatedVideo.comments,
            _id: updatedVideo._id
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


export const createVideo = async (req, res) => {
    try {
        const videoData = {
            title: req.body.title,
            videoUrl: `/uploads/${req.file.filename}`, // Store the path to the video file
            createdBy: req.user.id,  // Set the creator of the video to the logged-in user
            views: 0
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
        const { action } = req.body;
        const videoResponse = await videoService.likeAction(pid, id, action);
        const userResponse = await userService.getUser(id);

        const updatedVideo = {
            title: videoResponse.title,
            views: videoResponse.views,
            likes: videoResponse.likes,
            date: videoResponse.date,
            creatorImg: `${process.env.PORT}${userResponse.profileImg}`,
            videoUrl: `${process.env.PORT}${videoResponse.videoUrl}`,
            userId: videoResponse.createdBy,
            createdBy: userResponse.displayname,
            comments: videoResponse.comments,
            _id: videoResponse._id
        };
        res.send(updatedVideo); // Send only the selected user data

    } catch (error) {
        console.error('Error liking video:', error);  // More detailed error logging
        res.status(500).json({ message: 'Failed to like video', error: error.message });
    }
};


export async function watchVideo(req, res) {
    const { userId, videoId } = req.body;
    try {
        const recommendations = await recommendationService.getVideoRecommendations(userId, videoId);
        res.json({ recommendations });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).send('Failed to get recommendations');
    }
}


const getRecommendations = async (req, res) => {
    console.log('getRecommendationscc called');
    const { userId, videoId } = req.body; // Ensure you're receiving these in the body of your POST request
    try {
        
        const MIN_VIDEOS = 6;
        const TOTAL_VIDEOS = 10;
        
        let timeoutId; // Declare the timeoutId so we can clear it later

        // Simulating fetching recommended video IDs from the TCP server with a timeout
        const timeoutPromise = new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            console.log('TCP server took too long to respond. Proceeding with fallback.');
            resolve([]);  // Return an empty array after 10 seconds to continue the logic
          }, 1500);
        });
  
      const recommendedVideoIds = await Promise.race([
        recommendationService.getVideoRecommendations(userId, videoId),
        timeoutPromise,
      ]);
  
  
      // If the response is empty, handle the fallback logic
      if (!recommendedVideoIds || recommendedVideoIds.length === 0) {
        console.log('No recommended videos returned from TCP server. Fetching random videos.');
      }
      else
      {
        clearTimeout(timeoutId);
      }
        const videoDetails = await Video.find({
            '_id': { $in: recommendedVideoIds }
        });
        // Fetch all user data in parallel for better performance
        const userPromises = videoDetails.map(video => userService.getUser(video.createdBy));
        const users = await Promise.all(userPromises);

        // Create a map of userId to username for quick lookup
        const userMap = users.reduce((map, user) => {

            map[user._id.toString()] = { username: user.displayname, userProfileImg: user.profileImg };  // Ensure correct key type

            return map;
        }, {});

        let modifiedVideos = videoDetails.map(video => ({
            _id: video._id,
            title: video.title,
            views: video.views,
            likes: video.likes,
            videoUrl: `${process.env.PORT}${video.videoUrl}`,
            creatorImg: `${process.env.PORT}${userMap[video.createdBy.toString()].userProfileImg}`,
            userId: video.createdBy,
            createdBy: userMap[video.createdBy.toString()].username,
            date: new Date(video.date).toISOString(),
            comments: video.comments,

        }));
        // Check if the number of videos is less than 6
        if (modifiedVideos.length < MIN_VIDEOS) {
            // Fetch all available videos from videoService
            const allVideos = await videoService.fetchAllVideos();

            // Filter out any videos that are already in the recommended list to avoid duplicates
            const remainingVideos = allVideos.filter(video => !videoDetails.some(rec => rec._id === video._id));

            // Shuffle the remaining videos
            function shuffle(array) {
                return array.sort(() => 0.5 - Math.random());
            }
            const shuffledVideos = shuffle(remainingVideos);

            // Calculate how many more videos are needed to make the total 10
            const videosNeeded = TOTAL_VIDEOS - modifiedVideos.length;

            // Fetch all user data in parallel for better performance
            const userPromises2 = shuffledVideos.map(video => userService.getUser(video.createdBy));
            const users2 = await Promise.all(userPromises2);

            // Create a map of userId to username for quick lookup
            const userMap2 = users2.reduce((map, user) => {

                map[user._id.toString()] = { username: user.displayname, userProfileImg: user.profileImg };  // Ensure correct key type

                return map;
            }, {});
            // Add enough videos from the shuffled videos to make the total number of videos 10
            const additionalVideos = shuffledVideos.slice(0, videosNeeded).map(video => ({
                _id: video._id,
                title: video.title,
                views: video.views,
                likes: video.likes,
                videoUrl: `${process.env.PORT}${video.videoUrl}`,
                creatorImg: `${process.env.PORT}${userMap2[video.createdBy.toString()].userProfileImg}`,
                userId: video.createdBy,
                createdBy: userMap2[video.createdBy.toString()].username,
                date: new Date(video.date).toISOString(),
                comments: video.comments,
            }));

            // Combine recommended and additional videos
            modifiedVideos = [...modifiedVideos, ...additionalVideos];
        }
        // Ensure the total number of videos is exactly 10
        modifiedVideos = modifiedVideos.slice(0, TOTAL_VIDEOS);
        res.json(modifiedVideos);


    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).send('Failed to get recommendations');
    }
};




export default {
    getVideos,
    updateVideo,
    deleteVideo,
    createVideo,
    getVideo,
    getUserVideos,
    likeAction,
    getRecommendations
}