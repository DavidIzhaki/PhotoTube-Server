// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/videos', videoController.getVideos);
router.post('/', videoController.createVideo);

export default router