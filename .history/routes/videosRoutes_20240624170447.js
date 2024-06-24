// routes/videoRoutes.js
import videosController from '../controllers/videosController.js'
import express from 'express'

const router = express.Router();

router.get('/videos', videosController.getVideos);
router.post('/videos', videosController.addVideo);
router.post('/', videosController.createVideo);

export default router