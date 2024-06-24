// routes/videoRoutes.js
import videosController from '../controllers/videosController.js'
import userController from '../'
import express from 'express'

const router = express.Router();

router.get('/', videosController.getVideos);
router.get('/:id/videos/:pid', userController.getVideoOfUser);
router.patch('/:id/videos/:pid', userController.isLoggedIn, userController.updateVideoOfUser);
router.delete('/:id/videos/:pid', userController.isLoggedIn, userController.deleteVideoOfUser);
router.get('/:id/videos', userController.getUserVideos);
router.post('/:id/videos',userController.isLoggedIn, userController.createVideo)


export default router