import express from 'express';
import { register, login, deleteUser  } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete ('/:id', deleteUser);   

export default router;
