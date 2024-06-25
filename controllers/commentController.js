import videoService from '../services/videoService.js';
import commentService from '../services/commentService.js';
import userService from '../services/userService.js';

// 201 Created: The request has succeeded and a new resource has been created as a result.
// 400 Bad Request: The server could not understand the request due to invalid syntax.
// 404 Not Found: The server can not find the requested resource.
// 500 Internal Server Error: The server encountered an unexpected 
//     condition that prevented it from fulfilling the request.


const createComment = async (req, res) => {
    try {
    
        const { id, pid } = req.params;  // id is userId, pid is videoId
        const commentText = req.body.text;

        const newComment = await commentService.addComment(commentText,id, pid);

        // Add the comment to the video's comments array
        await videoService.addCommentToVideo(pid, newComment._id);

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id; // Get comment ID from URL parameters
        
        // Find the comment to get the video ID
        const comment = await commentService.getComment(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        console.log(comment)
        const videoId = comment.videoId;

        // Delete the comment
        const deletedComment = await commentService.deleteComment(id);
        if (!deletedComment) {
            return res.status(404).json({ message: "Failed to delete comment" });
        }

        // Remove the comment ID from the video's comments array
        const video = await videoService.deleteCommentFromVideo(videoId, id);
        if (!video) {
            return res.status(404).json({ message: "Failed to update video comments" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const editComment = async (req, res) => {
    const id = req.params.id;   // id is userId, cid is commentId
    const updateData = req.body;  // Data to update the comment with
 
    try {
        // First, verify that the comment belongs to the user making the request
        const comment = await commentService.getComment(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        // Update the comment
        const updatedComment = await commentService.updateComment(id, updateData);
        console.log(updatedComment);
        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        console.error('Failed to update comment:', error.message);
        res.status(500).json({ message: error.message });
    }
};
const getCommentsByVideoId = async (req, res) => {
    try {
        const { pid } = req.params;
        const comments = await commentService.getComments(pid);

        // Fetch all user data in parallel for better performance
        const userPromises = comments.map(comment => userService.getUser(comment.createdBy));
        const users = await Promise.all(userPromises);

        // Create a map of userId to user details for quick lookup
        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = { username: user.displayname, userProfileImg: user.profileImg }; // Ensure correct key type
            return map;
        }, {});

        // Enhance comments with user details
        const enhancedComments = comments.map(comment => ({
            text: comment.text,
            _id:comment._id,
            createdBy:comment.createdBy,
            videoId:comment.videoId,
            date:comment.date,
            userProfileImg: userMap[comment.createdBy.toString()].userProfileImg,
            username: userMap[comment.createdBy.toString()].username,
        }));
   

        res.status(200).json(enhancedComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





export default { 
    createComment,
    deleteComment,
    editComment,
    getCommentsByVideoId

  };