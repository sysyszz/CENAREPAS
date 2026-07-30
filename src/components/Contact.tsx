import { IMG_CONTACT } from '../data/landingData';
import { colors } from '../styles/colors';
import { ImageWithFallback } from './ImageWithFallback';
import { useNavigation } from '../hooks/useNavigation';
import { IconMail, IconPhone, IconPin } from './icons';

export default function Contact() {
  const { goToAdmin } = useNavigation();

  return (
    <section id="contacto" style={{ background: colors.gray, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.dark, marginBottom: 8, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
            CONTÁCTANOS
          </h2>
          <div style={{ width: 40, height: 3, background: colors.blue, borderRadius: 2, marginBottom: 36 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: <IconPhone />, text: '302-123-8060' },
              { icon: <IconMail />, text: 'ventas@arepas.com' },
              { icon: <IconPin />, text: 'Bogotá, Colombia' },
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#EEF4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={goToAdmin}
            style={{
              marginTop: 32,
              background: colors.blue,
              color: colors.white,
              border: 'none',
              cursor: 'pointer',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 400,
              transition: 'opacity 0.15s',
              fontFamily: "'Playfair Display', serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Panel Administrativo →
          </button>
        </div>

        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <ImageWithFallback src={IMG_CONTACT} alt="Plato de arepas colombianas" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
    </section>
  );
}
