import express from 'express'
import bodyParser from 'body-parser'
import userRouter from './routes/userRoutes.js'
import videoRouter from './routes/videoRoutes.js'
import commentRouter from './routes/commentRoutes.js'
// import commentRouter from './routes/commentRoutes.js'
import mongoose from 'mongoose'
import customEnv from 'custom-env'
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

customEnv.env(process.env.NODE_ENV, './config')
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Base URL: ${BASE_URL}`);
mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

  
const server = express()
console.log('Server initialized.');
server.use(cors());
server.use(express.static(path.join(__dirname, 'public')));
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
server.use('/fakeData', express.static(path.join(__dirname, 'fakeData')));

server.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))
server.use(express.json({limit: '200mb'}));


// Ensure uploads directory exists

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads dir.');
  fs.mkdirSync(uploadsDir);
}

// use routes
server.use('/api/users', userRouter);
server.use('/api/users', videoRouter);
server.use('/api/videos', videoRouter);
server.use('/api/users', commentRouter);

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(process.env.PORT)