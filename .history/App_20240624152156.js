import express from 'express'
import bodyParser from 'body-parser'
import userRouter from './routes/userRoutes.js'
import videosRouter from './routes/videosRoutes'
import mongoose from 'mongoose'
import customEnv from 'custom-env'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

customEnv.env(process.env.NODE_ENV, './config')

console.log(`Environment: ${process.env.NODE_ENV}`);
mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const server = express()
console.log('Server initialized.');
server.use(cors());
server.use(express.static(path.join(__dirname, 'public')));

server.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
server.use(express.json({limit: '100mb'}));

// use routes
server.use('/users', userRouter);
server.use

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(process.env.PORT)