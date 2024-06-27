import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import customEnv from 'custom-env';

// Load environment variables
customEnv.env(process.env.NODE_ENV, './config');

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your models
import User from './models/userSchema.js'; // Adjust the path as necessary
import Video from './models/videoSchema.js'; // Adjust the path as necessary
import Comment from './models/commentSchema.js'; // Adjust the path as necessary

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {});
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}

async function clearData() {
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
}

async function createFakeUsers() {
    const users = [];
    for (let i = 0; i < 5; i++) {
        users.push({
            username: faker.internet.userName(),
            password: faker.internet.password(),
            displayname: faker.person.fullName(),
            gender: faker.helpers.arrayElement(['male', 'female']),
            profileImg: faker.image.avatar(),
        });
    }
    const createdUsers = await User.insertMany(users);
    return createdUsers;
}

async function createFakeVideos(users) {
    const videos = [];
    for (let i = 1; i <= 9; i++) {
        const videoPath = path.join(__dirname, 'Videos', `v${i}.txt`);
        const content = fs.readFileSync(videoPath, 'utf8');

        // Ensure content does not exceed MongoDB's BSON document size limit
        if (Buffer.byteLength(content, 'utf8') > 16 * 1024 * 1024) {
            console.error(`Content of ${videoPath} exceeds MongoDB's BSON document size limit.`);
            continue;
        }

        const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
        const video = new Video({
            title: faker.lorem.words(3),
            videoUrl: content,
            createdBy: user._id,
            likes: [],
            views: faker.number.int({ min: 0, max: 1000 }),
            comments: []
        });
        await video.save();
        user.videoList.push(video._id);
        await user.save();
        videos.push(video);
    }
    return videos;
}

async function createFakeComments(users, videos) {
    const comments = [];
    for (let i = 0; i < 20; i++) {
        const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
        const video = videos[faker.number.int({ min: 0, max: videos.length - 1 })];
        const comment = new Comment({
            text: faker.lorem.sentence(),
            createdBy: user._id,
            videoId: video._id
        });
        await comment.save();
        video.comments.push(comment._id);
        await video.save();
        comments.push(comment);
    }
}

async function run() {
    await connectDB(); // Ensure database connection

    try {
        await clearData();
        console.log('Cleared existing data');

        const users = await createFakeUsers();
        console.log('Created fake users');

        const videos = await createFakeVideos(users);
        console.log('Created fake videos');

        await createFakeComments(users, videos);
        console.log('Created fake comments');

        console.log('Fake data generation complete');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

run();
