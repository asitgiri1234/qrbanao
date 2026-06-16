import { Router } from 'express';
import { restaurantController } from '../controllers/restaurant.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createRestaurantSchema,
  restaurantIdSchema,
  updateRestaurantSchema,
} from '../validators/restaurant.validator';

const router = Router();

// Every restaurant route requires authentication and operates on the
// authenticated owner's tenant only.
router.use(requireAuth);

router.post('/', validate(createRestaurantSchema), restaurantController.create);
router.get('/', restaurantController.list);
router.get('/:id', validate(restaurantIdSchema), restaurantController.getById);
router.put('/:id', validate(updateRestaurantSchema), restaurantController.update);
router.delete('/:id', validate(restaurantIdSchema), restaurantController.remove);

export const restaurantRoutes = router;
