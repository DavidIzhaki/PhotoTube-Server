import videoController from '../controllers/videoController.js'
import userController from '../controllers/userController.js'
import express from 'express'

const router = express.Router();

router.get('/', videoController.getVideos);
router.get('/:id/videos', videoController.getUserVideos);
router.get('/:id/videos/:pid', videoController.getVideo);
router.patch('/:id/videos/:pid', userController.isLoggedIn, videoController.updateVideo);
router.delete('/:id/videos/:pid', userController.isLoggedIn, videoController.deleteVideo);
router.patch('/:id/videos/:pid/like', userController.isLoggedIn, videoController.likeAction);
router.post('/:id/videos',userController.isLoggedIn, videoController.createVideo)


export default router