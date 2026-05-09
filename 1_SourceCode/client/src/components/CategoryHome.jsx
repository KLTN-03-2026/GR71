import { EnvironmentOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { requestGetAllCategory } from '../config/CategoryRequest';

function CategoryHome() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllCategory();
            setCategories(res.metadata);
        };
        fetchData();
    }, []);

    // Nhân đôi danh sách để tạo vòng lặp liền mạch
    const items = [...categories, ...categories];

    return (
        <section className="py-16">
            <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Điểm Đến Phổ Biến</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Khám phá những địa điểm du lịch được yêu thích nhất tại Việt Nam
                    </p>
                </div>
            </div>

            {/* Marquee row — full width, no side padding */}
            {categories.length > 0 && (
            <div className="overflow-hidden">
                <div
                    className="flex gap-6"
                    style={{
                        animation: `marquee ${categories.length * 6}s linear infinite`,
                        width: 'max-content',
                    }}
                >
                    {items.map((destination, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-72 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={`${import.meta.env.VITE_URL_IMAGE}/uploads/category/${destination.image}`}
                                    alt={destination.categoryName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <EnvironmentOutlined className="text-3xl mb-1" />
                                        <p className="text-sm font-medium">Xem chi tiết</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                                    {destination.categoryName}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">{destination.description}</p>
                                <div className="mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                                    Khám phá ngay →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}

export default CategoryHome;
