// routes/videoRoutes.js
import commentController from '../controllers/commentController.js'
import userController from '../controllers/userController.js'
import videoController from '../controllers/videoController.js'
import express from 'express'

const router = express.Router();

router.get('/:id/comments/:pid', userController.getcommentsOfUser);
router.patch('/:id/comments/:pid', userController.isLoggedIn, userController.updateVideoOfUser);
router.delete('/:id/comments/:pid', userController.isLoggedIn, userController.deleteVideoOfUser);
router.get('/:id/comments', userController.getUserVideos);
router.post('/:id/comments', userController.isLoggedIn, userController.createVideo)


export default router