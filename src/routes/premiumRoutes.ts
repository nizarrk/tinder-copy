import express from 'express';
import { Router } from 'express';
import { purchasePremium } from '../controllers/premiumController';
import { verifyToken } from '../middlewares/authMiddleware';

const router: Router = express.Router();

router.post('/purchase', verifyToken, purchasePremium);

export default router;
