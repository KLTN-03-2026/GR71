import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestGetTourById } from '../config/TourRequest';
import { requestCreateCart } from '../config/CartRequest';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../hooks/useStore';
import {
    Carousel,
    Row,
    Col,
    Card,
    Typography,
    Button,
    Space,
    Rate,
    Badge,
    Tabs,
    Modal,
    Form,
    InputNumber,
    Select,
    Spin,
} from 'antd';
import {
    MapPin,
    Calendar,
    Users,
    Clock,
    Star,
    Plane,
    Bus,
    Train,
    Ship,
    Car,
    Phone,
    Mail,
    Heart,
    Share2,
    ShoppingCart,
    Plus,
    Minus,
    X,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    ThumbsUp,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';
import NotifyViewTour from '../components/toast/NotifyViewTour';
import { requestCreateFavourite } from '../config/FavouriteRequest';

const { Title, Text } = Typography;

function DetailProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dataUser, fetchCart, usersWatchingProduct } = useStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [feedback, setFeedback] = useState([]);
    const [favourite, setFavourite] = useState([]);
    const [form] = Form.useForm();

    const fetchProduct = async () => {
        setLoading(true);
        const res = await requestGetTourById(id);
        setProduct(res.metadata.product);
        setFeedback(res.metadata.feedback);
        setFavourite(res.metadata.favourite);
        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const getTransportIcon = (transport) => {
        const iconMap = {
            'Máy bay': <Plane className="w-4 h-4" />,
            'Xe bus': <Bus className="w-4 h-4" />,
            'Tàu hoả': <Train className="w-4 h-4" />,
            'Tàu thuỷ': <Ship className="w-4 h-4" />,
            'Xe limousine': <Car className="w-4 h-4" />,
        };
        return iconMap[transport] || <Bus className="w-4 h-4" />;
    };

    const getAverageRating = () => {
        if (feedback.length === 0) return 0;
        const totalRating = feedback.reduce((acc, curr) => acc + curr.rating, 0);
        return totalRating / feedback.length;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Helper function to truncate HTML content
    const truncateHTMLContent = (htmlContent, maxLength = 300) => {
        if (!htmlContent) return '';

        // Remove HTML tags to count actual text length
        const textContent = htmlContent.replace(/<[^>]*>/g, '');

        if (textContent.length <= maxLength) {
            return htmlContent;
        }

        // If content is too long, truncate and add ellipsis
        const truncatedText = textContent.substring(0, maxLength);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;

        return finalText + '...';
    };

    // Handle booking modal
    const handleBookTour = (schedule = null) => {
        if (!dataUser?._id) {
            toast.warning('Vui lòng đăng nhập để đặt tour!');
            navigate('/login');
            return;
        }

        // Tự động chọn tour đầu tiên nếu không có schedule được truyền vào
        if (schedule) {
            setSelectedSchedule(schedule);
        } else if (product?.departureSchedules?.[0]) {
            setSelectedSchedule(product.departureSchedules[0]);
        }

        setBookingModalVisible(true);

        // Reset form và set giá trị mặc định
        form.resetFields();
        form.setFieldsValue({
            adult: 1,
            child: 0,
            baby: 0,
            scheduleId: product?.departureSchedules?.[0]?._id,
        });
    };

    const handleModalClose = () => {
        setBookingModalVisible(false);
        setSelectedSchedule(null);
        form.resetFields();
    };

    const calculateTotalPrice = (values) => {
        if (!selectedSchedule) return 0;
        const { adult = 0, child = 0, baby = 0 } = values || {};
        return (
            adult * selectedSchedule.price.adult +
            child * selectedSchedule.price.child +
            baby * selectedSchedule.price.baby
        );
    };

    const handleCreateFavourite = async () => {
        try {
            await requestCreateFavourite({ productId: product._id });
            fetchProduct();
            toast.success('🎉 Đã thêm tour vào yêu thích thành công!');
        } catch (error) {
            fetchProduct();
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm tour vào yêu thích');
        }
    };

    const handleBookingSubmit = async (values) => {
        try {
            setBookingLoading(true);

            const bookingData = {
                userId: dataUser._id,
                departureScheduleId: selectedSchedule._id,
                productId: product._id,
                quantity: {
                    adult: values.adult || 0,
                    child: values.child || 0,
                    baby: values.baby || 0,
                },
            };

            await requestCreateCart(bookingData);
            await fetchCart();

            toast.success('🎉 Đã thêm tour vào giỏ hàng thành công!');
            handleModalClose();
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt tour');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <Text>Đang tải...</Text>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <Text>Không tìm thấy tour</Text>
                </div>
                <Footer />
            </div>
        );
    }

    const tabItems = [
        {
            key: '1',
            label: '📝 Mô tả chi tiết',
            children: (
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-2xl"></div>
                    <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                        <div className="relative">
                            <div
                                className={`prose prose-lg max-w-none 
                                          prose-headings:text-gray-800 prose-headings:font-bold
                                          prose-p:text-gray-700 prose-p:leading-relaxed
                                          prose-strong:text-blue-700 prose-strong:font-semibold
                                          prose-ul:text-gray-700 prose-li:mb-2
                                          prose-img:rounded-xl prose-img:shadow-md
                                          transition-all duration-500 ease-in-out
                                          ${!isDescriptionExpanded ? 'max-h-96 overflow-hidden' : ''}`}
                                dangerouslySetInnerHTML={{
                                    __html: isDescriptionExpanded
                                        ? product.description
                                        : truncateHTMLContent(product.description, 400),
                                }}
                            />

                            {/* Gradient Fade Effect */}
                            {!isDescriptionExpanded &&
                                product?.description &&
                                product.description.replace(/<[^>]*>/g, '').length > 400 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/90 to-transparent pointer-events-none"></div>
                                )}

                            {/* Read More Button */}
                            {product?.description && product.description.replace(/<[^>]*>/g, '').length > 400 && (
                                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                                    <Button
                                        type="link"
                                        size="large"
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span className="text-lg">
                                            {isDescriptionExpanded ? 'Thu gọn' : 'Đọc thêm'}
                                        </span>
                                        <div
                                            className={`transition-transform duration-300 ${
                                                isDescriptionExpanded ? 'rotate-180' : 'rotate-0'
                                            }`}
                                        >
                                            {isDescriptionExpanded ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: '📅 Lịch trình & Giá',
            children: (
                <div className="space-y-8">
                    {product.departureSchedules?.map((schedule, index) => (
                        <div
                            key={schedule._id}
                            className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>

                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <Title level={4} className="mb-0 text-xl font-bold text-gray-800">
                                        Lịch trình {index + 1}
                                    </Title>
                                </div>

                                <Row gutter={[24, 24]}>
                                    <Col xs={24} lg={14}>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                                <div className="p-2 bg-blue-500 rounded-full">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Text className="text-sm text-gray-500 font-medium">
                                                        Ngày khởi hành
                                                    </Text>
                                                    <div className="text-lg font-bold text-blue-700">
                                                        {moment(schedule.departureDate).format('DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                                                <div className="p-2 bg-red-500 rounded-full">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Text className="text-sm text-gray-500 font-medium">Ngày về</Text>
                                                    <div className="text-lg font-bold text-red-700">
                                                        {moment(schedule.returnDate).format('DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                                <div className="p-2 bg-green-500 rounded-full">
                                                    <Users className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <Text className="text-sm text-gray-500 font-medium">
                                                        Chỗ còn lại
                                                    </Text>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-green-700">
                                                            {schedule.seatsAvailable}
                                                        </span>
                                                        <Badge
                                                            count="Hot"
                                                            style={{
                                                                backgroundColor: '#ef4444',
                                                                fontSize: '10px',
                                                                height: '18px',
                                                                minWidth: '35px',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                                                <div className="p-2 bg-yellow-500 rounded-full">
                                                    <Star className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <Text className="text-sm text-gray-500 font-medium">Khách sạn</Text>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-lg font-bold text-yellow-700">
                                                            {schedule.hotel.name}
                                                        </span>
                                                        <Rate
                                                            disabled
                                                            defaultValue={schedule.hotel.stars}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xs={24} lg={10}>
                                        <div className="h-full bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6 rounded-xl border border-orange-100 relative overflow-hidden">
                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full -translate-y-4 translate-x-4"></div>
                                            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full translate-y-2 -translate-x-2"></div>

                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                                                        <span className="text-white font-bold text-sm">💰</span>
                                                    </div>
                                                    <Title level={5} className="mb-0 text-orange-800 font-bold">
                                                        Bảng giá ưu đãi
                                                    </Title>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                                                        <div className="flex items-center gap-2">
                                                            <Text className="font-medium">Người lớn</Text>
                                                        </div>
                                                        <Text strong className="text-lg text-red-600 font-bold">
                                                            {formatPrice(schedule.price.adult)}
                                                        </Text>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                                                        <div className="flex items-center gap-2">
                                                            <Text className="font-medium">Trẻ em</Text>
                                                        </div>
                                                        <Text strong className="text-lg text-red-600 font-bold">
                                                            {formatPrice(schedule.price.child)}
                                                        </Text>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                                                        <div className="flex items-center gap-2">
                                                            <Text className="font-medium">Em bé</Text>
                                                        </div>
                                                        <Text strong className="text-lg text-red-600 font-bold">
                                                            {formatPrice(schedule.price.baby)}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Quick Book Button */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => handleBookTour(schedule)}
                                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl hover:from-blue-600 hover:to-purple-700 font-bold shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Chọn lịch trình này</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: '3',
            label: '🚗 Phương tiện',
            children: (
                <div>
                    <div className="mb-6 text-center">
                        <Title level={4} className="text-gray-700 font-bold">
                            Phương tiện di chuyển được sử dụng
                        </Title>
                        <Text className="text-gray-500">
                            Chúng tôi cung cấp đa dạng phương tiện để đảm bảo chuyến đi thoải mái nhất
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.transport?.map((transport, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 p-6 text-center">
                                    <div className="mb-4 relative">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                                            <div className="text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
                                                {getTransportIcon(transport)}
                                            </div>
                                        </div>
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <Text className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                                        {transport}
                                    </Text>

                                    {/* Decorative Line */}
                                    <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            key: '4',
            label: '⭐ Đánh giá',
            children: (
                <div className="space-y-6">
                    {/* Feedback Statistics */}
                    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            {/* Overall Rating */}
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-2">
                                    {getAverageRating().toFixed(1)}
                                </div>
                                <Rate disabled value={getAverageRating()} className="text-sm mb-2" />
                                <Text className="text-gray-600 text-sm">{feedback.length} đánh giá</Text>
                            </div>

                            {/* Rating Distribution */}
                            <div className="flex-1 w-full max-w-md">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = feedback.filter((f) => f.rating === star).length;
                                    const percentage = feedback.length > 0 ? (count / feedback.length) * 100 : 0;

                                    return (
                                        <div key={star} className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center gap-1 w-12">
                                                <span className="text-sm font-medium">{star}</span>
                                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            </div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Feedback List */}
                    {feedback.length > 0 ? (
                        <div className="space-y-3">
                            {feedback.map((review) => (
                                <div
                                    key={review._id}
                                    className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex gap-3">
                                        {/* User Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                {review.userId?.avatar ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${
                                                            review.userId.avatar
                                                        }`}
                                                        alt={review.userId.fullName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-xs">
                                                        {review.userId?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 text-sm">
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

                                            {/* Review Text */}
                                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {review.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <Title level={5} className="text-gray-500 mb-2 text-sm">
                                Chưa có đánh giá nào
                            </Title>
                            <Text className="text-gray-400 text-xs">Hãy là người đầu tiên đánh giá tour này!</Text>
                        </div>
                    )}

                    {/* Write Review CTA */}
                    {dataUser?._id && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 text-center">
                            <Title level={5} className="text-gray-800 mb-2 text-sm">
                                Bạn đã trải nghiệm tour này?
                            </Title>
                            <Text className="text-gray-600 mb-3 text-xs">
                                Chia sẻ cảm nhận của bạn để giúp những du khách khác!
                            </Text>
                            <Button
                                type="primary"
                                size="small"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-full px-4 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                onClick={() => {
                                    // Scroll to booking section or show booking modal
                                    handleBookTour();
                                }}
                            >
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    <span className="text-xs">Đặt tour để đánh giá</span>
                                </div>
                            </Button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
            <Header />
            <main>
                <div className="container mx-auto px-4 py-8 w-[95%]">
                    <Row gutter={[24, 24]}>
                        {/* Main Content - Image + Tour Info */}
                        <Col xs={24} lg={18} xl={18}>
                            <div className="space-y-6">
                                {/* Image Gallery */}
                                <div className="relative group">
                                    <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl">
                                        <div className="relative">
                                            <Carousel
                                                autoplay
                                                dots={{ className: 'custom-dots' }}
                                                className="rounded-3xl overflow-hidden"
                                            >
                                                {product.images?.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={`http://localhost:3000/uploads/products/${image}`}
                                                            alt={`${product.title} - ${index + 1}`}
                                                            className="w-full h-64 md:h-80 lg:h-96 xl:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                ))}
                                            </Carousel>
                                            {/* Image Counter Badge */}
                                            <div className="absolute top-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20">
                                                📸 {product.images?.length} ảnh
                                            </div>
                                            {/* Floating Action Buttons */}
                                            <div className="absolute bottom-6 right-6 flex gap-2">
                                                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                                                    <Share2 className="w-5 h-5 text-gray-700" />
                                                </div>
                                                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                                                    <Heart className="w-5 h-5 text-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Tour Information */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl border border-blue-100/50">
                                    {/* Decorative Background */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-20 translate-x-20"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100/20 to-red-100/20 rounded-full translate-y-16 -translate-x-16"></div>

                                    <div className="relative z-10 p-8">
                                        {/* Header */}
                                        <div className="mb-8">
                                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-semibold">{product.destination}</span>
                                                </div>
                                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse flex items-center gap-2">
                                                    ✨ <span className="font-semibold">Còn chỗ</span>
                                                </div>
                                                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                    🔥 <span className="font-semibold">Hot Deal</span>
                                                </div>
                                            </div>

                                            <h4 className="mb-6 text-xl md:text-2xl lg:text-xl xl:text-2xl bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent font-black leading-tight">
                                                {product.title}
                                            </h4>
                                        </div>

                                        {/* Info Grid */}
                                        <Row gutter={[16, 16]} className="mb-8">
                                            <Col xs={24} sm={12} md={8}>
                                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -translate-y-8 translate-x-8"></div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="p-2 bg-blue-500 rounded-full shadow-md">
                                                                <Clock className="w-5 h-5 text-white" />
                                                            </div>
                                                            <Text className="text-sm font-medium text-blue-700">
                                                                Thời gian tour
                                                            </Text>
                                                        </div>
                                                        <div className="font-bold text-gray-800 text-lg">
                                                            {product.departureSchedules?.[0] &&
                                                                `${moment(
                                                                    product.departureSchedules[0].departureDate,
                                                                ).format('DD/MM')} - 
                                                                 ${moment(
                                                                     product.departureSchedules[0].returnDate,
                                                                 ).format('DD/MM/YYYY')}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xs={24} sm={12} md={8}>
                                                <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -translate-y-8 translate-x-8"></div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="p-2 bg-green-500 rounded-full shadow-md">
                                                                <Users className="w-5 h-5 text-white" />
                                                            </div>
                                                            <Text className="text-sm font-medium text-green-700">
                                                                Chỗ trống
                                                            </Text>
                                                        </div>
                                                        <div className="font-bold text-gray-800 text-lg">
                                                            {product.departureSchedules?.[0]?.seatsAvailable} chỗ còn
                                                            lại
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xs={24} sm={12} md={8}>
                                                <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -translate-y-8 translate-x-8"></div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="p-2 bg-orange-500 rounded-full shadow-md">
                                                                <Star className="w-5 h-5 text-white" />
                                                            </div>
                                                            <Text className="text-sm font-medium text-orange-700">
                                                                Đánh giá
                                                            </Text>
                                                        </div>
                                                        <div className="font-bold text-gray-800 text-lg">
                                                            {getAverageRating()} ⭐ ({feedback.length} reviews)
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Tour Information - 1 cột */}

                        {/* Booking Card - 1 cột dọc */}
                        <Col xs={24} lg={6} xl={6}>
                            <div className="sticky top-25 space-y-6">
                                {/* Booking Card */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 rounded-3xl shadow-2xl border-0 transform hover:scale-[1.02] transition-all duration-300">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                                    <div className="relative z-10 p-6 text-white">
                                        <div className="flex items-center gap-3 mb-6">
                                            <h4 className="mb-0 text-white text-lg font-bold">
                                                Đặt tour ngay hôm nay!
                                            </h4>
                                        </div>

                                        {product.departureSchedules?.[0] && (
                                            <div className="space-y-6">
                                                {/* Price Display */}
                                                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                                    <div className="text-4xl font-black text-white mb-2">
                                                        {formatPrice(product.departureSchedules[0].price.adult)}
                                                    </div>
                                                    <div className="text-white/80 font-medium">/người lớn</div>
                                                </div>

                                                {/* Action Buttons */}
                                                <Space direction="vertical" className="w-full">
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        block
                                                        onClick={() => handleBookTour()}
                                                        className="h-14 bg-white text-red-500 border-white hover:bg-gray-50 hover:text-red-600 font-bold text-lg shadow-xl rounded-full transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        Đặt tour ngay
                                                    </Button>
                                                    <Button
                                                        size="large"
                                                        onClick={handleCreateFavourite}
                                                        block
                                                        className="h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
                                                    >
                                                        <Heart className="w-5 h-5" />
                                                        {/* Yêu thích */}
                                                        {favourite.some((f) => f.userId._id === dataUser?._id)
                                                            ? 'Đã yêu thích'
                                                            : 'Yêu thích'}
                                                    </Button>
                                                </Space>

                                                {/* Trust Indicators */}
                                                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/20">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-white">
                                                            {getAverageRating()}★
                                                        </div>
                                                        <div className="text-xs text-white/70">Đánh giá</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-white">24/7</div>
                                                        <div className="text-xs text-white/70">Hỗ trợ</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                                    <div className="relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-8 translate-x-8"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                                    <Phone className="w-4 h-4 text-white" />
                                                </div>
                                                <Title level={5} className="mb-0 text-gray-800 font-bold text-sm">
                                                    Liên hệ hỗ trợ 24/7
                                                </Title>
                                            </div>

                                            <Space direction="vertical" className="w-full">
                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                                                    <div className="p-1 bg-blue-500 rounded-full">
                                                        <Phone className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <Text className="text-xs text-gray-500 font-medium">
                                                            Hotline
                                                        </Text>
                                                        <div className="text-sm font-bold text-blue-700">1900 1234</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                                                    <div className="p-1 bg-green-500 rounded-full">
                                                        <Mail className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <Text className="text-xs text-gray-500 font-medium">Email</Text>
                                                        <div className="text-sm font-bold text-green-700">
                                                            support@tourdulich.com
                                                        </div>
                                                    </div>
                                                </div>
                                            </Space>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>

                    {/* Tabs Content - Full Width */}
                    <div className="pt-16">
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                            <Tabs defaultActiveKey="1" items={tabItems} />
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
            {/* Booking Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800">Đặt Tour Ngay</div>
                            <div className="text-sm text-gray-500">Chọn số lượng khách và lịch trình</div>
                        </div>
                    </div>
                }
                open={bookingModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
                className="booking-modal"
                closeIcon={<X className="w-5 h-5" />}
            >
                {selectedSchedule && (
                    <div className="py-4">
                        {/* Tour Info */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-4">
                                <img
                                    src={`http://localhost:3000/uploads/products/${product?.images?.[0]}`}
                                    alt={product?.title}
                                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                                        {product?.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{product?.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {moment(selectedSchedule.departureDate).format('DD/MM/YYYY')} -
                                                {moment(selectedSchedule.returnDate).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleBookingSubmit}
                            initialValues={{
                                adult: 1,
                                child: 0,
                                baby: 0,
                                scheduleId: selectedSchedule._id,
                            }}
                        >
                            {/* Schedule Selection */}
                            {product?.departureSchedules?.length > 1 && (
                                <Form.Item label="Lịch khởi hành" name="scheduleId">
                                    <Select
                                        size="large"
                                        defaultValue={product?.departureSchedules?.[0]?._id}
                                        onChange={(value) => {
                                            const schedule = product.departureSchedules.find((s) => s._id === value);
                                            setSelectedSchedule(schedule);
                                        }}
                                    >
                                        {product.departureSchedules.map((schedule) => (
                                            <Select.Option key={schedule._id} value={schedule._id}>
                                                <div className="flex justify-between items-center">
                                                    <span>
                                                        {moment(schedule.departureDate).format('DD/MM/YYYY')} -
                                                        {moment(schedule.returnDate).format('DD/MM/YYYY')}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Còn {schedule.seatsAvailable} chỗ
                                                    </span>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            {/* Quantity Selection */}
                            <div className="space-y-4 mb-6">
                                <div className="text-lg font-semibold text-gray-800 mb-4">Chọn số lượng khách</div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Adults */}
                                    <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div>
                                                <div className="font-semibold text-gray-800">Người lớn</div>
                                                <div className="text-sm text-gray-500">Từ 12 tuổi trở lên</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Form.Item name="adult" className="mb-0">
                                                <InputNumber
                                                    min={1}
                                                    max={10}
                                                    size="large"
                                                    className="w-20"
                                                    controls={{
                                                        upIcon: <Plus className="w-3 h-3" />,
                                                        downIcon: <Minus className="w-3 h-3" />,
                                                    }}
                                                />
                                            </Form.Item>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Giá</div>
                                                <div className="font-bold text-red-600">
                                                    {formatPrice(selectedSchedule.price.adult)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div>
                                                <div className="font-semibold text-gray-800">Trẻ em</div>
                                                <div className="text-sm text-gray-500">Từ 2-11 tuổi</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Form.Item name="child" className="mb-0">
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    size="large"
                                                    className="w-20"
                                                    controls={{
                                                        upIcon: <Plus className="w-3 h-3" />,
                                                        downIcon: <Minus className="w-3 h-3" />,
                                                    }}
                                                />
                                            </Form.Item>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Giá</div>
                                                <div className="font-bold text-red-600">
                                                    {formatPrice(selectedSchedule.price.child)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Babies */}
                                    <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div>
                                                <div className="font-semibold text-gray-800">Em bé</div>
                                                <div className="text-sm text-gray-500">Dưới 2 tuổi</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Form.Item name="baby" className="mb-0">
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    size="large"
                                                    className="w-20"
                                                    controls={{
                                                        upIcon: <Plus className="w-3 h-3" />,
                                                        downIcon: <Minus className="w-3 h-3" />,
                                                    }}
                                                />
                                            </Form.Item>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Giá</div>
                                                <div className="font-bold text-red-600">
                                                    {formatPrice(selectedSchedule.price.baby)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Price */}
                            <Form.Item noStyle shouldUpdate>
                                {(form) => {
                                    const values = form.getFieldsValue();
                                    const totalPrice = calculateTotalPrice(values);

                                    return (
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Tổng thanh toán</div>
                                                    <div className="text-3xl font-black text-red-600">
                                                        {formatPrice(totalPrice)}
                                                    </div>
                                                    {totalPrice > 0 && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {values.adult || 0} người lớn, {values.child || 0} trẻ em,{' '}
                                                            {values.baby || 0} em bé
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-6xl opacity-20">💰</div>
                                            </div>
                                        </div>
                                    );
                                }}
                            </Form.Item>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    size="large"
                                    onClick={handleModalClose}
                                    className="flex-1 h-12 rounded-full border-gray-300 hover:border-gray-400"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={bookingLoading}
                                    className="flex-2 h-12 bg-gradient-to-r from-red-500 to-pink-500 border-0 rounded-full hover:from-red-600 hover:to-pink-600 font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                    disabled={!form.getFieldValue('adult') || form.getFieldValue('adult') < 1}
                                >
                                    {bookingLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Spin size="small" />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Thêm vào giỏ hàng</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>
            {usersWatchingProduct.user &&
                usersWatchingProduct.productId === product._id &&
                usersWatchingProduct.user !== dataUser.fullName && <NotifyViewTour user={usersWatchingProduct.user} />}
        </div>
    );
}

export default DetailProduct;

// Add custom styles
const customStyles = `
<style>
.custom-dots .slick-dots {
    bottom: 20px !important;
    z-index: 10;
}

.custom-dots .slick-dots li button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.5) !important;
    border: 2px solid rgba(255, 255, 255, 0.8) !important;
    transition: all 0.3s ease !important;
}

.custom-dots .slick-dots li.slick-active button {
    background: white !important;
    transform: scale(1.2) !important;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8) !important;
}

.custom-dots .slick-dots li button:hover {
    background: rgba(255, 255, 255, 0.8) !important;
    transform: scale(1.1) !important;
}

/* Booking Modal Styles */
.booking-modal .ant-modal-content {
    border-radius: 24px !important;
    overflow: hidden !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.booking-modal .ant-modal-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    border-bottom: 1px solid #e2e8f0 !important;
    border-radius: 24px 24px 0 0 !important;
    padding: 24px !important;
}

.booking-modal .ant-modal-body {
    padding: 0 24px 24px 24px !important;
}

.booking-modal .ant-input-number {
    border-radius: 8px !important;
}

.booking-modal .ant-input-number:hover {
    border-color: #3b82f6 !important;
}

.booking-modal .ant-input-number:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Animated background */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

/* Gradient text animation */
@keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
}

/* Pulse effect for badges */
@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6); }
}

.pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
}

/* Modal animations */
@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.booking-modal .ant-modal {
    animation: modalSlideIn 0.3s ease-out;
}
</style>
`;

// Inject custom styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('div');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
}
