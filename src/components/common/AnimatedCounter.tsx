"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 15,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (current) => {
    return Number(current.toFixed(decimals)).toLocaleString();
  });

  useEffect(() => {
    springValue.set(value);
    setHasAnimated(true);
  }, [value, springValue]);

  return (
    <span className={`inline-flex items-center font-bold tracking-tight ${className}`}>
      {prefix && <span>{prefix}</span>}
      <motion.span>{displayValue}</motion.span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
