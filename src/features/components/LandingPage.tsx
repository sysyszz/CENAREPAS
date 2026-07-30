import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ── Color tokens ────────────────────────────────────────────────────────
const C = {
  blue:    '#1A5CDB',
  white:   '#FFFFFF',
  gray:    '#F5F5F5',
  dark:    '#1A1A1A',
  mid:     '#6B7280',
  border:  '#E5E7EB',
};

// ── Images — product/packaging style ───────────────────────────────────
// Hero: arepas stacked, product-style shot
const IMG_HERO    = 'https://images.unsplash.com/photo-1587603366933-aa6947174c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBjb3JuJTIwYnJlYWQlMjBhcmVwYXxlbnwxfHx8fDE3ODEwMjc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080';
// Contact: arepas on neutral background
const IMG_CONTACT = 'https://images.unsplash.com/photo-1644753787067-d62ae70f303d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2xvbWJpYW4lMjJjb3JuJTIwYnJlYWQlMjJhcmVwYXxlbnwxfHx8fDE3ODEwMjc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080';
// Product cards: overhead/product-style arepa photos
const IMG_P1      = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmVwYSUyMGNvcm4lMjBicmVhZCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3ODEwMjk2NjV8MA&ixlib=rb-4.1.0&q=80&w=600';
const IMG_P2      = 'https://images.unsplash.com/photo-1710018349908-39d998a519b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmbGF0YnJlYWQlMjJwaXRhJTIwYnJlYWQlMjJwYWNrYWdlJTIwcGxhc3RpYyUyMHdyYXAlMjJzdGFja2VkfGVufDF8fHx8MTc4MTAyOTY2Nnww&ixlib=rb-4.1.0&q=80&w=600';
const IMG_P3      = 'https://images.unsplash.com/photo-1625605927823-7f10eaab7927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmbGF0YnJlYWQlMjJwaXRhJTIwYnJlYWQlMjJwYWNrYWdlJTIwcGxhc3RpYyUyMHdyYXAlMjJzdGFja2VkfGVufDF8fHx8MTc4MTAyOTY2Nnww&ixlib=rb-4.1.0&q=80&w=600';
const IMG_P4      = 'https://images.unsplash.com/photo-1644753787071-8933b5daed2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmVwYSUyMGFtYXJpbGxhJTIwbWFpeiUyMGNvbG9tYmlhbmElMjBwbGF0b3xlbnwxfHx8fDE3ODEwMjg2MzZ8MA&ixlib=rb-4.1.0&q=80&w=600';

// ── Data ─────────────────────────────────────────────────────────────────
const NAV = ['Inicio', 'Nosotros', 'Productos', 'Ventajas', 'Contacto'];

const PRODUCTS = [
  { id: 1, badge: 'x1',  name: 'Arepa Amarilla',              desc: 'Hecha con maíz amarillo seleccionado. Suave, fresca y deliciosa.',      price: '$1.200', img: IMG_P1 },
  { id: 2, badge: 'x5',  name: 'Paquete de Arepas x5',        desc: '5 arepas frescas perfectas para compartir en familia.',                 price: '$5.000', img: IMG_P2 },
  { id: 3, badge: 'x10', name: 'Paquete de Arepas x10',       desc: '10 arepas frescas ideales para toda la semana.',                        price: '$9.000', img: IMG_P3 },
  { id: 4, badge: 'x5',  name: 'Paquete de Arepas Amarillas x5', desc: '5 arepas amarillas artesanales llenas de sabor y tradición.',        price: '$6.000', img: IMG_P4 },
];

const VENTAJAS = [
  'Ingredientes 100% naturales',
  'Sin preservantes',
  'Pedido por cantidades',
  'Atención personalizada',
];

const PROCESO = [
  { icon: '🌽', label: 'Seleccionamos\nmejores\ningredientes' },
  { icon: '👐', label: 'Preparación\ncuidadosa'              },
  { icon: '🔥', label: 'Cocción\nperfecta'                   },
  { icon: '📦', label: 'Entrega rápida\ny segura'            },
];

