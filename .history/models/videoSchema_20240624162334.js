// models/Video.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    views: { type: Number, default: 0 },
    timeago: { type: Date, default: Date.now },
    image: { type: String, required: true },
    video: { type: String, required: true },
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } });

const Video = mongoose.model('Video', videoSchema);

export default Video;