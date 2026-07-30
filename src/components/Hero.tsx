import { IMG_HERO } from '../data/landingData';
import { colors } from '../styles/colors';
import { ImageWithFallback } from './ImageWithFallback';
import { useNavigation } from '../hooks/useNavigation';

export default function Hero() {
  const { goToAdmin } = useNavigation();

  return (
    <section id="inicio" style={{ background: colors.blue, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
            FÁBRICA DE
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(64px, 7vw, 92px)',
            fontStyle: 'italic',
            fontWeight: 700,
            color: colors.white,
            lineHeight: 1,
            marginBottom: 20,
          }}>
            Arepas
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.65, marginBottom: 32, maxWidth: 400 }}>
            Frescas, deliciosas y hechas con ingredientes de calidad.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: '🌿', label: '100% naturales' },
              { icon: '❤️', label: 'Hechas con amor' },
            ].map((badge, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 999,
                padding: '8px 16px',
                color: colors.white,
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}>
                <span>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>

          <button
            onClick={goToAdmin}
            style={{
              marginTop: 36,
              background: colors.white,
              color: colors.blue,
              border: 'none',
              cursor: 'pointer',
              padding: '14px 24px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              transition: 'opacity 0.15s',
              fontFamily: "'Playfair Display', serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            PEDIR AHORA
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 480, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '3px solid rgba(255,255,255,0.2)' }}>
            <ImageWithFallback src={IMG_HERO} alt="Arepas del Campo" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
