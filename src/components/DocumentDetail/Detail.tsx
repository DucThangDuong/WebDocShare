import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DocumentInfor } from "../../interfaces/DocumentTypes";
import { apiClient } from "../../utils/apiClient";
import { useStore } from "../../zustand/store";
import toast from "react-hot-toast";

export const Detail: React.FC<{ docInfor: DocumentInfor | null }> = ({
  docInfor,
}) => {
  const navigate = useNavigate();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [voteState, setVoteState] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { user } = useStore();
  useEffect(() => {
    if (docInfor) {
      const updateState = () => {
        setVoteState(docInfor.isLiked ?? null);
        setLikeCount(docInfor.likeCount ?? 0);
        setDislikeCount(docInfor.dislikeCount ?? 0);
        setIsSaved(docInfor.isSaved ?? false);
      };
      updateState();
    }
  }, [docInfor]);

  const { isLogin } = useStore();
  const handleVote = (action: boolean) => {
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để tham gia vào cuộc thảo luận");
      return;
    }

    let nextVoteState: boolean | null = voteState;
    let nextLikeCount = likeCount;
    let nextDislikeCount = dislikeCount;
    if (action === true) {
      if (voteState === true) {
        nextVoteState = null;
        nextLikeCount--;
      } else if (voteState === false) {
        nextVoteState = true;
        nextDislikeCount--;
        nextLikeCount++;
      } else {
        nextVoteState = true;
        nextLikeCount++;
      }
    } else {
      if (voteState === false) {
        nextVoteState = null;
        nextDislikeCount--;
      } else if (voteState === true) {
        nextVoteState = false;
        nextLikeCount--;
        nextDislikeCount++;
      } else {
        nextVoteState = false;
        nextDislikeCount++;
      }
    }

    setVoteState(nextVoteState);
    setLikeCount(nextLikeCount);
    setDislikeCount(nextDislikeCount);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        await apiClient.post(`user-activity/vote/${docInfor?.id}`, {
          isLike: nextVoteState,
        });
      } catch {
        setVoteState(voteState);
        setLikeCount(likeCount);
        setDislikeCount(dislikeCount);
      }
    }, 1000);
  };

  const handleSave = async () => {
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để lưu tài liệu");
      return;
    }
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      await apiClient.post(`user-activity/save/${docInfor?.id}`);
      toast.success(nextSaved ? "Đã lưu tài liệu" : "Đã bỏ lưu tài liệu");
    } catch {
      setIsSaved(isSaved);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  if (!docInfor) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">{docInfor.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div
              className="flex items-center gap-2 cursor-pointer group/user hover:opacity-80 transition-opacity"
              onClick={() => {
                if (docInfor.uploaderId) {
                  navigate(`/users/${docInfor.uploaderId}`);
                }
              }}
            >
              <img
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-200 object-cover group-hover/user:ring-2 group-hover/user:ring-primary/30 transition-all"
                src={`${docInfor.avatarUrl}`}
              />
              <span className="font-semibold text-gray-900 group-hover/user:text-primary transition-colors">
                {docInfor.fullName || "Người dùng"}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              <span>{docInfor.viewCount ?? 0} lượt xem</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <span>
              Đăng ngày{" "}
              {docInfor.createdAt ? docInfor.createdAt.substring(0, 10) : ""}
            </span>
          </div>
        </div>

        {/* Buttons Vote */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleVote(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${voteState === true
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${voteState === true ? "fill" : ""}`}
              >
                thumb_up
              </span>
              <span className="font-semibold">{likeCount}</span>
            </button>

            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            {/* DISLIKE BUTTON */}
            <button
              onClick={() => handleVote(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${voteState === false
                ? "text-red-500 bg-red-50"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${voteState === false ? "fill" : ""}`}
              >
                thumb_down
              </span>
            </button>
          </div>
          {docInfor.uploaderId !== user?.id && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`p-2.5 rounded-full transition-colors ${isSaved
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100 text-gray-500"
                  }`}
                title={isSaved ? "Bỏ lưu" : "Lưu tài liệu"}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${isSaved ? "fill" : ""}`}
                >
                  bookmark
                </span>
              </button>

              <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {docInfor.tags?.map((tag) => (
          <span key={tag} className="text-gray-500 text-sm cursor-pointer hover:text-primary">
            {"#" + tag + " "}
          </span>
        ))}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed">
            {docInfor.description}
          </p>
        </div>
      </div>
    </div>
  );
};
