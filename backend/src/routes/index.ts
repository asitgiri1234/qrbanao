import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { restaurantRoutes } from './restaurant.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'QRbanao API is healthy', data: { uptime: process.uptime() } });
});

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);

export const apiRouter = router;
