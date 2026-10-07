"use client";
import React from 'react';
import { Employee } from '../../types';

interface EmployeeCardBackProps {
  employee: Employee;
  template?: string;
  id?: string;
}

export const EmployeeCardBack: React.FC<EmployeeCardBackProps> = ({
  employee,
  id = 'card-back',
}) => {
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
      {/* Background Image Provided by User (Contains Logo, Geometries, and Watermark) */}
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

      {/* Main Back Content Area */}
      <div
        style={{
          position: 'absolute',
          top: '110px',
          left: '36px',
          right: '36px',
          zIndex: 10,
          fontSize: '12px',
          lineHeight: 1.5,
          color: '#1E293B',
        }}
      >
        {/* Address */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            ADDRESS
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
            {employee.city || 'Kalyan'} {employee.state || 'Maharashtra'} {employee.country || 'India'}
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            EMAIL
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
            hr@devtechitsolution.com
          </div>
        </div>

        {/* Website */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            WEBSITE
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
            www.devtechitsolution.com
          </div>
        </div>

        {/* Terms & Conditions Pill */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#6366F1',
              color: '#FFFFFF',
              padding: '6px 20px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
            }}
          >
            TERMS & CONDITIONS
          </span>
        </div>

        {/* Bullet Points */}
        <ul
          style={{
            listStyleType: 'disc',
            paddingLeft: '18px',
            margin: 0,
            fontSize: '11px',
            color: '#1E293B',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
          className="space-y-1.5"
        >
          <li>This card is the property of DevTech IT Solution Pvt. Ltd.</li>
          <li>It must be carried at all times while on company premises.</li>
          <li>This card is non-transferable.</li>
          <li>Loss or theft of this card must be reported immediately to HR.</li>
          <li>Surrender upon resignation or termination of employment.</li>
        </ul>
      </div>

      {/* Bottom Website Footer Text */}
      <div
        style={{
          position: 'absolute',
          bottom: '35px',
          left: 0,
          width: '340px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 700,
          color: '#0F172A',
          zIndex: 10,
        }}
      >
        www.devtechitsolution.com
      </div>
    </div>
  );
};
