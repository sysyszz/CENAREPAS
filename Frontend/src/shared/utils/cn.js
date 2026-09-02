export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter((v) => typeof v === 'string' && v.length > 0)
    .join(' ');
}
