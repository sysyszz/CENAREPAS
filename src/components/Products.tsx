import { PRODUCTS } from '../data/landingData';
import ProductCard from './ProductCard';
import { colors } from '../styles/colors';

export default function Products() {
  return (
    <div id="productos" style={{ background: colors.gray, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, color: colors.dark, marginBottom: 48, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
          NUESTROS PRODUCTOS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
