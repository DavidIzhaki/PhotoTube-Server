// routes/videoRoutes.js
import videosController from '../controllers/videosController.js'
import express from 'express'

const router = express.Router();

router.get('/', videosController.getVideos);

export default router