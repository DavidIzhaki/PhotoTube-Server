// routes/videoRoutes.js
import videosController from '../controllers/videosController.js'
import express from 'express'

const router = express.Router();

router.get('/videos', videosController.getVideos);
router.post('/videos', videosController.createVideo);
router.patch('/:videoId', protect, authorize, videosController.updateVideo);
router.delete('/:videoId', protect, authorize, videosController.deleteVideo);

export default router