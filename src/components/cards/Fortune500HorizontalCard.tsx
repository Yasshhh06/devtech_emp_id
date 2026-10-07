"use client";
import React from 'react';
import { Building2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import devtechLogo from '../../assets/devtech-logo.png';

interface Fortune500HorizontalCardProps {
  employee: {
    employeeId?: string;
    fullName?: string;
    designation?: string;
    department?: string;
    photo?: string;
    bloodGroup?: string;
    companyEmail?: string;
    email?: string;
    phone?: string;
    emergencyContact?: string;
    validTill?: string;
    gender?: string;
    employmentType?: string;
    dateOfJoining?: string;
    joiningDate?: string;
    status?: string;
  };
  isBack?: boolean;
  id?: string;
}

export const Fortune500HorizontalCard: React.FC<Fortune500HorizontalCardProps> = ({
  employee,
  isBack = false,
  id
}) => {
  const empId = employee.employeeId || 'DTS-SDE-0001';
  const name = employee.fullName || 'Authorized Personnel';
  const role = employee.designation || 'Specialist';
  const dept = employee.department || 'Operations';
  const img = employee.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const joining = employee.dateOfJoining || employee.joiningDate || 'Jan 2026';
  const status = employee.status || 'Active';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://devtechitsolution.com';
  const verificationUrl = `${origin}/verify/${encodeURIComponent(empId)}`;

  if (isBack) {
    return (
      <div
        id={id}
        className="w-[450px] h-[284px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-saas relative overflow-hidden flex flex-col justify-between select-none font-sans p-6 text-[#111827]"
        style={{ width: '450px', height: '284px', minWidth: '450px', minHeight: '284px' }}
      >
        <div className="absolute top-3.5 left-0 right-0 h-9 bg-[#111827] flex items-center justify-between px-6 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase opacity-95">
          <span>DEVTECH IT SOLUTION PVT. LTD.</span>
          <span>AUTHORIZED ACCESS CREDENTIAL</span>
        </div>

        <div className="mt-11 flex-1 flex flex-col justify-between">
          {/* Company Title & Contact Details */}
          <div className="p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
            <h3 className="text-[11px] font-black tracking-wide text-[#111827] uppercase border-b border-[#E5E7EB]/80 pb-1 mb-1.5 flex items-center justify-between">
              <span>DEVTECH IT SOLUTION PVT. LTD.</span>
              <span className="text-[8px] font-bold text-[#6B7280]">HQ CONTACT</span>
            </h3>
            <div className="flex items-center justify-between gap-2 text-left">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#6B7280] block uppercase text-[8px] tracking-wider mb-0.5">Email</span>
                <span className="font-extrabold text-[#2563EB] text-[11px] select-all block font-mono">
                  hr@devtechitsolution.com
                </span>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <span className="font-bold text-[#6B7280] block uppercase text-[8px] tracking-wider mb-0.5">Website</span>
                <span className="font-extrabold text-[#111827] text-[11px] select-all block font-mono">
                  www.devtechitsolution.com
                </span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="my-auto py-1 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#111827]">
                TERMS &amp; CONDITIONS
              </span>
              <span className="text-[8px] font-extrabold text-[#2563EB] bg-[#DBEAFE] px-2 py-0.5 rounded-full uppercase">
                Strict Compliance
              </span>
            </div>
            <ul className="text-[8.5px] text-[#475569] font-semibold space-y-0.5 leading-tight pl-3 list-disc marker:text-[#2563EB]">
              <li>This card is the property of DevTech IT Solution Pvt. Ltd.</li>
              <li>It must be carried at all times while on company premises.</li>
              <li>This card is non-transferable.</li>
              <li>Loss or theft of this card must be reported immediately to HR.</li>
              <li>Surrender upon resignation or termination of employment.</li>
            </ul>
          </div>

          {/* Bottom security assurance footer */}
          <div className="pt-1.5 border-t border-[#E5E7EB] flex items-center justify-end text-[8.5px] font-extrabold shrink-0">
            <span className="font-mono text-[#94A3B8] shrink-0">{empId} • DUPLEX-B</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="w-[450px] h-[284px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-saas relative overflow-hidden flex flex-col justify-between select-none font-sans text-[#111827]"
      style={{ width: '450px', height: '284px', minWidth: '450px', minHeight: '284px' }}
    >
      <div className="h-2 w-full bg-[#2563EB]"></div>

      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#E5E7EB]/80 pb-2">
          <div className="flex items-center -my-2 -ml-2">
            <img src={devtechLogo.src} alt="DevTech IT Solution Pvt Ltd" className="h-[58px] w-auto max-w-[300px] object-contain object-left" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-[10px] font-black flex items-center gap-1 uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> {status}
          </span>
        </div>

        <div className="my-auto py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                src={img}
                alt={name}
                className="w-24 h-24 rounded-[14px] object-cover border border-[#E5E7EB] shadow-xs"
                crossOrigin="anonymous"
              />
            </div>

            <div className="min-w-0 pr-1">
              <p className="text-[11px] font-mono font-extrabold text-[#2563EB] mb-0.5 tracking-wider">
                {empId}
              </p>
              <h2 className="text-lg font-black text-[#111827] tracking-tight leading-tight truncate">
                {name}
              </h2>
              <p className="text-xs font-extrabold text-[#111827] mt-1 truncate">
                {role}
              </p>
              <p className="text-[11px] font-semibold text-[#6B7280] truncate mt-0.5">
                {dept} Division
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs shrink-0 flex flex-col items-center justify-center">
            <QRCodeSVG value={verificationUrl} size={72} fgColor="#111827" bgColor="transparent" level="M" />
            <span className="text-[8px] font-mono font-extrabold text-[#2563EB] tracking-wider uppercase mt-1">
              Scan Verify
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-[#E5E7EB]/80 flex items-center justify-between text-[10px] text-[#6B7280] font-bold">
          <span>Issued: {joining}</span>
        </div>

      </div>
    </div>
  );
};

