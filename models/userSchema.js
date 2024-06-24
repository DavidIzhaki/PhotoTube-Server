import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  displayname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    required: true
  },
  videoList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;