import React from 'react';
import DashboardLayout from '../layouts/HomeLayout';
import NewsCard from '../components/Home/NewsCard';

const HomePage: React.FC = () => {
  return (
    <DashboardLayout>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-black  text-3xl font-bold md:text-4xl max-w-[720px]">
            Chào mừng trở lại, cùng khám phá!
          </h1>
          <p className="text-[#616f89] text-base font-normal leading-normal max-w-[720px]">
            Cập nhật những xu hướng thiết kế và công nghệ mới nhất dành cho bạn hôm nay.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon="rocket_launch"
            title="Dự án mới"
            desc="Bắt đầu một hành trình sáng tạo mới ngay lập tức."
            colorClass="text-primary bg-primary/10 group-hover:bg-primary"
          />
          <FeatureCard
            icon="monitoring"
            title="Thống kê"
            desc="Xem xét hiệu suất và dữ liệu phân tích của bạn."
            colorClass="text-green-600 bg-green-500/10 group-hover:bg-green-600"
          />
          <FeatureCard
            icon="groups"
            title="Cộng đồng"
            desc="Kết nối với những người sáng tạo khác."
            colorClass="text-purple-600 bg-purple-500/10 group-hover:bg-purple-600"
          />
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[#111318] dark:text-white text-2xl font-bold leading-tight">Tin tức nổi bật</h2>
          <a className="text-primary text-sm font-medium hover:underline" href="#">Xem tất cả</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NewsCard
            image="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=60"
            category="Công nghệ" categoryColor="blue" time="2 giờ trước"
            title="Tương lai của AI trong thiết kế"
            description="Khám phá cách trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc."
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=500&q=60"
            category="Đời sống" categoryColor="green" time="5 giờ trước"
            title="Cân bằng công việc và cuộc sống"
            description="Mẹo nhỏ giúp bạn làm việc hiệu quả mà không bị kiệt sức."
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=500&q=60"
            category="Lập trình" categoryColor="purple" time="1 ngày trước"
            title="Web 3.0 là gì?"
            description="Tìm hiểu về thế hệ tiếp theo của internet và blockchain."
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=60"
            category="Sáng tạo" categoryColor="orange" time="2 ngày trước"
            title="Xu hướng màu sắc 2024"
            description="Những bảng màu sẽ thống trị thiết kế trong năm tới."
          />
        </div>
      </section>

      {/* Recommendation Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-[#111318] dark:text-white text-2xl font-bold leading-tight">Dành riêng cho bạn</h2>
        <div className="bg-white dark:bg-[#1a2230] rounded-xl p-6 border border-[#dbdfe6] dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center">
          <div
            className="w-full md:w-1/3 aspect-video bg-cover bg-center rounded-lg"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60')" }}
          ></div>
          <div className="flex flex-col gap-3 flex-1">
            <span className="bg-primary/10 text-primary w-fit text-xs font-semibold px-2 py-1 rounded">Khóa học Online</span>
            <h3 className="text-[#111318] dark:text-white text-xl font-bold">Kỹ năng làm việc nhóm hiệu quả</h3>
            <p className="text-[#616f89] text-sm">
              Tham gia khóa học miễn phí để nâng cao kỹ năng mềm của bạn, giúp bạn thăng tiến nhanh hơn trong sự nghiệp.
            </p>
            <div className="flex gap-3 mt-2">
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Đăng ký ngay
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#111318] dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

// Component nhỏ cho các thẻ Feature ở đầu trang
const FeatureCard = ({ icon, title, desc, colorClass }: { icon: string, title: string, desc: string, colorClass: string }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a2230] p-6 hover:shadow-md transition-shadow cursor-pointer group">
    <div className={`size-12 rounded-lg flex items-center justify-center group-hover:text-white transition-colors ${colorClass}`}>
      <span className="material-symbols-outlined text-[28px]">{icon}</span>
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">{title}</h2>
      <p className="text-[#616f89] text-sm font-normal leading-normal">{desc}</p>
    </div>
  </div>
);

export default HomePage;