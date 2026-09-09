import React from 'react';
import { SectionDivider } from './SectionDivider';

/**
 * @deprecated Preferir el uso directo de SectionDivider para transiciones orgánicas o gradientes limpios.
 */
export function SectionFade({ colors, height = 'h-20 sm:h-28' }) {
  // Si se pasan colores, usamos los extremos limpios sin paradas intermedias descoloridas
  const cleanColors = colors && colors.length >= 2 
    ? [colors[0], colors[colors.length - 1]]
    : colors;

  return (
    <SectionDivider
      type="gradient"
      gradientColors={cleanColors}
      height={height}
    />
  );
}
