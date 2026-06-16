/**
 * Convert a restaurant name into a URL-safe slug used at /qr/{slug}.
 * e.g. "The Pizza House!" -> "the-pizza-house"
 */
export const slugify = (input: string): string =>
  input
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (combining marks)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // drop invalid chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace/underscores to a single dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

/** Short random suffix used to de-duplicate colliding slugs. */
export const randomSuffix = (length = 4): string =>
  Math.random()
    .toString(36)
    .slice(2, 2 + length);
