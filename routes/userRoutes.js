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

router.get('/isExist', userController.isExist)
router.post('/',upload.single('profileImg'), userController.createUser)
router.post('/login', userController.login)
router.get('/:id', userController.getUser)
router.get('/:id', userController.isLoggedIn, userController.getUser)

router.get('/info/:id', userController.isLoggedIn, userController.getInfoUser)
router.patch('/:id', userController.isLoggedIn,upload.single('profileImg'), userController.updateUser)
router.delete('/:id', userController.isLoggedIn, userController.deleteUser)

export default router