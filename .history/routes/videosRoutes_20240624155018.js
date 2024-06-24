// routes/videoRoutes.js
import videoController from '../controllers/userController.js'
import express from 'express'
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/videos', videosController.getVideos);
router.post('/', videosController.createVideo);

export default router