import type { Restaurant } from '@prisma/client';
import { restaurantRepository } from '../repositories/restaurant.repository';
import { AppError } from '../utils/AppError';
import { randomSuffix, slugify } from '../utils/slug';
import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from '../validators/restaurant.validator';

class RestaurantService {
  /**
   * Generate a unique slug from the name. We try the clean slug first, then
   * append short random suffixes on collision. A few retries is plenty; the
   * unique DB constraint is the real source of truth.
   */
  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name) || 'restaurant';
    let candidate = base;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const existing = await restaurantRepository.findBySlug(candidate);
      if (!existing) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }

    // Extremely unlikely; fall back to a longer suffix.
    return `${base}-${randomSuffix(8)}`;
  }

  async create(ownerId: string, input: CreateRestaurantInput): Promise<Restaurant> {
    const slug = await this.generateUniqueSlug(input.name);

    return restaurantRepository.create({
      ownerId,
      slug,
      name: input.name,
      phone: input.phone,
      address: input.address,
      currency: input.currency ?? 'INR',
      themeColor: input.themeColor ?? '#4F46E5',
      logo: input.logo,
      description: input.description,
    });
  }

  listForOwner(ownerId: string): Promise<Restaurant[]> {
    return restaurantRepository.findManyByOwner(ownerId);
  }

  /**
   * Fetch a restaurant and assert the requester owns it. Centralising this
   * tenant-isolation check means no controller can accidentally leak another
   * owner's data — critical for a multi-tenant product.
   */
  async getOwnedById(ownerId: string, id: string): Promise<Restaurant> {
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      throw AppError.notFound('Restaurant not found');
    }
    if (restaurant.ownerId !== ownerId) {
      // 404 (not 403) so we don't reveal that the id exists for someone else.
      throw AppError.notFound('Restaurant not found');
    }
    return restaurant;
  }

  async update(ownerId: string, id: string, input: UpdateRestaurantInput): Promise<Restaurant> {
    await this.getOwnedById(ownerId, id); // ownership guard
    return restaurantRepository.update(id, input);
  }

  async remove(ownerId: string, id: string): Promise<void> {
    await this.getOwnedById(ownerId, id); // ownership guard
    await restaurantRepository.delete(id);
  }
}

export const restaurantService = new RestaurantService();
