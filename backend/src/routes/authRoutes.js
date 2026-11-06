import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { tenantContext } from '../middlewares/tenantContext.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Enforce tenant scoping across all auth endpoints
router.use(tenantContext);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;