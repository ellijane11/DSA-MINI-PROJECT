
import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);

export default router;

