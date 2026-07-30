// components/Productos.jsx
import { Section } from './Section';
import { ImageWithFallback } from './ImageWithFallback';

const PRODUCTS = [
  {
    id: 1,
    badge: 'x1',
    name: 'Arepa Amarilla',
    desc: 'Hecha con maíz amarillo seleccionado. Suave, fresca y deliciosa.',
    price: '$1.200',
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmVwYSUyMGNvcm4lMjBicmVhZCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3ODEwMjk2NjV8MA&ixlib=rb-4.1.0&q=80&w=600'
  },
  {
    id: 2,
    badge: 'x5',
    name: 'Paquete de Arepas x5',
    desc: '5 arepas frescas perfectas para compartir en familia.',
    price: '$5.000',
    img: 'https://images.unsplash.com/photo-1710018349908-39d998a519b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmbGF0YnJlYWQlMjJwaXRhJTIwYnJlYWQlMjJwYWNrYWdlJTIwcGxhc3RpYyUyMHdyYXAlMjJzdGFja2VkfGVufDF8fHx8MTc4MTAyOTY2Nnww&ixlib=rb-4.1.0&q=80&w=600'
  },
  {
    id: 3,
    badge: 'x10',
    name: 'Paquete de Arepas x10',
    desc: '10 arepas frescas ideales para toda la semana.',
    price: '$9.000',
    img: 'https://images.unsplash.com/photo-1625605927823-7f10eaab7927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmbGF0YnJlYWQlMjJwaXRhJTIwYnJlYWQlMjJwYWNrYWdlJTIwcGxhc3RpYyUyMHdyYXAlMjJzdGFja2VkfGVufDF8fHx8MTc4MTAyOTY2Nnww&ixlib=rb-4.1.0&q=80&w=600'
  },
  {
    id: 4,
    badge: 'x5',
    name: 'Paquete de Arepas Amarillas x5',
    desc: '5 arepas amarillas artesanales llenas de sabor y tradición.',
    price: '$6.000',
    img: 'https://images.unsplash.com/photo-1644753787071-8933b5daed2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmVwYSUyMGFtYXJpbGxhJTIwbWFpeiUyMGNvbG9tYmlhbmElMjBwbGF0b3xlbnwxfHx8fDE3ODEwMjg2MzZ8MA&ixlib=rb-4.1.0&q=80&w=600'
  },
];

export const Productos = () => (
  <Section id="productos" bg="#F5F5F5">
    <h2 style={{
      textAlign: 'center',
      fontSize: 32,
      fontWeight: 700,
      color: '#1A1A1A',
      marginBottom: 48,
      letterSpacing: '0.04em',
      fontFamily: "'Playfair Display', serif"
    }}>
      NUESTROS PRODUCTOS
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }}>
      {PRODUCTS.map(p => (
        <div key={p.id} style={{
          background: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s',
        }}>
          {/* Image + badge */}
          <div style={{ position: 'relative' }}>
            <ImageWithFallback
              src={p.img}
              alt={p.name}
              style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#1A5CDB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(26,92,219,0.4)',
            }}>
              {p.badge}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '18px 16px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 14,
              color: '#1A1A1A',
              marginBottom: 6,
              fontFamily: "'Playfair Display', serif"
            }}>
              {p.name}
            </div>
            <div style={{
              fontSize: 12,
              color: '#6B7280',
              lineHeight: 1.6,
              flex: 1,
              marginBottom: 14,
              fontWeight: 400
            }}>
              {p.desc}
            </div>
            <div style={{
              fontWeight: 400,
              fontSize: 22,
              color: '#1A5CDB',
              marginBottom: 12,
              fontFamily: "'Playfair Display', serif"
            }}>
              {p.price}
            </div>
            <button style={{
              background: '#1A5CDB',
              color: '#FFFFFF',
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
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Ver detalles
            </button>
          </div>
        </div>
      ))}
    </div>
  </Section>
);