// components/Nosotros.jsx
import { Section } from './Section';

export const Nosotros = () => (
  <Section id="nosotros">
    <h2 style={{
      textAlign: 'center',
      fontSize: 32,
      fontWeight: 700,
      color: '#1A5CDB',
      marginBottom: 48,
      letterSpacing: '0.04em',
      fontFamily: "'Playfair Display', serif"
    }}>
      ¿QUIÉNES SOMOS?
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 60,
      alignItems: 'start'
    }}>
      <p style={{
        fontSize: 15,
        lineHeight: 1.8,
        color: '#374151'
      }}>
        Somos una fábrica dedicada a la producción de arepas de alta calidad.
        Trabajamos con ingredientes frescos y procesos tradicionales para garantizar
        el mejor sabor en cada arepa que llega a tu mesa. Nuestro compromiso es llevar
        a tu hogar un producto artesanal, nutritivo y delicioso, elaborado con el
        cariño de siempre.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }}>
        {[
          { icon: '🏭', title: 'Producción', sub: 'diaria' },
          { icon: '🏆', title: 'Calidad', sub: 'garantizada' },
          { icon: '🚚', title: 'Entrega', sub: 'rápida' },
        ].map((c, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            padding: '20px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            textAlign: 'center',
            background: '#FFFFFF',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);