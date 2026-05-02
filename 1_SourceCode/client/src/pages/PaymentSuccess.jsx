import { useParams, useNavigate } from 'react-router-dom';
import { requestGetPaymentById } from '../config/PaymentRequest';
import { Card, Button, Typography, Row, Col, Divider, Tag, Spin, Space } from 'antd';
import { CheckCircle, User, Phone, Mail, MapPin, Calendar, Users, Home, Eye } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const { Title, Text } = Typography;

function PaymentSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await requestGetPaymentById(id);
                setPaymentData(res.metadata);
            } catch (error) {
                console.error('Error fetching payment:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'processing';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'momo':
                return 'MoMo';
            case 'vnpay':
                return 'VNPay';
            default:
                return method;
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Spin size="large" />
                        <div className="mt-4">
                            <Text className="text-gray-600">Đang tải thông tin thanh toán...</Text>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="text-center py-16 shadow-xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm">
                        <Title level={3} className="text-gray-600">
                            Không tìm thấy thông tin thanh toán
                        </Title>
                        <Button type="primary" onClick={() => navigate('/')} className="mt-4">
                            Về trang chủ
                        </Button>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <Title
                            level={1}
                            className="mb-0 text-3xl md:text-4xl bg-gradient-to-r from-gray-800 via-green-800 to-emerald-800 bg-clip-text text-transparent"
                        >
                            Thanh toán thành công!
                        </Title>
                    </div>
                    <Text className="text-gray-600 text-lg">
                        Cảm ơn bạn đã đặt tour. Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Customer Information */}
                    <Col xs={24} lg={8}>
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="p-6">
                                <Title level={4} className="text-xl font-bold text-gray-800 mb-6">
                                    Thông tin khách hàng
                                </Title>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <Text className="text-gray-500 text-sm">Họ và tên</Text>
                                            <div className="font-semibold text-gray-800">{paymentData.fullName}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <Text className="text-gray-500 text-sm">Số điện thoại</Text>
                                            <div className="font-semibold text-gray-800">{paymentData.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <Text className="text-gray-500 text-sm">Email</Text>
                                            <div className="font-semibold text-gray-800">{paymentData.email}</div>
                                        </div>
                                    </div>

                                    {paymentData.address && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <Text className="text-gray-500 text-sm">Địa chỉ</Text>
                                                <div className="font-semibold text-gray-800">{paymentData.address}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Divider className="my-6" />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Text className="text-gray-600">Mã đơn hàng:</Text>
                                        <Text className="font-mono font-bold text-blue-600">
                                            #{paymentData._id.slice(-8).toUpperCase()}
                                        </Text>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Text className="text-gray-600">Phương thức:</Text>
                                        <Tag color="blue">{getPaymentMethodName(paymentData.paymentMethod)}</Tag>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Text className="text-gray-600">Trạng thái:</Text>
                                        <Tag color={getPaymentStatusColor(paymentData.paymentStatus)}>
                                            {paymentData.paymentStatus === 'pending'
                                                ? 'Đang xử lý'
                                                : paymentData.paymentStatus === 'completed'
                                                ? 'Hoàn thành'
                                                : 'Thất bại'}
                                        </Tag>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Text className="text-gray-600">Ngày đặt:</Text>
                                        <Text className="font-semibold">
                                            {moment(paymentData.createdAt).format('DD/MM/YYYY HH:mm')}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Order Details */}
                    <Col xs={24} lg={16}>
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="p-6">
                                <Title level={4} className="text-xl font-bold text-gray-800 mb-6">
                                    Chi tiết đơn hàng
                                </Title>

                                <div className="space-y-6">
                                    {paymentData.items.map((item, index) => (
                                        <div key={item._id} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex gap-4">
                                                <img
                                                    src={`http://localhost:3000/uploads/products/${item.product.images[0]}`}
                                                    alt={item.product.title}
                                                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <Title
                                                        level={5}
                                                        className="mb-2 text-lg font-bold text-gray-800 line-clamp-2"
                                                    >
                                                        {item.product.title}
                                                    </Title>

                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{item.product.destination}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {(() => {
                                                                const schedule = item.product.departureSchedules.find(
                                                                    (s) => s._id === item.departureScheduleId,
                                                                );
                                                                return schedule ? (
                                                                    <span>
                                                                        {moment(schedule.departureDate).format(
                                                                            'DD/MM/YYYY',
                                                                        )}{' '}
                                                                        -
                                                                        {moment(schedule.returnDate).format(
                                                                            'DD/MM/YYYY',
                                                                        )}
                                                                    </span>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4" />
                                                            <span>
                                                                {item.quantity.adult} người lớn, {item.quantity.child}{' '}
                                                                trẻ em, {item.quantity.baby} em bé
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 text-right">
                                                        <Text className="text-lg font-bold text-red-600">
                                                            {formatPrice(item.totalItemPrice)}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Divider className="my-6" />

                                {/* Price Summary */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(paymentData.totalCartPrice)}</span>
                                    </div>

                                    {paymentData.nameCounpon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá ({paymentData.nameCounpon}):</span>
                                            <span>-{formatPrice((paymentData.totalCartPrice * 10) / 100)}</span>
                                        </div>
                                    )}

                                    <Divider className="my-3" />

                                    <div className="flex justify-between text-2xl font-black text-red-600">
                                        <span>Tổng cộng:</span>
                                        <span>
                                            {formatPrice(
                                                paymentData.nameCounpon
                                                    ? paymentData.totalCartPrice -
                                                          (paymentData.totalCartPrice * 10) / 100
                                                    : paymentData.totalCartPrice,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Action Buttons */}
                <div className="text-center mt-8">
                    <Space size="large">
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/')}
                            className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 border-0 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Home className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </div>
                        </Button>
                    </Space>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default PaymentSuccess;
