import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../hooks/useStore';
// import { requestGetCartByUserId } from '../config/CartRequest';
import { Card, Button, Typography, Row, Col, Divider, Radio, Space, Spin, Form, Input } from 'antd';
import {
    CreditCard,
    ArrowLeft,
    MapPin,
    Calendar,
    Users,
    CheckCircle,
    Smartphone,
    User,
    Phone,
    Mail,
    MapPin as AddressIcon,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { requestCreatePayment } from '../config/PaymentRequest';
import { requestUpdateCartInfo } from '../config/CartRequest';

const { Title, Text } = Typography;

function Checkout() {
    const navigate = useNavigate();
    const { dataUser, dataCart } = useStore();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [processing, setProcessing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCart();
    }, [dataUser]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setCart(dataCart);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Không thể tải thông tin giỏ hàng');
            // navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const calculateDiscount = () => {
        if (cart?.nameCounpon) {
            // Giả sử có coupon 10% cho demo
            return (cart.totalCartPrice * 10) / 100;
        }
        return 0;
    };

    const getFinalAmount = () => {
        const discount = calculateDiscount();
        return cart.totalCartPrice - discount;
    };

    const handlePayment = async () => {
        if (!cart?.items?.length) {
            toast.warning('Giỏ hàng trống!');
            return;
        }

        try {
            // Validate form
            const values = await form.validateFields();

            await requestUpdateCartInfo(values);

            setProcessing(true);

            const data = {
                ...values,
                typePayment: paymentMethod,
            };

            if (paymentMethod === 'momo') {
                const res = await requestCreatePayment(data);
                window.location.href = res.metadata.payUrl;
            } else if (paymentMethod === 'vnpay') {
                const res = await requestCreatePayment(data);
                window.location.href = res.metadata;
            } else {
            }

            // Simulate payment processing
        } catch (error) {
            if (error.errorFields) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            } else {
                console.error('Payment error:', error);
                toast.error('Có lỗi xảy ra khi thanh toán');
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
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

    if (!cart?.items?.length) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
                    <Card className="text-center py-16 shadow-xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm">
                        <div className="space-y-4">
                            <Title level={3} className="text-gray-600">
                                Giỏ hàng trống
                            </Title>
                            <Text className="text-gray-500">Vui lòng thêm tour vào giỏ hàng trước khi thanh toán</Text>
                            <Button type="primary" onClick={() => navigate('/cart')} className="mt-4">
                                Quay lại giỏ hàng
                            </Button>
                        </div>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8 ">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <Title
                            level={1}
                            className="mb-0 text-3xl md:text-4xl bg-gradient-to-r from-gray-800 via-green-800 to-emerald-800 bg-clip-text text-transparent"
                        >
                            Thanh toán
                        </Title>
                    </div>
                    <Text className="text-gray-600 text-lg">Hoàn tất đơn hàng của bạn</Text>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Personal Information Form */}
                    <Col xs={24} lg={12}>
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="p-6">
                                <Title level={4} className="text-xl font-bold text-gray-800 mb-6">
                                    Thông tin cá nhân
                                </Title>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    requiredMark={false}
                                    initialValues={{
                                        fullName: dataUser?.fullName || '',
                                        phone: dataUser?.phone || '',
                                        email: dataUser?.email || '',
                                        address: dataUser?.address || '',
                                    }}
                                >
                                    <Form.Item
                                        name="fullName"
                                        label={
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-700 font-medium">Họ và tên</span>
                                                <span className="text-red-500">*</span>
                                            </div>
                                        }
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập họ và tên' },
                                            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Nhập họ và tên của bạn"
                                            className="rounded-xl border-gray-300 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="phone"
                                        label={
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-700 font-medium">Số điện thoại</span>
                                                <span className="text-red-500">*</span>
                                            </div>
                                        }
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Nhập số điện thoại"
                                            className="rounded-xl border-gray-300 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label={
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-700 font-medium">Email</span>
                                                <span className="text-red-500">*</span>
                                            </div>
                                        }
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Email không hợp lệ' },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Nhập địa chỉ email"
                                            className="rounded-xl border-gray-300 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="address"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                        label={
                                            <div className="flex items-center gap-2">
                                                <AddressIcon className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-700 font-medium">Địa chỉ</span>
                                            </div>
                                        }
                                    >
                                        <Input.TextArea
                                            size="large"
                                            placeholder="Nhập địa chỉ chi tiết"
                                            rows={3}
                                            className="rounded-xl border-gray-300 focus:border-blue-500"
                                        />
                                    </Form.Item>
                                </Form>

                                <Divider className="my-6" />

                                <Title level={4} className="text-xl font-bold text-gray-800 mb-6">
                                    Phương thức thanh toán
                                </Title>

                                <Radio.Group
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full"
                                >
                                    <Space direction="vertical" className="w-full">
                                        <Radio value="momo" className="w-full">
                                            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                                        alt=""
                                                        className="w-6 h-6"
                                                    />
                                                    <div className="font-semibold text-gray-800">MoMo</div>

                                                    <div className="text-sm text-gray-500">
                                                        Thanh toán qua ví điện tử MoMo
                                                    </div>
                                                </div>
                                            </div>
                                        </Radio>

                                        <Radio value="vnpay" className="w-full">
                                            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                                        alt=""
                                                        className="w-6 h-6"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">VNPay</div>
                                                    <div className="text-sm text-gray-500">
                                                        Thanh toán qua cổng VNPay
                                                    </div>
                                                </div>
                                            </div>
                                        </Radio>
                                    </Space>
                                </Radio.Group>

                                <Divider className="my-6" />

                                {/* Payment Button */}
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={processing}
                                    onClick={handlePayment}
                                    className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 border-0 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Spin size="small" />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="w-6 h-6" />
                                            <span>Thanh toán {formatPrice(getFinalAmount())}</span>
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    size="large"
                                    block
                                    onClick={() => navigate('/cart')}
                                    className="mt-4 h-12 rounded-xl border-gray-300 hover:border-blue-400 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Quay lại giỏ hàng</span>
                                    </div>
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    {/* Order Summary */}
                    <Col xs={24} lg={12}>
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="p-6">
                                <Title level={4} className="text-xl font-bold text-gray-800 mb-6">
                                    Thông tin đơn hàng
                                </Title>

                                <div className="space-y-4">
                                    {cart.items.map((item, index) => (
                                        <div key={item._id} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex gap-4">
                                                <img
                                                    src={`http://localhost:3000/uploads/products/${item.product.images[0]}`}
                                                    alt={item.product.title}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
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
                                        <span>{formatPrice(cart.totalCartPrice)}</span>
                                    </div>

                                    {cart.nameCounpon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá ({cart.nameCounpon}):</span>
                                            <span>-{formatPrice(calculateDiscount())}</span>
                                        </div>
                                    )}

                                    <Divider className="my-3" />

                                    <div className="flex justify-between text-2xl font-black text-red-600">
                                        <span>Tổng cộng:</span>
                                        <span>{formatPrice(getFinalAmount())}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Payment Method */}
                </Row>
            </main>

            <Footer />
        </div>
    );
}

export default Checkout;
// Add custom styles for line clamp
const customStyles = `
<style>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
`;

// Inject custom styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('div');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
}
