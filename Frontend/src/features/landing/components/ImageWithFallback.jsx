// components/ImageWithFallback.jsx
import { useState } from 'react';

export const ImageWithFallback = ({ src, alt, style, fallbackSrc = '/placeholder-image.jpg' }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      onError={handleError}
    />
  );
};