import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbdfe6] dark:border-gray-800 px-6 py-3 bg-white dark:bg-[#1a2230] z-20 shrink-0 sticky top-0">
      <div className="flex items-center gap-8 w-full">
        <div className="flex items-center gap-3 text-[#111318] dark:text-white min-w-[240px]">
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
            BrandLogo
          </h2>
        </div>

        <div className="flex flex-1 max-w-[600px]">
          <label className="flex flex-col w-full h-10">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#f0f2f4] dark:bg-[#252e40] focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="text-[#616f89] flex items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-[#616f89] px-4 pl-2 text-sm font-normal leading-normal text-[#111318] dark:text-white"
                placeholder="Tìm kiếm nội dung, danh mục..."
              />
            </div>
          </label>
        </div>

        <div className="flex flex-1 justify-end gap-4">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[#111318] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
            <span className="truncate">Đăng nhập</span>
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm">
            <span className="truncate">Đăng ký</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
