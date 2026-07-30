import { ABOUT_CARDS } from '../data/landingData';
import { colors } from '../styles/colors';

export default function About() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
      <div>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, color: colors.blue, marginBottom: 48, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
          ¿QUIÉNES SOMOS?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>
          Somos una fábrica dedicada a la producción de arepas de alta calidad.
          Trabajamos con ingredientes frescos y procesos tradicionales para garantizar
          el mejor sabor en cada arepa que llega a tu mesa. Nuestro compromiso es llevar
          a tu hogar un producto artesanal, nutritivo y delicioso, elaborado con el
          cariño de siempre.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {ABOUT_CARDS.map((card) => (
          <div key={card.title} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            padding: '20px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            textAlign: 'center',
            background: colors.white,
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
              {card.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: colors.dark }}>{card.title}</div>
              <div style={{ fontSize: 12, color: colors.mid }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
