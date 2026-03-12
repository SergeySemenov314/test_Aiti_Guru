export function getRatingColor(rating: number): string {
  if (rating < 3) return 'text-red-500';
  return 'text-gray-700';
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
