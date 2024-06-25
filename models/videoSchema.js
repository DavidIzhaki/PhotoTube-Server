import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the like sub-schema
const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  }
});

// Define the video schema
const videoSchema = new Schema({
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: [likeSchema], // Use the like sub-schema
  date: { type: Date, default: Date.now },
  videoUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
