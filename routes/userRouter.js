import express from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { getCurrentUser, updateAssistant } from '../controllers/userController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/current', isLoggedIn, getCurrentUser);
router.post('/update', isLoggedIn, upload.single('assistantImg'), updateAssistant);

export default router;