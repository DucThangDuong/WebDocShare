interface RelatedDoc {
  id: number;
  title: string;
  author: string;
  views: string;
  pages: number;
  thumbnailUrl: string;
}

// --- Mock Data ---
const RELATED_DOCS: RelatedDoc[] = [
  {
    id: 1,
    title: "Phân tích thị trường Bất động sản Q2/2023",
    author: "Trần Thị B",
    views: "8.5k",
    pages: 28,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZKU8pam8LAYG2u6kjBXCmtAalDvgqQG5tf74Sn9wZTUJ1-rF2fS20_M5xv5_OZFBwKWGnfJgJenfyLTDn2FPvLxVlJ65Uy5Lo6bR_PvX-6EkCySQTubd-Y241FvdGSoTT_s1NBV2GmhC3jTAmq2KI1E34DUPp-WIbTY3Lcy6Wq-iLoiwLLEz3HSsO89fAf2kyQ54vuW07MIhKyBIy2kqQ51UJz0xv97stbrEtRi-hmwtd3vSWgUY8mxLgCMqfRM9TlXHvJMP3d5c",
  },
  {
    id: 2,
    title: "Cẩm nang đầu tư chứng khoán cho người mới",
    author: "Lê Văn C",
    views: "15k",
    pages: 120,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoz93d6WS7EYsgjdzarXPWTJn25wX-50pVC3Yqig6u35pCMA6f8XOa3k4DvHTQLJfV8wvSgfy2YZ4-FHYlA9S_1unjcFXsKcDjRbSe65lTVF3M4AMJ_94O7piXwn5Ut6u1vz8rOiU1ztoY1ybmHSDGS5t8QmRUkk3Z4ZNC5roebIW0ANCoMkiiXhQJ4RNhrq3CAV90Ipg1xMRu1v6k_AystQIi8KMCfcXs735P9nYxuug1j4tseKYk9iTJLmZCh0kGUgrl-UvGs9s",
  },
  {
    id: 3,
    title: "Báo cáo Xu hướng Công nghệ 2024",
    author: "Tech Insider",
    views: "21k",
    pages: 54,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKougApCmyHyaYHdA8aB_TmBvHsOyqM4IEnmq1pvjUNvbhPslkmwtgraZ1-V8z-UwjFVH-woRfG7aA-mlUJBf3x4DnAq1aZaIvbbaukfQRXKYIY-jBvTZf9QcnfmMqRrzA50c3dFvISNC6tjPF175lA1_GeWh3jWCPNJoEU1S2ldLQd2EFJ-jariOGT-0Y9yXQG8ajOsdn5XYtGi1biktz42IR0x_Zd38oG-FEwfPpDX_oFi6MLlsdUfkSI5C_TGoxRgWwYz7c8E",
  },
  {
    id: 4,
    title: "Kế hoạch kinh doanh mẫu cho Startup",
    author: "Phạm Minh Đ",
    views: "4.2k",
    pages: 15,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu5V904AVztPjooD7Ut6YvqXOffM-rYSMdxmAbwsjMQDZAWqCt-gwmKHBeRe0XLw3kYNVc5MAlOo6BIB4mtlsgTQEWYtdpg62_NkeetsRTuAjGGMK1hitV7Fl_3rviWZyhYLBJLrsZwN553qoXUtzfKg79OMNUZc58bhCPBwH1x_3lJuSo5NlGfUkEhsqoN8Uq0-uHmAqWy1y7viGFJJYjJmXx0T7AUmEoPkIBPBiv2u51qhpsF-5qJju_UYKPKqomn2X6iYf1qs8",
  },
];
export const RelatedDoc = () => {
  return (
    <>
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Tài liệu liên quan
        </h3>

        <div className="flex flex-col gap-4">
          {RELATED_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="group flex gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-all hover:shadow-sm border border-transparent hover:border-gray-100"
            >
              {/* hình ảnh */}
              <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden border border-gray-200 relative">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${doc.thumbnailUrl}')` }}
                ></div>
                <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl-md">
                  PDF
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 py-1">
                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h4>
                <span className="text-xs text-gray-500">{doc.author}</span>
                <div className="flex items-center gap-2 mt-auto text-[11px] text-gray-400 font-medium">
                  <span>{doc.views} views</span>
                  <span>•</span>
                  <span>{doc.pages} trang</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-all">
          Xem thêm tài liệu
        </button>
      </aside>
    </>
  );
};
