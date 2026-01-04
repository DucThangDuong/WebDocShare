import React from 'react';

interface StatsCardProps {
  title: string;
  icon: string;
  iconColorClass: string; 
  value: string;
  subValue?: string; 
  description?: string;
  progress?: number; 
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, icon, iconColorClass, value, subValue, description, progress 
}) => {
  return (
    <div className="p-5 rounded-xl border border-[#dbdfe6] bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[#616f89] text-sm font-medium">{title}</span>
        <span className={`material-symbols-outlined p-1.5 rounded-lg text-[20px] ${iconColorClass}`}>
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-black">
        {value} {subValue && <span className="text-sm text-[#616f89] font-normal">/{subValue}</span>}
      </div>
      {description && <p className="text-xs text-[#616f89]">{description}</p>}
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};