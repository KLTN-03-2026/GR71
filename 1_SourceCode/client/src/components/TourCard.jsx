import { Typography, Tag, Rate } from 'antd';
import { Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import moment from 'moment';

const { Title, Text } = Typography;

function TourCard({ tour }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            case 'pending':
                return 'orange';
            default:
                return 'blue';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            case 'pending':
                return 'Chờ xử lý';
            default:
                return 'Không xác định';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/30 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <img src={tour.image} alt={tour.title} className="w-20 h-20 object-cover rounded-2xl shadow-md" />
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <Title level={5} className="!mb-2 text-gray-800">
                                    {tour.title}
                                </Title>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{moment(tour.date).format('DD/MM/YYYY')}</span>
                                    </div>
                                    <div className="text-base font-semibold" style={{ color: '#FF3B2F' }}>
                                        {formatPrice(tour.price)}
                                    </div>
                                </div>
                            </div>
                            <Tag
                                color={getStatusColor(tour.status)}
                                className="px-2 py-1 rounded-full flex items-center gap-1 text-xs"
                            >
                                {getStatusIcon(tour.status)}
                                <span className="font-medium">{getStatusText(tour.status)}</span>
                            </Tag>
                        </div>

                        {tour.rating && tour.status === 'completed' && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <Text className="text-xs text-gray-600">Đánh giá của bạn:</Text>
                                <Rate disabled defaultValue={tour.rating} className="text-xs" />
                                <Text className="text-xs text-gray-600">({tour.rating}/5)</Text>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TourCard;

