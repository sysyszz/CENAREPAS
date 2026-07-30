// components/Hero.jsx
import { ImageWithFallback } from './ImageWithFallback';
import { IconLeaf } from './IconLeaf';
import { IconHeart } from './IconHeart';

const IMG_HERO = 'https://images.unsplash.com/photo-1587603366933-aa6947174c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBjb3JuJTIwYnJlYWQlMjBhcmVwYXxlbnwxfHx8fDE3ODEwMjc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080';

export const Hero = () => (
  <section id="inicio" style={{ background: '#1A5CDB', padding: '80px 0' }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 60,
      alignItems: 'center'
    }}>
      {/* Left */}
      <div>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          FÁBRICA DE
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(64px, 7vw, 92px)',
          fontStyle: 'italic',
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1,
          marginBottom: 20,
        }}>
          Arepas
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: 15,
          lineHeight: 1.65,
          marginBottom: 32,
          maxWidth: 400
        }}>
          Frescas, deliciosas y hechas con ingredientes de calidad
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: <IconLeaf />, label: '100% naturales' },
            { icon: <IconHeart />, label: 'Hechas con amor' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 999,
              padding: '8px 16px',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}>
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          border: '3px solid rgba(255,255,255,0.2)'
        }}>
          <ImageWithFallback
            src={IMG_HERO}
            alt="Arepas del Campo en canasta de mimbre"
            style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </div>
  </section>
);