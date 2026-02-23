import React from "react";
import type { Universities } from "../../interfaces/UniversityTypes";

interface UniversityCardProps {
    university: Universities;
    onClick?: (university: Universities) => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
    university,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={() => onClick?.(university)}
            className="university-card group"
            id={`university-card-${university.id}`}
        >
            <div className="university-card__logo">
                <span className="material-symbols-outlined text-3xl text-[#94a3b8] group-hover:text-primary transition-colors">
                    school
                </span>
            </div>
            <div className="flex flex-col min-w-0">
                <h3 className="text-base font-bold text-[#111318] leading-tight group-hover:text-primary transition-colors truncate">
                    {university.name}
                </h3>
                <span className="text-sm font-medium text-[#64748b] mt-0.5">
                    {university.code}
                </span>
            </div>
            <span className="material-symbols-outlined text-xl text-[#cbd5e1] group-hover:text-primary ml-auto transition-colors shrink-0">
                chevron_right
            </span>
        </button>
    );
};

export default UniversityCard;
