// components/Navbar.jsx
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';
import { useNavigateTo } from '../hooks/useNavigateTo';

const NAV = ['Inicio', 'Nosotros', 'Productos', 'Ventajas', 'Contacto'];

export const Navbar = () => {
  const { nombreProyecto, logoUrl } = useConfiguracion();
  const navigateToAdmin = useNavigateTo('/admin');

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 40px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <img
            src={logoUrl}
            alt={nombreProyecto}
            style={{
              width: 46,
              height: 46,
              objectFit: 'contain',
              flexShrink: 0,
              display: 'block',
            }}
          />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.12em',
              color: '#1A5CDB',
              fontFamily: "'Playfair Display', serif"
            }}>
              {nombreProyecto}
            </div>
            <div style={{
              fontWeight: 400,
              fontSize: 9,
              letterSpacing: '0.18em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginTop: 1,
              fontFamily: "'Playfair Display', serif"
            }}>
              Fábrica de Arepas
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {NAV.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: '#1A1A1A',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
                fontFamily: "'Playfair Display', serif"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A5CDB')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1A1A1A')}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={navigateToAdmin}
          style={{
            background: '#1A5CDB',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: '0.04em',
            flexShrink: 0,
            transition: 'opacity 0.15s',
            fontFamily: "'Playfair Display', serif",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          PEDIR AHORA →
        </button>
      </div>
    </header>
  );
};
