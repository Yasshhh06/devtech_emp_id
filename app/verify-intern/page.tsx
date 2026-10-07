"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyInternRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/verify');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-extrabold text-[#6B7280] tracking-wider uppercase">Redirecting to Verification Portal...</span>
      </div>
    </div>
  );
}
