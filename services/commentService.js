import Comment from '../models/commentSchema.js'

const addComment = async (commentText, userId, videoId) => {
    const comment = new Comment({
        text: commentText,
        createdBy: userId,
        videoId
    });
    await comment.save();
    return comment;
};


const updateComment = async (commentId, updateData) => {
    try {
        const comment = await Comment.findByIdAndUpdate(commentId, updateData, { new: true });
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};


const getComment = async (commentId) => {
    try {
        const comment = await Comment.findById(commentId);
        return comment;
    } catch (error) {
        console.error("Error finding comment:", error);
        throw error;
    }
}

const deleteComment = async (commentId) => {
    const result = await Comment.findByIdAndDelete(commentId);
    return result;
};

const deleteCommentsByVideoId = async (videoId) => {
    try {
        await Comment.deleteMany({ videoId });
        return true;
    } catch (error) {
        console.error('Error deleting comments:', error);
        throw new Error('Failed to delete comments');
    }
};

const deleteCommentsByUserId = async (createdBy) => {
    try {
        await Comment.deleteMany({ createdBy });
        return true;
    } catch (error) {
        console.error('Error deleting comments:', error);
        throw new Error('Failed to delete comments');
    }
};

const getComments = async (videoId) => {

    try {
        return  await Comment.find({ videoId });
    } catch (error) {
        throw new Error('Database query failed');
    }
};







export default {
    addComment,
    deleteCommentsByVideoId,
    deleteCommentsByUserId,
    deleteComment,
    updateComment,
    getComment,
    getComments
};