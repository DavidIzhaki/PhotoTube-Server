import videoController from '../controllers/videoController.js'
import userController from '../controllers/userController.js'
import express from 'express'
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

router.get('/', videoController.getVideos);
router.get('/:id/videos', videoController.getUserVideos);
router.get('/:id/videos/:pid', videoController.getVideo);
router.patch('/:id/videos/:pid', userController.isLoggedIn,upload.single('videoFile'), videoController.updateVideo);
router.delete('/:id/videos/:pid', userController.isLoggedIn, videoController.deleteVideo);
router.patch('/:id/videos/:pid/like', userController.isLoggedIn, videoController.likeAction);
router.post('/:id/videos', userController.isLoggedIn, upload.single('video'), videoController.createVideo);


export default router