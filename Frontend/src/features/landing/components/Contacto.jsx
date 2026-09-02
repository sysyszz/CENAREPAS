// components/Contacto.jsx
import { Section } from './Section';
import { ImageWithFallback } from './ImageWithFallback';
import { IconPhone } from './IconPhone';
import { IconMail } from './IconMail';
import { IconPin } from './IconPin';
import { useNavigateTo } from '../hooks/useNavigateTo';

const IMG_CONTACT = 'https://images.unsplash.com/photo-1644753787067-d62ae70f303d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2xvbWJpYW4lMjJjb3JuJTIwYnJlYWQlMjJhcmVwYXxlbnwxfHx8fDE3ODEwMjc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080';

export const Contacto = () => {
  const navigateToAdmin = useNavigateTo('/admin');

  return (
    <Section id="contacto" bg="#F5F5F5">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center'
      }}>
        {/* Left */}
        <div>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 8,
            letterSpacing: '0.04em',
            fontFamily: "'Playfair Display', serif"
          }}>
            CONTÁCTANOS
          </h2>
          <div style={{
            width: 40,
            height: 3,
            background: '#1A5CDB',
            borderRadius: 2,
            marginBottom: 36
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: <IconPhone />, text: '302-123-8060' },
              { icon: <IconMail />, text: 'ventas@arepas.com' },
              { icon: <IconPin />, text: 'Bogotá, Colombia' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            onClick={navigateToAdmin}
            style={{
              marginTop: 32,
              background: '#1A5CDB',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 400,
              transition: 'opacity 0.15s',
              fontFamily: "'Playfair Display', serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Panel Administrativo →
          </button>
        </div>

        {/* Right - contact image */}
        <div style={{
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}>
          <ImageWithFallback
            src={IMG_CONTACT}
            alt="Plato de arepas colombianas con huevos y carne"
            style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </Section>
  );
};