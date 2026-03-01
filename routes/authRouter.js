import express from 'express'
import {logout, signinUser, signupUser } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signupUser);

router.post('/signin', signinUser);

router.get('/logout', logout)

export default router;