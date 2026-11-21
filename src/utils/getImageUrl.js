/**
 * Drop this file into: mazaprintwala-admin/src/utils/getImageUrl.js
 *
 * Why: the admin panel used to build image URLs like
 *
 * src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
 *
 * which breaks the moment a product image is an absolute Cloudinary URL
 * (you would get "https://api.mazaprintwala.comhttps://res.cloudinary.com/...").
 *
 * This helper handles all three cases:
 * - absolute URL (Cloudinary, http/https) -> returned unchanged
 * - "/images/..." (served by Next public) -> returned unchanged
 * - anything else ("/uploads/artwork/x.pdf") -> prefixed with the API URL
 */
export const getImageUrl = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  const path = value.trim();
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/images/')) return path;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '').replace(/\/api\/?$/, '');
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default getImageUrl;
