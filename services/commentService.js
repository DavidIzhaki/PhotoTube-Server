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

    const comment = await Comment.findByIdAndUpdate(commentId, updateData, { new: true });
    return comment;
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

const deleteCommentsByUserId = async (userId) => {
    try {
        await Comment.deleteMany({ userId });
        return true;
    } catch (error) {
        console.error('Error deleting comments:', error);
        throw new Error('Failed to delete comments');
    }
};










export default {
    addComment,
    deleteCommentsByVideoId,
    deleteCommentsByUserId,
    deleteComment,
    updateComment,
    getComment
};