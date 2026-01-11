import React from 'react';

interface NewsCardProps {
  image: string;
  category: string;
  categoryColor: 'blue' | 'green' | 'purple' | 'orange';
  time: string;
  title: string;
  description: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ image, category, categoryColor, time, title, description }) => {
  // Map màu sắc cho badge category
  const colorMap = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900",
    green: "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900",
  };

  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div
        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden relative"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`${colorMap[categoryColor]} text-xs font-semibold px-2 py-0.5 rounded`}>
            {category}
          </span>
          <span className="text-[#616f89] text-xs">{time}</span>
        </div>
        <p className="text-[#111318] dark:text-white text-base font-bold leading-snug group-hover:text-primary transition-colors mb-1">
          {title}
        </p>
        <p className="text-[#616f89] text-sm font-normal leading-normal line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;