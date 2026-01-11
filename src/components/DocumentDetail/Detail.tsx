import React from "react";
import type { DocumentInfor } from "../../interfaces/Types";
export const Detail: React.FC<{ docInfor: DocumentInfor | null }> = ({
  docInfor,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Title & Info Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {docInfor?.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-200"
                src={docInfor?.avatarUrl}
              />
              <span className="font-semibold text-gray-900">
                {docInfor?.fullName}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              <span>{docInfor?.viewCount} lượt xem</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <span>Đăng ngày {docInfor?.createdAt.substring(0, 10)}</span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-full transition-all text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">
                thumb_up
              </span>
              <span>{docInfor?.likeCount}</span>
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-full transition-all text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">
                thumb_down
              </span>
              <span>{docInfor?.dislikeCount}</span>
            </button>
          </div>
          <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <span className="material-symbols-outlined text-[22px]">share</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-gray-600 text-sm leading-relaxed">
          {docInfor?.description}
        </p>
      </div>
    </div>
  );
};