// ── Tiny SVG icons ───────────────────────────────────────────────────────
const IconLeaf = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 014 13c0-4 2-8 7-9 5 1 7 5 7 9a7 7 0 01-7 7z"/><path d="M11 20V7"/>
  </svg>
);
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ── Section wrapper ──────────────────────────────────────────────────────
const Section = ({ id, bg = C.white, children }: { id?: string; bg?: string; children: React.ReactNode }) => (
  <section id={id} style={{ background: bg, padding: '80px 0' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
      {children}
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.dark, background: C.white }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <header style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #EF6C00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0, boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
            }}>🫓</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: C.blue, fontFamily: "'Playfair Display', serif" }}>AREPAS DEL CAMPO</div>
              <div style={{ fontWeight: 400, fontSize: 9, letterSpacing: '0.18em', color: C.mid, textTransform: 'uppercase', marginTop: 1, fontFamily: "'Playfair Display', serif" }}>Fábrica de Arepas</div>
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ fontSize: 13, fontWeight: 400, color: C.dark, textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.15s', fontFamily: "'Playfair Display', serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dark)}>
                {l}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button onClick={() => navigate('/admin')} style={{
            background: C.blue, color: C.white, border: 'none', cursor: 'pointer',
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 400,
            letterSpacing: '0.04em', flexShrink: 0, transition: 'opacity 0.15s',
            fontFamily: "'Playfair Display', serif",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            PEDIR AHORA →
          </button>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════ */}
      <section id="inicio" style={{ background: C.blue, padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
              FÁBRICA DE
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(64px, 7vw, 92px)', fontStyle: 'italic', fontWeight: 700,
              color: C.white, lineHeight: 1, marginBottom: 20,
            }}>
              Arepas
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.65, marginBottom: 32, maxWidth: 400 }}>
              Frescas, deliciosas y hechas con ingredientes de calidad
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { icon: <IconLeaf />, label: '100% naturales' },
                { icon: <IconHeart />, label: 'Hechas con amor' },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.18)', borderRadius: 999,
                  padding: '8px 16px', color: C.white, fontSize: 13, fontWeight: 600,
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
            <div style={{ width: '100%', maxWidth: 480, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '3px solid rgba(255,255,255,0.2)' }}>
              <ImageWithFallback
                src={IMG_HERO}
                alt="Arepas del Campo en canasta de mimbre"
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUIÉNES SOMOS ═══════════════════════════════════════════════ */}
      <Section id="nosotros">
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, color: C.blue, marginBottom: 48, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
          ¿QUIÉNES SOMOS?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>
            Somos una fábrica dedicada a la producción de arepas de alta calidad.
            Trabajamos con ingredientes frescos y procesos tradicionales para garantizar
            el mejor sabor en cada arepa que llega a tu mesa. Nuestro compromiso es llevar
            a tu hogar un producto artesanal, nutritivo y delicioso, elaborado con el
            cariño de siempre.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '🏭', title: 'Producción',  sub: 'diaria'       },
              { icon: '🏆', title: 'Calidad',     sub: 'garantizada'  },
              { icon: '🚚', title: 'Entrega',     sub: 'rápida'       },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: '20px 12px', border: `1px solid ${C.border}`, borderRadius: 16,
                textAlign: 'center', background: C.white,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', background: '#EEF4FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.mid }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══ NUESTROS PRODUCTOS ══════════════════════════════════════════ */}
      <Section id="productos" bg={C.gray}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, color: C.dark, marginBottom: 48, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
          NUESTROS PRODUCTOS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{
              background: C.white, borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column',
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
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: '50%',
                  background: C.blue, color: C.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, boxShadow: '0 2px 8px rgba(26,92,219,0.4)',
                }}>
                  {p.badge}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 16px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.6, flex: 1, marginBottom: 14, fontWeight: 400 }}>{p.desc}</div>
                <div style={{ fontWeight: 400, fontSize: 22, color: C.blue, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>{p.price}</div>
                <button style={{
                  background: C.blue, color: C.white, border: 'none', cursor: 'pointer',
                  width: '100%', padding: '10px 0', borderRadius: 8,
                  fontSize: 13, fontWeight: 400, transition: 'opacity 0.15s',
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

      {/* ══ VENTAJAS + PROCESO ══════════════════════════════════════════ */}
      <Section id="ventajas">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>

          {/* Por qué elegirnos */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.blue, marginBottom: 8, letterSpacing: '0.03em', fontFamily: "'Playfair Display', serif" }}>
              ¿POR QUÉ ELEGIRNOS?
            </h2>
            <div style={{ width: 40, height: 3, background: C.blue, borderRadius: 2, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {VENTAJAS.map((v, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#EEF4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <IconCheck />
                  </div>
                  <span style={{ fontSize: 14, color: '#374151' }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Proceso */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.dark, marginBottom: 8, letterSpacing: '0.03em', fontFamily: "'Playfair Display', serif" }}>
              NUESTRO PROCESO
            </h2>
            <div style={{ width: 40, height: 3, background: C.border, borderRadius: 2, marginBottom: 28 }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {PROCESO.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', background: C.blue,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, marginBottom: 10, boxShadow: '0 4px 12px rgba(26,92,219,0.3)',
                    }}>
                      {step.icon}
                    </div>
                    <p style={{ fontSize: 11, color: '#374151', textAlign: 'center', lineHeight: 1.45, whiteSpace: 'pre-line', margin: 0 }}>
                      {step.label}
                    </p>
                  </div>
                  {i < PROCESO.length - 1 && (
                    <svg style={{ marginTop: 20, flexShrink: 0, color: C.border }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ══ CONTÁCTANOS ═════════════════════════════════════════════════ */}
      <Section id="contacto" bg={C.gray}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: C.dark, marginBottom: 8, letterSpacing: '0.04em', fontFamily: "'Playfair Display', serif" }}>
              CONTÁCTANOS
            </h2>
            <div style={{ width: 40, height: 3, background: C.blue, borderRadius: 2, marginBottom: 36 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: <IconPhone />, text: '302-123-8060'               },
                { icon: <IconMail />,  text: 'ventas@arepas.com'          },
                { icon: <IconPin />,   text: 'Bogotá, Colombia'           },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: '#EEF4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/admin')} style={{
              marginTop: 32, background: C.blue, color: C.white, border: 'none', cursor: 'pointer',
              padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 400, transition: 'opacity 0.15s',
              fontFamily: "'Playfair Display', serif",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Panel Administrativo →
            </button>
          </div>

          {/* Right — contact image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <ImageWithFallback
              src={IMG_CONTACT}
              alt="Plato de arepas colombianas con huevos y carne"
              style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </Section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer style={{ background: C.blue, padding: '16px 40px', textAlign: 'center' }}>
        <p style={{ color: C.white, fontSize: 12, margin: 0, fontWeight: 500 }}>
          © 2024 Arepas del Campo
        </p>
      </footer>
    </div>
  );
}
