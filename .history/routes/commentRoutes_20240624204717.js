// routes/videoRoutes.js
import commentController from '../controllers/commentController.js'
import userController from '../controllers/userController.js'
import videoController from '../controllers/videoController.js'
import express from 'express'

const router = express.Router();

router.get('/:id/comments/:pid', userController.getCommentOfUser);
router.patch('/:id/comments/:pid', userController.isLoggedIn, userController.updateCommentOfUser);
router.delete('/:id/comments/:pid', userController.isLoggedIn, userController.deleteCommentOfUser);
router.get('/:id/comments', userController.getUserComments);
router.post('/:id/comments', userController.isLoggedIn, userController.createVideo)


export default router