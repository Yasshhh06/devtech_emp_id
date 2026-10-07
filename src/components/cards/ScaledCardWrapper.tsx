"use client";
import React, { useState, useEffect, useRef } from 'react';

interface ScaledCardWrapperProps {
  children: React.ReactNode;
  naturalWidth?: number;
  naturalHeight?: number;
  className?: string;
}

export const ScaledCardWrapper: React.FC<ScaledCardWrapperProps> = ({
  children,
  naturalWidth = 450,
  naturalHeight = 284,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isPrint, setIsPrint] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('print');
    const handleMediaChange = (e: MediaQueryListEvent) => setIsPrint(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    setIsPrint(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current || isPrint) return;

    const updateScale = () => {
      if (containerRef.current) {
        const currentWidth = containerRef.current.clientWidth;
        if (currentWidth > 0) {
          const newScale = Math.min(1, currentWidth / naturalWidth);
          setScale(newScale);
        }
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [naturalWidth, isPrint]);

  if (isPrint) {
    return (
      <div className={`print:w-[450px] print:h-[284px] ${className}`} style={{ width: `${naturalWidth}px`, height: `${naturalHeight}px` }}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full relative flex items-center justify-center mx-auto select-none overflow-hidden print:w-[450px] print:h-[284px] print:max-w-none print:aspect-auto ${className}`}
      style={{
        maxWidth: `${naturalWidth}px`,
        aspectRatio: `${naturalWidth} / ${naturalHeight}`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: `${naturalWidth}px`,
          height: `${naturalHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
