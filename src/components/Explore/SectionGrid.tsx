import React from "react";
import type { UniversitySection } from "../../interfaces/UniversityTypes";

// Color palette for section folder icons — cycles through these
const FOLDER_COLORS = [
  {
    icon: "text-blue-400",
    hoverBorder: "hover:border-blue-400",
    hoverBg: "hover:bg-blue-50",
    hoverText: "group-hover:text-blue-500",
  },
  {
    icon: "text-amber-400",
    hoverBorder: "hover:border-amber-400",
    hoverBg: "hover:bg-amber-50",
    hoverText: "group-hover:text-amber-500",
  },
  {
    icon: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400",
    hoverBg: "hover:bg-emerald-50",
    hoverText: "group-hover:text-emerald-500",
  },
  {
    icon: "text-purple-400",
    hoverBorder: "hover:border-purple-400",
    hoverBg: "hover:bg-purple-50",
    hoverText: "group-hover:text-purple-500",
  },
  {
    icon: "text-rose-400",
    hoverBorder: "hover:border-rose-400",
    hoverBg: "hover:bg-rose-50",
    hoverText: "group-hover:text-rose-500",
  },
  {
    icon: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400",
    hoverBg: "hover:bg-cyan-50",
    hoverText: "group-hover:text-cyan-500",
  },
];

interface SectionGridProps {
  sections: UniversitySection[];
  loading: boolean;
  onSectionClick?: (section: UniversitySection) => void;
}

const SectionGrid: React.FC<SectionGridProps> = ({
  sections,
  loading,
  onSectionClick,
}) => {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-[#111318] mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          folder_open
        </span>
        Khoa &amp; Chuyên mục
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] rounded-2xl bg-[#f1f5f9] animate-pulse"
            />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-2xl border border-dashed border-[#e5e7eb]">
          <span className="material-symbols-outlined text-5xl text-[#cbd5e1]">
            folder_off
          </span>
          <p className="text-[#64748b] text-sm font-medium">
            Chưa có khoa / bộ môn nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Section items */}
          {sections.map((section, index) => {
            const color = FOLDER_COLORS[index % FOLDER_COLORS.length];
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionClick?.(section)}
                className={`group flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-2xl border border-[#eef2f2] ${color.hoverBorder} hover:shadow-md ${color.hoverBg} transition-all duration-200 cursor-pointer`}
              >
                <span
                  className={`material-symbols-outlined text-[48px] ${color.icon} transition-transform group-hover:scale-110 duration-200`}
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  folder
                </span>
                <p
                  className={`text-sm font-bold text-center text-[#111318] ${color.hoverText} transition-colors`}
                >
                  {section.name}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SectionGrid;
