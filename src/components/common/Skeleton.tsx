"use client";
import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full',
  borderRadius = 'rounded-[14px]',
}) => {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`shimmer-loader ${width} ${height} ${borderRadius} border border-[#E5E7EB]/50 ${className}`}
        />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="p-4 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-3">
      <Skeleton height="h-8" width="w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 w-1/3">
            <Skeleton height="h-9" width="w-9" borderRadius="rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton height="h-3.5" width="w-3/4" />
              <Skeleton height="h-2.5" width="w-1/2" />
            </div>
          </div>
          <Skeleton height="h-6" width="w-20" borderRadius="rounded-[10px]" />
          <Skeleton height="h-6" width="w-24" borderRadius="rounded-[10px]" />
          <Skeleton height="h-8" width="w-8" borderRadius="rounded-[12px]" />
        </div>
      ))}
    </div>
  );
};
