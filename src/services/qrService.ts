"use client";
/**
 * QR Code Service for DevTech IT Solution
 * Ensures QR codes encode ONLY a secure verification URL and never raw PII.
 */

export const getVerificationUrl = (employeeId: string, isIntern: boolean = false): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://devtechitsolution.com';
  const route = isIntern ? 'verify-intern' : 'verify';
  return `${origin}/${route}/${encodeURIComponent(employeeId)}`;
};

export const parseVerificationIdFromUrl = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  
  // 1. Extract from URL path (e.g. https://domain.com/verify/DTS-EMP-DEV-0001 or /verify-intern/DTS-INT-0001)
  if (trimmed.includes('/verify/') || trimmed.includes('/verify-intern/')) {
    const parts = trimmed.split(/\/verify(?:-intern)?\//);
    if (parts[1]) {
      const idSegment = parts[1].split(/[?#\s]/)[0];
      if (idSegment) {
        return decodeURIComponent(idSegment).trim().toUpperCase();
      }
    }
  }

  // 2. Search for pattern matching DTS followed by digits or alphanumeric sequences (e.g. DTS-EMP-DEV-0001, DTS-INT-DEV-0001)
  const dtsMatch = trimmed.match(/DTS(?:-?[A-Z0-9]+)+/i);
  if (dtsMatch) {
    return dtsMatch[0].toUpperCase();
  }

  // 3. Search for labeled formats like "ID: EMP123" or "Employee ID: DTS001"
  const labelMatch = trimmed.match(/(?:ID|Code|Credential|Intern\s*ID|Employee\s*ID)\s*:\s*([A-Z0-9_-]+)/i);
  if (labelMatch && labelMatch[1]) {
    return labelMatch[1].toUpperCase();
  }

  // 4. Return clean string fallback
  return trimmed.toUpperCase();
};


