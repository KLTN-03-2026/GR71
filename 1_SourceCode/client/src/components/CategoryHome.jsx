import { Card } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { requestGetAllCategory } from '../config/CategoryRequest';

function CategoryHome() {
    // Dữ liệu các điểm đến phổ biến

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllCategory();
            setCategories(res.metadata);
        };
        fetchData();
    }, []);

    const popularDestinations = [
        {
            id: 1,
            name: 'Hà Nội',
            trips: '15 tours',
            image: 'https://images.unsplash.com/photo-1509650392845-5f03a1e3d3e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Thủ đô ngàn năm văn hiến',
        },
        {
            id: 2,
            name: 'TP. Hồ Chí Minh',
            trips: '22 tours',
            image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Thành phố năng động nhất Việt Nam',
        },
        {
            id: 3,
            name: 'Đà Nẵng',
            trips: '18 tours',
            image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Thành phố đáng sống bậc nhất',
        },
        {
            id: 4,
            name: 'Hạ Long',
            trips: '12 tours',
            image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Kỳ quan thế giới tại Việt Nam',
        },
        {
            id: 5,
            name: 'Hội An',
            trips: '14 tours',
            image: 'https://images.unsplash.com/photo-1555618254-7c3b56d3d9cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Phố cổ thơ mộng bên sông Thu Bồn',
        },
        {
            id: 6,
            name: 'Đà Lạt',
            trips: '16 tours',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Thành phố ngàn hoa',
        },
    ];

    return (
        <section className="py-16 ">
            <div className="w-[90%]  mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Điểm Đến Phổ Biến</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Khám phá những địa điểm du lịch được yêu thích nhất tại Việt Nam
                    </p>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((destination) => (
                        <Card
                            key={destination.id}
                            hoverable
                            className="overflow-hidden rounded-2xl shadow-lg border-0 group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                        >
                            <div className="relative">
                                {/* Destination Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_URL_IMAGE}/uploads/category/${destination.image}`}
                                        alt={destination.categoryName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Hover Content */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <EnvironmentOutlined className="text-3xl mb-2" />
                                            <p className="text-sm font-medium">Xem chi tiết</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                            {destination.categoryName}
                                        </h3>
                                        <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                                            {destination.categoryName}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <EnvironmentOutlined className="mr-1" />
                                            <span>{destination.categoryName}</span>
                                        </div>
                                        <div className="text-blue-600 font-medium group-hover:text-blue-700">
                                            Khám phá ngay →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoryHome;
