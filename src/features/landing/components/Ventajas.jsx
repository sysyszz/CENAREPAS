// components/Ventajas.jsx
import { Section } from './Section';
import { IconCheck } from './IconCheck';

const VENTAJAS = [
  'Ingredientes 100% naturales',
  'Sin preservantes',
  'Pedido por cantidades',
  'Atención personalizada',
];

const PROCESO = [
  { icon: '🌽', label: 'Seleccionamos\nmejores\ningredientes' },
  { icon: '👐', label: 'Preparación\ncuidadosa' },
  { icon: '🔥', label: 'Cocción\nperfecta' },
  { icon: '📦', label: 'Entrega rápida\ny segura' },
];

export const Ventajas = () => (
  <Section id="ventajas">
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr',
      gap: 80,
      alignItems: 'start'
    }}>
      {/* Por qué elegirnos */}
      <div>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#1A5CDB',
          marginBottom: 8,
          letterSpacing: '0.03em',
          fontFamily: "'Playfair Display', serif"
        }}>
          ¿POR QUÉ ELEGIRNOS?
        </h2>
        <div style={{
          width: 40,
          height: 3,
          background: '#1A5CDB',
          borderRadius: 2,
          marginBottom: 28
        }} />
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {VENTAJAS.map((v, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                <IconCheck />
              </div>
              <span style={{ fontSize: 14, color: '#374151' }}>{v}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Proceso */}
      <div>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: 8,
          letterSpacing: '0.03em',
          fontFamily: "'Playfair Display', serif"
        }}>
          NUESTRO PROCESO
        </h2>
        <div style={{
          width: 40,
          height: 3,
          background: '#E5E7EB',
          borderRadius: 2,
          marginBottom: 28
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          {PROCESO.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#1A5CDB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  marginBottom: 10,
                  boxShadow: '0 4px 12px rgba(26,92,219,0.3)',
                }}>
                  {step.icon}
                </div>
                <p style={{
                  fontSize: 11,
                  color: '#374151',
                  textAlign: 'center',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                  margin: 0
                }}>
                  {step.label}
                </p>
              </div>
              {i < PROCESO.length - 1 && (
                <svg style={{ marginTop: 20, flexShrink: 0, color: '#E5E7EB' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);