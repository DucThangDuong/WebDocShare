import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import { apiClient } from "../utils/apiClient";
import { DocumentItem } from "../components/MyProfile/DocumentItem";
import type { UserProfilePublic, ResUserStatsDto } from "../interfaces/UserTypes";
import type { DocumentInfor } from "../interfaces/DocumentTypes";
import { useStore } from "../zustand/store";
import toast from "react-hot-toast";

const UserPublicProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user } = useStore();

    const [userFind, setUserFind] = useState<UserProfilePublic | null>(null);
    const [stats, setStats] = useState<ResUserStatsDto | null>(null);
    const [documents, setDocuments] = useState<DocumentInfor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [userData, userStats, userDocs] = await Promise.all([
                    apiClient.get<UserProfilePublic>(`/user/${userId}/profile`),
                    apiClient.get<ResUserStatsDto>(`/user/${userId}/stats`),
                    apiClient.get<DocumentInfor[]>(`/user/${userId}/documents?skip=0&take=10`),
                ]);
                setUserFind(userData);
                setStats(userStats);
                setDocuments(userDocs);
                setIsFollowing(userData.isFollowing);
                setFollowerCount(userData.followerCount);
                if (userData.id == user?.id) {
                    navigate("/profile");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleFollow = async () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để theo dõi người dùng");
            return;
        }
        if (followLoading || !userFind) return;

        setFollowLoading(true);
        const wasFollowed = isFollowing;

        // Optimistic update
        setIsFollowing(!wasFollowed);
        setFollowerCount((prev) => (wasFollowed ? prev - 1 : prev + 1));

        try {
            if (wasFollowed) {
                await apiClient.delete(`/user-activity/unfollow/${userFind.id}`, {});
            } else {
                await apiClient.post("/user-activity/follow", {
                    FollowedId: userFind.id,
                });
            }
        } catch {
            // Revert on error
            setIsFollowing(wasFollowed);
            setFollowerCount((prev) => (wasFollowed ? prev + 1 : prev - 1));
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <HomeLayout>
                <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Skeleton sidebar */}
                        <aside className="lg:col-span-4 xl:col-span-3">
                            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col items-center animate-pulse">
                                <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
                                <div className="w-full grid grid-cols-2 gap-3 mb-8">
                                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        </aside>
                        {/* Skeleton content */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 h-20 animate-pulse"></div>
                                <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 h-20 animate-pulse"></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 h-48 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    if (!userFind) {
        return (
            <HomeLayout>
                <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-16 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">person_off</span>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy người dùng</h2>
                    <p className="text-gray-500 mb-6">Người dùng này không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
                    >
                        Quay lại
                    </button>
                </div>
            </HomeLayout>
        );
    }

    const statItems = [
        {
            icon: "description",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            value: stats?.uploadCount ?? 0,
            label: "Tài liệu đã đăng",
        },
        {
            icon: "thumb_up",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            value: stats?.totalLikesReceived ?? 0,
            label: "Lượt thích",
        },
    ];

    return (
        <HomeLayout>
            <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-12 gap-8 ">
                    <aside className="col-span-3 flex flex-col gap-6 ">
                        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="relative group mb-4">
                                <div
                                    className="w-32 h-32 rounded-full bg-cover bg-center shadow-md ring-4 ring-white"
                                    style={{
                                        backgroundImage: userFind.avatarUrl
                                            ? `url("${userFind.avatarUrl}")`
                                            : undefined,
                                        backgroundColor: !userFind.avatarUrl ? "#e5e7eb" : undefined,
                                    }}
                                >
                                    {!userFind.avatarUrl && (
                                        <div className="w-full h-full rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-5xl text-gray-400">person</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Follower count */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span className="material-symbols-outlined text-[18px]">group</span>
                                <span className="font-semibold text-gray-900">{followerCount}</span>
                                <span>người theo dõi</span>
                            </div>

                            {/* Name */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                                {userFind.fullname}
                            </h1>

                            {/* Contact Info */}
                            <div className="w-full flex flex-col gap-4 pt-6 ">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                            Tên người dùng
                                        </span>
                                        <span className="text-gray-900 font-medium truncate max-w-[180px]">
                                            @{userFind.username}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-4 pt-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-[18px]">school</span>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                            Trường học
                                        </span>
                                        <span className="text-gray-900 font-medium truncate max-w-[180px]">
                                            {userFind.universityName ?? "Chưa tham gia"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-4 pt-6">
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`py-2 px-4 rounded-full transition-all duration-200 w-full flex items-center justify-center gap-2 ${isFollowing
                                        ? "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500 group/follow"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                        } ${followLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {isFollowing ? "check" : "person_add"}
                                    </span>
                                    <span className="font-medium">
                                        {isFollowing ? (
                                            <>
                                                <span className="group-hover/follow:hidden">Đang theo dõi</span>
                                                <span className="hidden group-hover/follow:inline text-red-500">Bỏ theo dõi</span>
                                            </>
                                        ) : (
                                            "Theo dõi"
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="col-span-9 flex flex-col gap-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {statItems.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full ${stat.bgColor} ${stat.textColor} flex items-center justify-center`}
                                    >
                                        <span className="material-symbols-outlined text-[24px]">
                                            {stat.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-400">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Documents List */}
                        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">

                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-base font-bold text-gray-900">
                                        Danh sách tài liệu ({documents.length})
                                    </h4>
                                </div>

                                {documents.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {documents.map((doc) => (
                                            <DocumentItem key={doc.id} doc={doc} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">
                                            folder_open
                                        </span>
                                        <p className="text-gray-400 font-medium">
                                            Người dùng chưa có tài liệu công khai nào.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default UserPublicProfilePage;
