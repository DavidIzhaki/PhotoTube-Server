import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
