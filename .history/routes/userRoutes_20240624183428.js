import userController from '../controllers/userController.js'
import express from 'express'

const router = express.Router();

router.get('/isExist', userController.isExist)
router.post('/', userController.createUser)
router.post('/login', userController.login)
router.get('/:id/videos/:pid', userController.getVideoOfUser);
router.patch('/:id/videos/:pid', userController.isLoggedIn, userController.updateVideoOfUser);
router.delete('/:id/videos/:pid', userController.isLoggedIn, userController.deleteVideoOfUser);
router.get('/:id/videos', userController.getUserVideos);
router.post('/:id/videos', userController.login)
router.get('/:id', userController.isLoggedIn, userController.getUser)
router.patch('/:id', userController.isLoggedIn, userController.updateUser)
router.delete('/:id', userController.isLoggedIn, userController.deleteUser)

export default router