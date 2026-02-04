import React, { useEffect, useState } from "react";
import { ProfileSidebar } from "../components/MyProfile/Sidebar";
import { UserStats } from "../components/MyProfile/UserStat";
import HomeLayout from "../layouts/HomeLayout";
import type { DocumentInfor } from "../interfaces/Types";
import { apiClient } from "../utils/apiClient";
import { DocumentItem } from "../components/MyProfile/DocumentItem";
const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("posted");
  const [DOCUMENTS, setDOCUMENTS] = useState<DocumentInfor[]>([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await apiClient.get<DocumentInfor[]>(
          "/documents?skip=0&take=5",
        );
        setDOCUMENTS(response);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);
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
                    {[
                      { id: "posted", label: "Tài liệu đã đăng" },
                      { id: "saved", label: "Tài liệu đã lưu" },
                      { id: "activity", label: "Hoạt động gần đây" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-5 border-b-2 font-medium text-sm duration-300 transition-colors  whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-primary text-primary font-bold"
                            : "border-transparent text-text-secondary hover:text-text-main"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-text-main">
                      Tài liệu mới nhất
                    </h4>
                  </div>

                  <div className="flex flex-col gap-4">
                    {DOCUMENTS.map((doc) => (
                      <DocumentItem key={doc.id} doc={doc} />
                    ))}
                  </div>
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
