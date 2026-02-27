import React, { useCallback, useEffect, useState } from "react";
import { ProfileSidebar } from "../components/MyProfile/Sidebar";
import { UserStats } from "../components/MyProfile/UserStat";
import HomeLayout from "../layouts/HomeLayout";
import type { DocumentSummary } from "../interfaces/DocumentTypes";
import { apiClient } from "../utils/apiClient";
import { DocumentItem } from "../components/MyProfile/DocumentItem";

const TABS = [
  { id: "posted", label: "Tài liệu đã đăng", icon: "upload_file" },
  { id: "saved", label: "Tài liệu đã lưu", icon: "bookmark" },
  { id: "liked", label: "Tài liệu đã thích", icon: "thumb_up" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_ENDPOINTS: Record<TabId, string> = {
  posted: "/user/me/documents/upload",
  saved: "/user/me/documents/save",
  liked: "/user/me/documents/like",
};

const TAB_EMPTY_MESSAGES: Record<TabId, { icon: string; message: string }> = {
  posted: { icon: "upload_file", message: "Bạn chưa đăng tài liệu nào." },
  saved: { icon: "bookmark", message: "Bạn chưa lưu tài liệu nào." },
  liked: { icon: "thumb_up", message: "Bạn chưa thích tài liệu nào." },
};

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("posted");
  const [documents, setDocuments] = useState<Record<TabId, DocumentSummary[]>>({
    posted: [],
    saved: [],
    liked: [],
  });
  const [loading, setLoading] = useState<Record<TabId, boolean>>({
    posted: false,
    saved: false,
    liked: false,
  });
  const [fetched, setFetched] = useState<Record<TabId, boolean>>({
    posted: false,
    saved: false,
    liked: false,
  });

  const fetchTabData = useCallback(
    async (tab: TabId) => {
      if (fetched[tab]) return;
      setLoading((prev) => ({ ...prev, [tab]: true }));
      try {
        const response = await apiClient.get<DocumentSummary[]>(
          TAB_ENDPOINTS[tab],
        );
        setDocuments((prev) => ({ ...prev, [tab]: response }));
        setFetched((prev) => ({ ...prev, [tab]: true }));
      } catch (error) {
        console.error(`Error fetching ${tab} documents:`, error);
      } finally {
        setLoading((prev) => ({ ...prev, [tab]: false }));
      }
    },
    [fetched],
  );

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const currentDocs = documents[activeTab];
  const isLoading = loading[activeTab];
  const emptyState = TAB_EMPTY_MESSAGES[activeTab];

  return (
    <HomeLayout>
      <div className="bg-background-light font-display text-text-main antialiased min-h-screen flex flex-col">
        <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-12 gap-8 items-start ">
            {/* Cột trái */}
            <ProfileSidebar />

            {/* Cột phải */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
              <UserStats />
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 ">
                  <div className="flex gap-8 overflow-x-auto">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-5 border-b-2 font-medium text-sm duration-300 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                          ? "border-primary text-primary font-bold"
                          : "border-transparent text-text-secondary hover:text-text-main"
                          }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {tab.icon}
                        </span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {isLoading ? (
                    <div className="flex flex-col gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse flex items-center gap-4 p-4 rounded-xl border border-gray-100"
                        >
                          <div className="flex-grow">
                            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentDocs.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {currentDocs.map((doc) => (
                        <DocumentItem key={doc.id} doc={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">
                        {emptyState.icon}
                      </span>
                      <p className="text-gray-400 font-medium">
                        {emptyState.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </HomeLayout>
  );
};

export default UserProfilePage;
