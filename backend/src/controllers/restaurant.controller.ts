import type { Request, Response } from 'express';
import { restaurantService } from '../services/restaurant.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';

export const restaurantController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await restaurantService.create(req.user!.id, req.body);
    return sendSuccess(res, { restaurant }, 'Restaurant created', 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const restaurants = await restaurantService.listForOwner(req.user!.id);
    return sendSuccess(res, { restaurants }, 'OK');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await restaurantService.getOwnedById(req.user!.id, req.params.id!);
    return sendSuccess(res, { restaurant }, 'OK');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await restaurantService.update(req.user!.id, req.params.id!, req.body);
    return sendSuccess(res, { restaurant }, 'Restaurant updated');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await restaurantService.remove(req.user!.id, req.params.id!);
    return sendSuccess(res, null, 'Restaurant deleted');
  }),
};
