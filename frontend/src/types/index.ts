/** Shared domain types mirroring the backend API contract. */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type RestaurantStatus = 'ACTIVE' | 'INACTIVE';

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo: string | null;
  phone: string | null;
  address: string | null;
  currency: string;
  themeColor: string;
  description: string | null;
  status: RestaurantStatus;
  createdAt: string;
  updatedAt: string;
}

/** Standard API success envelope returned by every backend endpoint. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
