import { Product } from '../data/landingData';
import { ImageWithFallback } from './ImageWithFallback';
import { colors } from '../styles/colors';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ position: 'relative' }}>
        <ImageWithFallback src={product.img} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: colors.blue,
          color: colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 800,
          boxShadow: '0 2px 8px rgba(26,92,219,0.4)',
        }}>
          {product.badge}
        </div>
      </div>
      <div style={{ padding: '18px 16px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: colors.dark, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 12, color: colors.mid, lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
          {product.desc}
        </div>
        <div style={{ fontWeight: 400, fontSize: 22, color: colors.blue, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>
          {product.price}
        </div>
        <button style={{
          background: colors.blue,
          color: colors.white,
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          padding: '10px 0',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 400,
          transition: 'opacity 0.15s',
          fontFamily: "'Playfair Display', serif",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
          Ver detalles
        </button>
      </div>
    </div>
  );
}

