// routes/videoRoutes.js
import videosController from '../controllers/videosController.js'
import express from 'express'
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/videos', videosController.getVideos);
router.post('/', videosController.createVideo);

export default router