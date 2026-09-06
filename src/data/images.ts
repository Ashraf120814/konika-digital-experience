/**
 * Free high-resolution jewellery photography from Unsplash
 * License: Unsplash License (free to use commercially)
 * https://unsplash.com/license
 *
 * URLs request large widths suitable for retina / 4K displays.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

/** Hero / editorial lifestyle */
export const siteImages = {
  hero: u('photo-1515562141207-7a88fb7ce338', 2400),
  heroAlt: u('photo-1599643478518-a784e5dc4c8f', 2400),
  heritage: u('photo-1611591437281-460bfbe1220a', 2000),
  bridal: u('photo-1515934751635-c81c6bc9a2d8', 2000),
  festive: u('photo-1601121141461-9d9642bb6a4c', 2000),
  everyday: u('photo-1535632066927-ab7c9ab60908', 2000),
  gift: u('photo-1573408301185-9146fe634ad0', 2000),
  engagement: u('photo-1605100804763-247f67b3557e', 2000),
};

/** Category tiles */
export const categoryImages: Record<string, string> = {
  Rings: u('photo-1605100804763-247f67b3557e', 900),
  Earrings: u('photo-1535632066927-ab7c9ab60908', 900),
  Necklaces: u('photo-1599643478518-a784e5dc4c8f', 900),
  Bracelets: u('photo-1611591437281-460bfbe1220a', 900),
  Pendants: u('photo-1515562141207-7a88fb7ce338', 900),
  Mangalsutra: u('photo-1601121141461-9d9642bb6a4c', 900),
};

/** Collection tiles */
export const collectionImages: Record<string, string> = {
  Polki: u('photo-1573408301185-9146fe634ad0', 1200),
  Meenakari: u('photo-1617038260897-41a1f14a8ca0', 1200),
  Temple: u('photo-1601121141461-9d9642bb6a4c', 1200),
  Antique: u('photo-1515562141207-7a88fb7ce338', 1200),
  Navratana: u('photo-1599643478518-a784e5dc4c8f', 1200),
  Bridal: u('photo-1515934751635-c81c6bc9a2d8', 1200),
  Gold: u('photo-1611591437281-460bfbe1220a', 1200),
  Diamond: u('photo-1605100804763-247f67b3557e', 1200),
};

/**
 * Pool of product photos — assigned by product index / category
 * All free Unsplash jewellery still-life & lifestyle shots
 */
export const productImagePool = [
  u('photo-1605100804763-247f67b3557e', 1200), // ring close-up
  u('photo-1515562141207-7a88fb7ce338', 1200), // gold jewellery flatlay
  u('photo-1535632066927-ab7c9ab60908', 1200), // earrings
  u('photo-1599643478518-a784e5dc4c8f', 1200), // necklace lifestyle
  u('photo-1611591437281-460bfbe1220a', 1200), // gold chains / bracelets
  u('photo-1601121141461-9d9642bb6a4c', 1200), // ornate gold
  u('photo-1573408301185-9146fe634ad0', 1200), // jewellery display
  u('photo-1617038260897-41a1f14a8ca0', 1200), // earrings detail
  u('photo-1602173574767-37ac01994b2a', 1200), // jewellery hands
  u('photo-1630019852942-f89202989a59', 1200), // gold pieces
  u('photo-1611652022419-a9419f74343a', 1200), // necklace
  u('photo-1588444837495-c6cfeb53f32d', 1200), // jewellery set
  u('photo-1515934751635-c81c6bc9a2d8', 1200), // bridal style
  u('photo-1457972729786-91938f986016', 1200), // rings
  u('photo-1506630448383-2a9899cd01d5', 1200), // jewellery macro
  u('photo-1469334031218-e382a71b716b', 1200), // fashion jewellery
];

/** Secondary angles for gallery */
export const productImagePoolAlt = [
  u('photo-1611652022419-a9419f74343a', 1200),
  u('photo-1588444837495-c6cfeb53f32d', 1200),
  u('photo-1602173574767-37ac01994b2a', 1200),
  u('photo-1630019852942-f89202989a59', 1200),
  u('photo-1457972729786-91938f986016', 1200),
  u('photo-1506630448383-2a9899cd01d5', 1200),
  u('photo-1469334031218-e382a71b716b', 1200),
  u('photo-1515562141207-7a88fb7ce338', 1200),
];

const categoryPoolIndex: Record<string, number[]> = {
  Rings: [0, 13, 4, 9],
  Earrings: [2, 7, 1, 8],
  Necklaces: [3, 10, 11, 5],
  Bracelets: [4, 8, 9, 1],
  Pendants: [10, 11, 5, 3],
  Mangalsutra: [5, 11, 3, 12],
};

export function imagesForProduct(
  productId: string,
  category: string
): [string, string] {
  const nums = productId.replace(/\D/g, '') || '1';
  const n = parseInt(nums, 10) || 1;
  const poolIdx = categoryPoolIndex[category] || [0, 1, 2, 3];
  const primary = productImagePool[poolIdx[n % poolIdx.length] % productImagePool.length];
  const secondary =
    productImagePoolAlt[(n + 3) % productImagePoolAlt.length];
  return [primary, secondary];
}

export function imgSrc(url: string, width = 800): string {
  if (!url.includes('images.unsplash.com')) return url;
  return url.replace(/w=\d+/, `w=${width}`);
}
