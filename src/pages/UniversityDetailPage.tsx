import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/HomeLayout";
import UniversityHeader from "../components/Explore/UniversityHeader";
import SectionGrid from "../components/Explore/SectionGrid";
import DocumentsPopular from "../components/Explore/DocumentsPopular";
import RecentDocuments from "../components/Explore/RecentDocuments";
import { apiClient } from "../utils/apiClient";
import type {
  Universities,
  UniversitySection,
} from "../interfaces/UniversityTypes";

const UniversityDetailPage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();

  const [university, setUniversity] = useState<Universities | null>(null);
  const [sections, setSections] = useState<UniversitySection[]>([]);
  const [loadingUniversity, setLoadingUniversity] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    if (!universityId) return;

    const fetchUniversity = async () => {
      setLoadingUniversity(true);
      try {
        const allUniversities =
          await apiClient.get<Universities[]>("/universities");
        const found = allUniversities.find(
          (u) => u.id === Number(universityId),
        );
        if (found) {
          setUniversity(found);
        } else {
          navigate("/explore", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching university:", error);
        navigate("/explore", { replace: true });
      } finally {
        setLoadingUniversity(false);
      }
    };
    fetchUniversity();
  }, [universityId, navigate]);

  useEffect(() => {
    if (!universityId) return;

    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const data = await apiClient.get<UniversitySection[]>(
          `/universities/${universityId}/sections`,
        );
        setSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [universityId]);
  if (loadingUniversity) {
    return (
      <DashboardLayout>
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="h-5 w-64 bg-[#f1f5f9] animate-pulse rounded mb-6" />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eef2f2] mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#f1f5f9] animate-pulse shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-3/4 bg-[#f1f5f9] animate-pulse rounded" />
                <div className="h-5 w-1/2 bg-[#f1f5f9] animate-pulse rounded" />
                <div className="flex gap-3">
                  <div className="h-10 w-36 bg-[#f1f5f9] animate-pulse rounded-xl" />
                  <div className="h-10 w-24 bg-[#f1f5f9] animate-pulse rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[120px] rounded-2xl bg-[#f1f5f9] animate-pulse"
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!university) return null;

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto w-full">
        <UniversityHeader university={university} />

        <SectionGrid
          sections={sections}
          loading={loadingSections}
          onSectionClick={(section) =>
            navigate(
              `/explore/universities/${universityId}/sections/${section.id}`
            )
          }
        />

        <DocumentsPopular universityId={university.id} />

        <RecentDocuments universityId={university.id} />
      </div>
    </DashboardLayout>
  );
};

export default UniversityDetailPage;
