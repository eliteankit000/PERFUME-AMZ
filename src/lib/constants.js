// UX-only constant. Real authorization is enforced by Supabase RLS (see supabase/schema.sql).
export const ADMIN_EMAIL = 'aniketar111@gmail.com';

// [key stored in products.category, full name, short label]
export const CATS = [
  ['men', "Men's Fragrance", 'Men'], ['women', "Women's Fragrance", 'Women'], ['unisex', 'Unisex Fragrance', 'Unisex'],
  ['best', 'Best Sellers', 'Best Sellers'], ['luxury', 'Luxury Fragrances', 'Luxury'], ['everyday', 'Everyday Fragrances', 'Everyday'],
  ['date', 'Date Night', 'Date Night'], ['fresh', 'Fresh & Clean', 'Fresh'], ['long', 'Long Lasting', 'Long Lasting'],
  ['gift', 'Gift Ideas', 'Gifting'], ['office', 'Office', 'Office'], ['summer', 'Summer', 'Summer'],
];
export const CHIP_KEYS = ['men', 'women', 'unisex', 'luxury', 'everyday', 'date', 'fresh', 'long'];
export const NAV = [['all', 'Discover'], ['men', "Men's"], ['women', "Women's"], ['unisex', 'Unisex'], ['best', 'Best Sellers']];
export const TILES = [
  ['date', 'Date Night', 'Dark and seductive', '#1c1517'], ['everyday', 'Everyday', 'Clean and easy', '#8a7d68'],
  ['office', 'Office', 'Sophisticated, understated', '#3b3a37'], ['summer', 'Summer', 'Bright and airy', '#b09a6d'],
  ['luxury', 'Luxury', 'Rich and editorial', '#151515'], ['gift', 'Gifting', 'Made to be given', '#6b5a45'],
];
export const catName = (k) => (CATS.find((c) => c[0] === k) || [])[1] || 'Uncategorized';
