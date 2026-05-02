import { useEffect, useState } from 'react';
import { Card, Tag, Empty, Spin, Image, Typography, Divider, Row, Col, Button } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { requestGetPaymentByUserId } from '../../../config/PaymentRequest';
import ReviewModal from '../../../components/ReviewModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function HistoryOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await requestGetPaymentByUserId();
                if (res?.metadata) {
                    setOrders(res.metadata);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, []);

    const getPaymentStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xác nhận' },
            success: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
            completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
            failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Thất bại' },
            cancelled: { color: 'default', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Tag color={config.color} icon={config.icon} className="px-3 py-1 text-sm font-medium">
                {config.text}
            </Tag>
        );
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            vnpay: 'VNPay',
            momo: 'Momo',
            cash: 'Tiền mặt',
            bank: 'Chuyển khoản',
        };
        return methods[method] || method;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleOpenReviewModal = (order) => {
        setSelectedOrder(order);
        setReviewModalVisible(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalVisible(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <Card className="shadow-lg border border-gray-100 rounded-xl">
                <Empty description={<span className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</span>} />
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <Title level={2} className="!text-gray-800 !mb-2 !font-bold">
                    Lịch sử đặt tour
                </Title>
                <Text type="secondary" className="text-base">
                    Quản lý và theo dõi các tour đã đặt
                </Text>
            </div>

            {orders.map((order) => (
                <Card
                    key={order._id}
                    className="shadow-lg border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="mb-3 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarOutlined className="text-gray-500" />
                                <Text className="text-gray-600">
                                    Ngày đặt: {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Text>
                            </div>
                            <Text className="text-gray-500 text-sm">
                                Mã đơn:{' '}
                                <span className="font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                            </Text>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {getPaymentStatusTag(order.paymentStatus)}
                            <Tag color="blue" className="px-3 py-1">
                                {getPaymentMethodText(order.paymentMethod)}
                            </Tag>
                            {order.paymentStatus === 'completed' && order.items && order.items.length > 0 && (
                                <Button
                                    type="primary"
                                    className="!bg-[#FF3B2F] hover:!bg-[#E62E24] border-0"
                                    onClick={() => handleOpenReviewModal(order)}
                                >
                                    Đánh giá
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <Row gutter={[16, 12]}>
                            <Col xs={24} md={12}>
                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-gray-500" />
                                    <Text>
                                        <span className="font-semibold">Họ tên:</span> {order.fullName}
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div className="flex items-center gap-2">
                                    <PhoneOutlined className="text-gray-500" />
                                    <Text>
                                        <span className="font-semibold">SĐT:</span> {order.phone}
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24}>
                                <div className="flex items-start gap-2">
                                    <EnvironmentOutlined className="text-gray-500 mt-1" />
                                    <Text>
                                        <span className="font-semibold">Địa chỉ:</span> {order.address}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Tour Items */}
                    {order.items &&
                        order.items.map((item, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex gap-4">
                                    {/* Tour Image */}
                                    <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden">
                                        <Image
                                            src={
                                                item.product?.images?.[0]
                                                    ? `${import.meta.env.VITE_API_URL}/uploads/products/${
                                                          item.product.images[0]
                                                      }`
                                                    : 'https://via.placeholder.com/200'
                                            }
                                            alt={item.product?.title}
                                            className="w-full h-full object-cover"
                                            preview={{
                                                mask: 'Xem ảnh',
                                            }}
                                        />
                                    </div>

                                    {/* Tour Info */}
                                    <div className="flex-1 min-w-0">
                                        <Title level={5} className="!mb-2 !font-bold text-gray-800 line-clamp-2">
                                            {item.product?.title}
                                        </Title>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">Điểm đến:</span>
                                                <Tag color="blue">{item.product?.destination}</Tag>
                                            </div>

                                            {/* Quantity */}
                                            <div className="flex flex-wrap gap-3 text-gray-600">
                                                {item.quantity?.adult > 0 && (
                                                    <span>
                                                        Người lớn: <strong>{item.quantity.adult}</strong>
                                                    </span>
                                                )}
                                                {item.quantity?.child > 0 && (
                                                    <span>
                                                        Trẻ em: <strong>{item.quantity.child}</strong>
                                                    </span>
                                                )}
                                                {item.quantity?.baby > 0 && (
                                                    <span>
                                                        Em bé: <strong>{item.quantity.baby}</strong>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-base">
                                                    <span className="text-gray-500">Giá:</span>
                                                    <span className="text-[#FF3B2F] font-bold text-lg">
                                                        {formatCurrency(item.totalItemPrice)}
                                                    </span>
                                                </div>
                                                {order.paymentStatus === 'completed' && (
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        className="!bg-[#FF3B2F] hover:!bg-[#E62E24] border-0"
                                                        onClick={() => handleOpenReviewModal(order)}
                                                    >
                                                        Đánh giá
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {index < order.items.length - 1 && <Divider className="my-4" />}
                            </div>
                        ))}

                    {/* Order Total */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Text className="text-gray-600 block mb-1">Tổng thanh toán</Text>
                                {order.nameCounpon && (
                                    <Tag color="green" className="text-xs">
                                        Đã áp dụng mã: {order.nameCounpon}
                                    </Tag>
                                )}
                            </div>
                            <Text className="text-[#FF3B2F] font-bold text-2xl">
                                {formatCurrency(order.totalCartPrice)}
                            </Text>
                        </div>
                    </div>

                    {/* Actions */}
                    {order.paymentStatus === 'success' && (
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                            <Button type="default" className="hover:border-[#FF3B2F] hover:text-[#FF3B2F]">
                                Đánh giá
                            </Button>
                            <Button type="primary" className="!bg-[#FF3B2F] hover:!bg-[#E62E24] border-0">
                                Đặt lại tour
                            </Button>
                        </div>
                    )}
                </Card>
            ))}

            {/* Review Modal */}
            <ReviewModal visible={reviewModalVisible} onClose={handleCloseReviewModal} order={selectedOrder} />
        </div>
    );
}

export default HistoryOrder;
