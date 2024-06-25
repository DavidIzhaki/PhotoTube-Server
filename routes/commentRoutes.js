// routes/videoRoutes.js
import commentController from '../controllers/commentController.js'
import userController from '../controllers/userController.js'
import express from 'express'

const router = express.Router();

router.post('/:id/videos/:pid/comments', userController.isLoggedIn, commentController.createComment);
router.delete('/:id/comments', userController.isLoggedIn, commentController.deleteComment);
router.patch('/:id/comments', userController.isLoggedIn, commentController.editComment);


export default router