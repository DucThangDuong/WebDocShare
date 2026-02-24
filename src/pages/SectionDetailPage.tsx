import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/HomeLayout";
import { apiClient } from "../utils/apiClient";
import type { DocumentSummary } from "../interfaces/DocumentTypes";
import type {
    Universities,
    UniversitySection,
} from "../interfaces/UniversityTypes";
import SectionHeader from "../components/Section/SectionHeader";
import SectionTrending from "../components/Section/SectionTrending";
import SectionDocumentList from "../components/Section/SectionDocumentList";

const SectionDetailPage: React.FC = () => {
    const { universityId, sectionId } = useParams<{
        universityId: string;
        sectionId: string;
    }>();
    const navigate = useNavigate();

    const [university, setUniversity] = useState<Universities | null>(null);
    const [section, setSection] = useState<UniversitySection | null>(null);
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!universityId || !sectionId) return;

        const fetchMeta = async () => {
            setLoadingMeta(true);
            try {
                const [allUniversities, allSections] = await Promise.all([
                    apiClient.get<Universities[]>("/universities"),
                    apiClient.get<UniversitySection[]>(
                        `/universities/${universityId}/sections`
                    ),
                ]);
                const foundUniversity = allUniversities.find(
                    (u) => u.id === Number(universityId)
                );
                const foundSection = allSections.find(
                    (s) => s.id === Number(sectionId)
                );

                if (foundUniversity) setUniversity(foundUniversity);
                if (foundSection) setSection(foundSection);

                if (!foundUniversity || !foundSection) {
                    navigate(`/explore/universities/${universityId}`, { replace: true });
                }
            } catch (error) {
                console.error("Error fetching metadata:", error);
            } finally {
                setLoadingMeta(false);
            }
        };
        fetchMeta();
    }, [universityId, sectionId, navigate]);

    useEffect(() => {
        if (!sectionId) return;
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const data = await apiClient.get<DocumentSummary[]>(
                    `/universities/sections/${sectionId}/documents`
                );
                setDocuments(data);
            } catch (error) {
                console.error("Error fetching section documents:", error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [sectionId]);

    const handleDocumentClick = (docId: string) => {
        navigate(`/documents/${docId}`);
    };

    const filteredDocuments = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const trendingDocuments = [...documents]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 8);
    const allDocumentsSorted = [...filteredDocuments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (loadingMeta) {
        return (
            <DashboardLayout>
                <div className="max-w-[1200px] mx-auto w-full">
                    {/* Header skeleton */}
                    <div className="bg-[#ecfccb] rounded-2xl p-6 mb-8">
                        <div className="h-4 w-48 bg-white/50 rounded mb-4 animate-pulse" />
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-12 bg-white/50 rounded-lg animate-pulse" />
                            <div className="flex-1 space-y-3">
                                <div className="h-8 w-2/3 bg-white/50 rounded animate-pulse" />
                                <div className="h-4 w-1/3 bg-white/50 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                    {/* Content skeleton */}
                    <div className="space-y-6">
                        <div className="h-6 w-32 bg-[#f1f5f9] rounded animate-pulse" />
                        <div className="flex gap-4 overflow-hidden">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-64 flex-shrink-0 aspect-[4/3] bg-[#f1f5f9] rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-[1200px] mx-auto w-full">
                <SectionHeader
                    university={university}
                    universityId={universityId}
                    section={section}
                    documentCount={documents.length}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <main className="space-y-12">
                    {!loading && (
                        <SectionTrending
                            documents={trendingDocuments}
                            onDocumentClick={handleDocumentClick}
                        />
                    )}

                    <SectionDocumentList
                        documents={allDocumentsSorted}
                        loading={loading}
                        searchQuery={searchQuery}
                        onDocumentClick={handleDocumentClick}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default SectionDetailPage;
