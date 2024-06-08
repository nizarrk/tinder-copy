import express from 'express';
import { Router } from 'express';
import { userSwipe, getListUserSwipe } from '../controllers/swipeController';
import { verifyToken } from '../middlewares/authMiddleware';

const router: Router = express.Router();

router.get('/', verifyToken, getListUserSwipe);
router.post('/', verifyToken, userSwipe);

export default router;
