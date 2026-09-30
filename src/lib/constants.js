// UX-only constant. Real authorization is enforced by Supabase RLS (see supabase/schema.sql).
export const ADMIN_EMAIL = 'aniketar111@gmail.com';

// [key stored in products.category, full name, short label]
export const CATS = [
  ['men', "Men's Watches", 'Men'], ['women', "Women's Watches", 'Women'], ['unisex', 'Unisex Watches', 'Unisex'],
  ['best', 'Best Sellers', 'Best Sellers'], ['luxury', 'Luxury Watches', 'Luxury'], ['everyday', 'Everyday Watches', 'Everyday'],
  ['date', 'Dress Watches', 'Dress'], ['fresh', 'Sport & Dive', 'Sport'], ['long', 'Automatic Movement', 'Automatic'],
  ['gift', 'Gift Ideas', 'Gifting'], ['office', 'Business', 'Business'], ['summer', 'Outdoor & Adventure', 'Adventure'],
];
export const CHIP_KEYS = ['men', 'women', 'unisex', 'luxury', 'everyday', 'date', 'fresh', 'long'];
export const NAV = [['all', 'Discover'], ['men', "Men's"], ['women', "Women's"], ['unisex', 'Unisex'], ['best', 'Best Sellers']];
export const TILES = [
  ['date', 'Dress', 'Slim, refined, evening-ready', '#1c1517'], ['everyday', 'Everyday', 'Versatile and effortless', '#8a7d68'],
  ['office', 'Business', 'Sophisticated, understated', '#3b3a37'], ['summer', 'Adventure', 'Built for the outdoors', '#b09a6d'],
  ['luxury', 'Luxury', 'Rich and timeless', '#151515'], ['gift', 'Gifting', 'Made to be remembered', '#6b5a45'],
];
export const catName = (k) => (CATS.find((c) => c[0] === k) || [])[1] || 'Uncategorized';
