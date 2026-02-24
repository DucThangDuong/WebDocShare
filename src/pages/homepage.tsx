import React from 'react';
import DashboardLayout from '../layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center text-center gap-6 py-16 md:py-24 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none">
        </div>
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Kho tài liệu lớn nhất cho sinh viên
        </span>
        <h1
          className="text-slate-900 tracking-tight text-4xl md:text-6xl font-black leading-[1.1] max-w-[900px]">
          Chia sẻ tri thức,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Kết nối
            thành công</span>
        </h1>
        <p
          className="text-slate-500 text-lg md:text-xl font-normal leading-relaxed max-w-[700px]">
          Nền tảng chia sẻ đề thi, bài giảng, giáo trình miễn phí từ hàng trăm trường đại học trên cả
          nước. Cùng nhau học tập tốt hơn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
          <button
            onClick={() => navigate('/my-documents')}
            className="h-12 px-8 rounded-full bg-slate-900 text-white text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Chia sẻ tài liệu ngay
          </button>
          <button
            onClick={() => navigate('/search')}
            className="h-12 px-8 rounded-full bg-white text-slate-700 border border-slate-200 text-base font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">search</span>
            Tìm tài liệu
          </button>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-12 pt-12 border-t border-slate-200/60 w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900">50+</span>
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Trường ĐH</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900">100K+</span>
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Tài liệu</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900">200K+</span>
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Thành viên</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900">FREE</span>
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Truy cập</span>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default HomePage;