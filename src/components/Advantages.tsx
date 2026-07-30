import { ADVANTAGES } from '../data/landingData';
import { colors } from '../styles/colors';

export default function Advantages() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.blue, marginBottom: 8, letterSpacing: '0.03em', fontFamily: "'Playfair Display', serif" }}>
          ¿POR QUÉ ELEGIRNOS?
        </h2>
        <div style={{ width: 40, height: 3, background: colors.blue, borderRadius: 2, marginBottom: 28 }} />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ADVANTAGES.map((item) => (
            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#EEF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                ✓
              </div>
              <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
