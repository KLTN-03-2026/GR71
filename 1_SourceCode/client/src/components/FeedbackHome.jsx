import { useEffect, useState } from 'react';
import { requestGetAllFeedback } from '../config/Feedback';
import { Rate, Typography, Card } from 'antd';
import { Star, Quote } from 'lucide-react';
import Slider from 'react-slick';
import moment from 'moment';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { Title, Text } = Typography;

function FeedbackHome() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllFeedback = async () => {
            try {
                const res = await requestGetAllFeedback();
                setFeedback(res.metadata);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllFeedback();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    if (loading) {
        return (
            <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <Text>Đang tải đánh giá...</Text>
                    </div>
                </div>
            </div>
        );
    }

    if (!feedback || feedback.length === 0) {
        return (
            <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <Title level={4} className="text-gray-500 mb-2">
                        Chưa có đánh giá nào
                    </Title>
                    <Text className="text-gray-400">Hãy trở thành người đầu tiên đánh giá dịch vụ của chúng tôi!</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-[#FF3B2F] text-white px-6 py-3 rounded-full shadow-lg mb-4">
                        <Star className="w-5 h-5" />
                        <span className="font-semibold">Đánh giá từ khách hàng</span>
                    </div>
                    <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Trải nghiệm tuyệt vời cùng chúng tôi
                    </Title>
                    <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Hàng nghìn khách hàng đã tin tưởng và lựa chọn dịch vụ tour du lịch của chúng tôi
                    </Text>
                </div>

                {/* Feedback Carousel */}
                <div className="feedback-carousel">
                    <style jsx>{`
                        .feedback-carousel .slick-dots {
                            bottom: -50px !important;
                        }

                        .feedback-carousel .slick-dots li button:before {
                            font-size: 12px !important;
                            color: #3b82f6 !important;
                            opacity: 0.5 !important;
                        }

                        .feedback-carousel .slick-dots li.slick-active button:before {
                            opacity: 1 !important;
                            color: #3b82f6 !important;
                        }

                        .feedback-carousel .slick-prev,
                        .feedback-carousel .slick-next {
                            width: 40px !important;
                            height: 40px !important;
                            z-index: 10 !important;
                        }

                        .feedback-carousel .slick-prev {
                            left: -20px !important;
                        }

                        .feedback-carousel .slick-next {
                            right: -20px !important;
                        }

                        .feedback-carousel .slick-prev:before,
                        .feedback-carousel .slick-next:before {
                            font-size: 20px !important;
                            color: #3b82f6 !important;
                        }

                        .line-clamp-4 {
                            display: -webkit-box;
                            -webkit-line-clamp: 4;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }

                        .line-clamp-1 {
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    `}</style>
                    <Slider {...sliderSettings}>
                        {feedback.map((review) => (
                            <div key={review._id} className="px-3">
                                <Card className="h-full shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative">
                                        {/* Quote Icon */}
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-[#FF3B2F] from-blue-500 to-purple-600 rounded-bl-2xl flex items-center justify-center">
                                            <Quote className="w-5 h-5 text-white" />
                                        </div>

                                        {/* User Info */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-[#FF3B2F] from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                {review.userId?.avatar ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${
                                                            review.userId.avatar
                                                        }`}
                                                        alt={review.userId.fullName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-lg">
                                                        {review.userId?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 text-sm">
                                                    {review.userId?.fullName || 'Khách hàng'}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Rate disabled value={review.rating} className="text-xs" />
                                                    <span className="text-xs text-gray-500">
                                                        {moment(review.createdAt).format('DD/MM/YYYY')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                                                "{review.content}"
                                            </p>
                                        </div>

                                        {/* Tour Info */}
                                        {review.productId && (
                                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    {review.productId.images?.[0] && (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}/uploads/products/${
                                                                review.productId.images[0]
                                                            }`}
                                                            alt={review.productId.title}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-semibold text-gray-800 text-xs line-clamp-1">
                                                            {review.productId.title}
                                                        </h5>
                                                        <p className="text-xs text-gray-500">
                                                            📍 {review.productId.destination}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default FeedbackHome;
