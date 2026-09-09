import React from 'react';

/**
 * Divisores y transiciones orgánicas entre secciones de la Landing.
 *
 * Elimina completamente bandas intermedias de color (grises o saturaciones fuera de paleta)
 * mediante dos técnicas limpias:
 * 1. Formas orgánicas SVG (ondas / curvas suaves) del color exacto de la sección adyacente.
 * 2. Degradados lineales limpios de 2 paradas estrictamente dentro de la misma familia cromática.
 */
export function SectionDivider({
  type = 'wave', // 'wave' | 'gradient'
  variant = '1', // '1' | '2' | '3' | '4'
  fill = 'var(--landing-cine)',
  gradientColors, // [from, to]
  height = 'h-14 sm:h-20 md:h-24 lg:h-28',
  position = 'top', // 'top' | 'bottom'
  flipX = false,
  className = '',
}) {
  if (type === 'gradient' && gradientColors && gradientColors.length === 2) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 ${
          position === 'top' ? 'top-0' : 'bottom-0'
        } ${height} ${className}`}
        style={{
          backgroundImage: `linear-gradient(to ${
            position === 'top' ? 'bottom' : 'top'
          }, ${gradientColors[0]}, ${gradientColors[1]})`,
        }}
      />
    );
  }

  // Paths de ondas orgánicas ancladas en la parte superior (y=0 recta, parte inferior curva)
  const paths = {
    '1': 'M0,0 L1440,0 L1440,25 C1180,85 860,10 520,70 C280,100 120,40 0,25 Z',
    '2': 'M0,0 L1440,0 L1440,40 C1220,15 940,80 620,25 C340,-15 140,60 0,35 Z',
    '3': 'M0,0 L1440,0 L1440,30 C1080,75 720,10 360,65 C180,85 60,40 0,25 Z',
    '4': 'M0,0 L1440,0 L1440,20 C1140,65 820,15 460,55 C220,75 80,30 0,20 Z',
  };

  const pathData = paths[variant] || paths['1'];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${height} overflow-hidden leading-none z-0 ${className}`}
      style={{
        transform: `${position === 'bottom' ? 'rotate(180deg) ' : ''}${
          flipX ? 'scaleX(-1)' : ''
        }`,
      }}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="w-full h-full block"
        style={{ color: fill }}
      >
        <path d={pathData} fill="currentColor" />
      </svg>
    </div>
  );
}
