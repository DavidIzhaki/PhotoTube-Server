// routes/videoRoutes.js
import videoController from '../controllers/userController.js'
import express from 'express'
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/videos', videoController.getVideos);
router.post('/', videoController.createVideo);

export default router