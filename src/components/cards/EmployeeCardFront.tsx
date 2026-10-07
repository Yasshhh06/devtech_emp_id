"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Employee } from '../../types';
import { getVerificationUrl } from '../../services/qrService';

interface EmployeeCardFrontProps {
  employee: Employee;
  template?: string;
  id?: string;
}

export const EmployeeCardFront: React.FC<EmployeeCardFrontProps> = ({
  employee,
  id = 'card-front',
}) => {
  const verificationUrl = getVerificationUrl(employee.employeeId);

  // Format Date of Joining with explicit spaces: "01 May 2023"
  const rawDOJ = employee.dateOfJoining || '01 May 2023';
  const formattedDOJ = rawDOJ
    .replace(/(\d{2})([A-Za-z]+)(\d{4})/, '$1 $2 $3')
    .replace(/-/g, ' ');

  const designationText = employee.designation || 'Software Developer';
  const validityText = employee.validTill || '30 Apr 2028';

  return (
    <div
      id={id}
      style={{
        width: '340px',
        height: '570px',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        fontFamily: 'Arial, Helvetica, sans-serif',
        borderRadius: '24px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: '1px solid #CBD5E1',
      }}
      className="shadow-2xl select-none"
    >
      {/* Clean Background Template Image Provided by User */}
      <img
        src="/card-bg.jpg"
        alt="Card Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '340px',
          height: '570px',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Circular Photo Frame - EXPLICIT LEFT OFFSET (90px) NO TRANSFORMATION SHIFT */}
      <div
        style={{
          position: 'absolute',
          top: '115px',
          left: '90px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '4px solid #0284C7',
          backgroundColor: '#F8FAFC',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        <img
          src={employee.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
          alt={employee.fullName}
          style={{
            width: '152px',
            height: '152px',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
          }}
        />
      </div>

      {/* Employee Name & Designation */}
      <div
        style={{
          position: 'absolute',
          top: '292px',
          left: 0,
          width: '340px',
          textAlign: 'center',
          zIndex: 10,
          padding: '0 12px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0284C7',
            letterSpacing: '0.2px',
            lineHeight: '1.25',
          }}
        >
          {employee.fullName}
        </div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1E293B',
            marginTop: '4px',
            lineHeight: '1.25',
          }}
        >
          {designationText}
        </div>
      </div>

      {/* Details List (Spaced Format for Perfect HTML2Canvas Export) */}
      <div
        style={{
          position: 'absolute',
          top: '360px',
          left: '30px',
          width: '235px',
          zIndex: 10,
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#1E293B',
        }}
      >
        {/* Employee ID */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: '#334155', width: '92px', flexShrink: 0 }}>
            Employee ID
          </span>
          <span style={{ fontWeight: 700, color: '#1E293B', marginRight: '8px' }}>:</span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
            {employee.employeeId}
          </span>
        </div>

        {/* Department */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span style={{ fontWeight: 600, color: '#334155', width: '92px', flexShrink: 0 }}>
            Department
          </span>
          <span style={{ fontWeight: 700, color: '#1E293B', marginRight: '8px' }}>:</span>
          <span style={{ fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {employee.department}
          </span>
        </div>

        {/* DOJ */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span style={{ fontWeight: 600, color: '#334155', width: '92px', flexShrink: 0 }}>
            DOJ
          </span>
          <span style={{ fontWeight: 700, color: '#1E293B', marginRight: '8px' }}>:</span>
          <span style={{ fontWeight: 800, color: '#0F172A' }}>
            {formattedDOJ}
          </span>
        </div>

        {/* Validity Till */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span style={{ fontWeight: 600, color: '#334155', width: '92px', flexShrink: 0 }}>
            Validity Till
          </span>
          <span style={{ fontWeight: 700, color: '#1E293B', marginRight: '8px' }}>:</span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: validityText.length > 12 ? '10.5px' : '12px' }}>
            {validityText}
          </span>
        </div>
      </div>

      {/* QR Code Container (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '35px',
          right: '18px',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
          border: '1px solid #E2E8F0',
          zIndex: 20,
        }}
      >
        <QRCodeSVG value={verificationUrl} size={64} level="H" includeMargin={false} />
      </div>
    </div>
  );
};
