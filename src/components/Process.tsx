import { PROCESS } from '../data/landingData';
import { colors } from '../styles/colors';

export default function Process() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.dark, marginBottom: 8, letterSpacing: '0.03em', fontFamily: "'Playfair Display', serif" }}>
        NUESTRO PROCESO
      </h2>
      <div style={{ width: 40, height: 3, background: colors.border, borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {PROCESS.map((step, index) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: colors.blue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                marginBottom: 10,
                boxShadow: '0 4px 12px rgba(26,92,219,0.3)',
              }}>
                {step.icon}
              </div>
              <p style={{ fontSize: 11, color: '#374151', textAlign: 'center', lineHeight: 1.45, whiteSpace: 'pre-line', margin: 0 }}>
                {step.label}
              </p>
            </div>
            {index < PROCESS.length - 1 && (
              <svg style={{ marginTop: 20, flexShrink: 0, color: colors.border }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
