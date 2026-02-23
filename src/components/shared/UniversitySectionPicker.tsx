import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "../../utils/apiClient";
import type { Universities, UniversitySection } from "../../interfaces/UniversityTypes";

interface UniversitySectionPickerProps {
  universityId: number | null;
  sectionId: number | null;
  onUniversityChange: (universityId: number | null) => void;
  onSectionChange: (sectionId: number | null) => void;
}

const UniversitySectionPicker: React.FC<UniversitySectionPickerProps> = ({
  universityId,
  sectionId,
  onUniversityChange,
  onSectionChange,
}) => {
  const [universities, setUniversities] = useState<Universities[]>([]);
  const [sections, setSections] = useState<UniversitySection[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // Search/filter state for universities
  const [uniSearch, setUniSearch] = useState("");
  const [uniDropdownOpen, setUniDropdownOpen] = useState(false);
  const uniDropdownRef = useRef<HTMLDivElement>(null);

  // Create new section
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [creatingSectionLoading, setCreatingSectionLoading] = useState(false);

  // Fetch universities on mount
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const data = await apiClient.get<Universities[]>("/universities");
        setUniversities(data);
      } catch {
        setUniversities([]);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch sections when universityId changes
  useEffect(() => {
    if (!universityId) {
      setSections([]);
      setSectionsError(null);
      return;
    }
    const fetchSections = async () => {
      setLoadingSections(true);
      setSectionsError(null);
      setSections([]);
      try {
        const data = await apiClient.get<UniversitySection[]>(
          `/universities/${universityId}/sections`,
        );
        setSections(data);
        if (data.length === 0) {
          setSectionsError(null);
        }
      } catch {
        const msg = "Không thể tải danh sách khoa. Vui lòng thử lại.";
        setSectionsError(msg);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [universityId]);

  // Sync search text when universityId is set externally
  useEffect(() => {
    if (universityId) {
      const uni = universities.find((u) => u.id === universityId);
      if (uni) setUniSearch(uni.name);
    } else {
      setUniSearch("");
    }
  }, [universityId, universities]);

  const selectedUniversity = universities.find((u) => u.id === universityId);

  const handleSelectUniversity = (uni: Universities) => {
    onUniversityChange(uni.id);
    onSectionChange(null);
    setUniSearch(uni.name);
    setUniDropdownOpen(false);
    setIsCreatingSection(false);
    setNewSectionName("");
  };

  const handleClearUniversity = () => {
    onUniversityChange(null);
    onSectionChange(null);
    setUniSearch("");
    setSections([]);
    setSectionsError(null);
    setIsCreatingSection(false);
    setNewSectionName("");
  };

  const handleSelectSection = (section: UniversitySection) => {
    onSectionChange(section.id);
    setIsCreatingSection(false);
    setNewSectionName("");
  };

  const handleCreateSection = async () => {
    if (!newSectionName.trim() || !universityId) return;
    setCreatingSectionLoading(true);
    try {
      const newSection = await apiClient.post<UniversitySection>(
        `/universities/${universityId}/sections`,
        { name: newSectionName.trim() },
      );
      setSections((prev) => [...prev, newSection]);
      onSectionChange(newSection.id);
      setIsCreatingSection(false);
      setNewSectionName("");
      setSectionsError(null);
    } catch (err) {
      console.error("Error creating section:", err);
    } finally {
      setCreatingSectionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* University Picker */}
      <div>
        <label className="label-text">
          <span className="material-symbols-outlined text-[18px] align-middle mr-1">
            school
          </span>
          Trường đại học
        </label>
        <div className="relative" ref={uniDropdownRef}>
          <div className="relative">
            <input
              type="text"
              className="input pr-16"
              placeholder="Tìm kiếm trường đại học..."
              value={uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setUniDropdownOpen(true);
                if (universityId) {
                  onUniversityChange(null);
                  onSectionChange(null);
                }
              }}
              onFocus={() => setUniDropdownOpen(true)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {universityId && (
                <button
                  type="button"
                  onClick={handleClearUniversity}
                  className="p-1 text-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              )}
              {loadingUniversities && (
                <span className="material-symbols-outlined text-[18px] animate-spin text-muted">
                  progress_activity
                </span>
              )}
            </div>
          </div>

          {/* Dropdown */}
          {uniDropdownOpen && !universityId && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-[220px] overflow-y-auto">
              {universities.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted text-center">
                  Không tìm thấy trường đại học nào
                </div>
              ) : (
                universities.map((uni) => (
                  <button
                    key={uni.id}
                    type="button"
                    onClick={() => handleSelectUniversity(uni)}
                    className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors flex items-center gap-3 border-b border-[#f0f2f4] last:border-b-0"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary/70">
                      account_balance
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-body truncate">
                        {uni.name}
                      </span>
                      <span className="text-xs text-muted">{uni.code}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected university badge */}
        {selectedUniversity && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <span className="material-symbols-outlined text-[16px]">
              account_balance
            </span>
            {selectedUniversity.name}
            <span className="text-xs opacity-70">
              ({selectedUniversity.code})
            </span>
          </div>
        )}
      </div>

      {/* Section Picker — chỉ xuất hiện khi đã chọn trường */}
      {universityId && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="label-text">
            <span className="material-symbols-outlined text-[18px] align-middle mr-1">
              category
            </span>
            Khoa / Bộ môn
          </label>

          {loadingSections ? (
            <div className="flex items-center gap-2 py-4 justify-center text-muted">
              <span className="material-symbols-outlined text-[18px] animate-spin">
                progress_activity
              </span>
              <span className="text-sm">Đang tải danh sách khoa...</span>
            </div>
          ) : (
            <>
              {sectionsError && (
                <div className="text-sm text-amber-700 py-3 px-4 text-center bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    info
                  </span>
                  Trường này chưa có khoa / bộ môn nào. Bạn có thể tạo mới bên
                  dưới.
                </div>
              )}

              {!sectionsError && sections.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleSelectSection(section)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${sectionId === section.id
                        ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                        : "bg-white text-body border-[#e5e7eb] hover:border-primary/50 hover:bg-primary/5"
                        }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              )}

              {!sectionsError && sections.length === 0 && (
                <div className="text-sm text-muted py-3 text-center bg-[#f9fafb] rounded-lg border border-dashed border-[#dbdfe6] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    info
                  </span>
                  Chưa có khoa / bộ môn nào cho trường này. Bạn có thể tạo mới
                  bên dưới.
                </div>
              )}

              {!isCreatingSection ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingSection(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  Tạo khoa / bộ môn mới
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Nhập tên khoa / bộ môn..."
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateSection();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateSection}
                    disabled={!newSectionName.trim() || creatingSectionLoading}
                    className="btn-change px-4 py-2.5 text-sm"
                  >
                    {creatingSectionLoading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSection(false);
                      setNewSectionName("");
                    }}
                    className="p-2.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversitySectionPicker;
