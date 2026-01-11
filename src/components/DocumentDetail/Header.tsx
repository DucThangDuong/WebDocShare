interface HeaderProps {
  currentPage: number;
  numPages: number;
  goToPage: (page: number) => void;
}
export const Header: React.FC<HeaderProps> = ({
  currentPage,
  numPages,
  goToPage,
}) => {
  return (
    <header className="h-16  flex items-center justify-between px-4 border-b bg-white z-20 shadow-sm top-0 left-0 sticky">
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600">
          <span className="material-symbols-outlined">description</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-tight"></h1>
          <span className="text-xs text-gray-500">Chế độ xem slide</span>
        </div>
      </div>

      {/* Nút chuyển trang giữa Header */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#f0f2f4] p-1 rounded-lg">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-8 flex items-center justify-center rounded hover:bg-white disabled:opacity-30"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex items-center px-2 gap-1 text-sm font-medium">
          <span>{currentPage}</span>
          <span className="text-gray-400">/</span>
          <span>{numPages}</span>
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === numPages}
          className="size-8 flex items-center justify-center rounded hover:bg-white disabled:opacity-30"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <button className="h-9 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium">
        Tải xuống
      </button>
    </header>
  );
};
