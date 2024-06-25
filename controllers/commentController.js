import videoService from '../services/videoService.js';
import commentService from '../services/commentService.js';

// 201 Created: The request has succeeded and a new resource has been created as a result.
// 400 Bad Request: The server could not understand the request due to invalid syntax.
// 404 Not Found: The server can not find the requested resource.
// 500 Internal Server Error: The server encountered an unexpected 
//     condition that prevented it from fulfilling the request.


const createComment = async (req, res) => {
    try {
    
        const { id, pid } = req.params;  // id is userId, pid is videoId
        const commentText = req.body.commentText;
        const newComment = await commentService.addComment(commentText,id, pid);
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
        const comment = await commentService.getCommentById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const videoId = comment.videoId;

        // Delete the comment
        const deletedComment = await commentService.deleteComment(id);
        if (!deletedComment) {
            return res.status(404).json({ message: "Failed to delete comment" });
        }

        // Remove the comment ID from the video's comments array
        const video = await videoService.updateVideo(videoId, { $pull: { comments: id } });
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
        const comment = await commentService.getCommentById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Update the comment
        const updatedComment = await commentService.updateComment(id, updateData);

        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        console.error('Failed to update comment:', error.message);
        res.status(500).json({ message: error.message });
    }
};





export default { 
    createComment,
    deleteComment,
    editComment

  };