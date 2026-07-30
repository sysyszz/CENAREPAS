import { NAV } from '../data/landingData';
import { colors } from '../styles/colors';
import { useNavigation } from '../hooks/useNavigation';

export default function Navbar() {
  const { scrollTo, goToAdmin } = useNavigation();

  return (
    <header style={{
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #EF6C00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
          }}>
            🫓
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: colors.blue, fontFamily: "'Playfair Display', serif" }}>
              AREPAS DEL CAMPO
            </div>
            <div style={{ fontWeight: 400, fontSize: 9, letterSpacing: '0.18em', color: colors.mid, textTransform: 'uppercase', marginTop: 1, fontFamily: "'Playfair Display', serif" }}>
              Fábrica de Arepas
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: colors.dark,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
                fontFamily: "'Playfair Display', serif",
              }}
              onClick={(event) => {
                event.preventDefault();
                scrollTo(item.toLowerCase());
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <button
          onClick={goToAdmin}
          style={{
            background: colors.blue,
            color: colors.white,
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
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          PEDIR AHORA →
        </button>
      </div>
    </header>
  );
}
