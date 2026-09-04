import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  className?: string;
  containerClassName?: string;
  isGrayscale?: boolean;
  onClick?: () => void;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}

/**
 * Returns an optimized image URL using wsrv.nl image CDN for resizing, WebP conversion, and Cloudflare caching.
 * Falls back to original URL for non-external or already optimized assets.
 */
export function getOptimizedImageUrl(url: string, width = 640, quality = 80): string {
  if (!url) return '';
  if (
    url.startsWith('https://raw.githubusercontent.com/') ||
    url.startsWith('https://images.unsplash.com/')
  ) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;
  }
  return url;
}

export default function OptimizedImage({
  src,
  alt,
  width = 640,
  quality = 80,
  className = '',
  containerClassName = '',
  isGrayscale = false,
  onClick,
  priority = false,
  fit = 'cover',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, width, quality);
  const displaySrc = hasError ? src : optimizedSrc;

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${
        fit === 'contain' ? 'bg-transparent' : 'bg-[#0c0a07]'
      } ${containerClassName}`}
    >
      {/* 1. Shimmer Skeleton Loading Placeholder */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border border-amber-500/20 border-t-amber-400/80 animate-spin" />
        </div>
      </div>

      {/* 2. Optimized Image with Blur-Up Transition */}
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        className={`transition-all duration-700 ease-out ${
          fit === 'contain'
            ? 'max-w-full max-h-full w-auto h-auto object-contain'
            : 'w-full h-full object-cover'
        } ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
        } ${isGrayscale ? 'grayscale contrast-125' : ''} ${className}`}
      />
    </div>
  );
}
