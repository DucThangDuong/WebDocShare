import React from "react";
import type { Universities } from "../../interfaces/UniversityTypes";
import { Link } from "react-router-dom";

interface UniversityHeaderProps {
  university: Universities;
}

const UniversityHeader: React.FC<UniversityHeaderProps> = ({ university }) => {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <Link
          className="text-[#648787] hover:text-primary transition-colors"
          to="/"
        >
          Trang chủ
        </Link>
        <span className="text-[#648787] material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <Link
          className="text-[#648787] hover:text-primary transition-colors"
          to="/explore"
        >
          Các trường đại học
        </Link>
        <span className="text-[#648787] material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-[#111318] font-medium">{university.code}</span>
      </nav>

      {/* University Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eef2f2] mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Logo */}
          <div className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-white border border-[#eef2f2] p-2 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/60">
              account_balance
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111318] leading-tight mb-2">
              {university.name}
            </h1>
            <h2 className="text-[#64748b] text-sm font-medium">
              {university.code}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversityHeader;
