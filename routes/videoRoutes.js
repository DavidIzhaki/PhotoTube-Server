// routes/videoRoutes.js
import videoController from '../controllers/videoController.js'
import userController from '../controllers/userController.js'
import express from 'express'

const router = express.Router();

router.get('/', videoController.getVideos);
router.get('/:id/videos/:pid', userController.getVideoOfUser);
router.patch('/:id/videos/:pid', userController.isLoggedIn, videoController.updateVideoOfUser);
router.delete('/:id/videos/:pid', userController.isLoggedIn, videoController.deleteVideoOfUser);
router.get('/:id/videos', userController.getUserVideos);
router.post('/:id/videos',userController.isLoggedIn, videoController.createVideo)


export default router