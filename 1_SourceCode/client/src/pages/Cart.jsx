import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useStore } from '../hooks/useStore';
import { requestUpdateCartItem, requestDeleteCartItem, requestApplyCoupon } from '../config/CartRequest';
import { Card, Button, Typography, Row, Col, InputNumber, Divider, Popconfirm, Empty, Spin } from 'antd';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Calendar, CreditCard, ArrowRight, Heart, Star } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

function Cart() {
    const navigate = useNavigate();
    const { dataUser, counpon, fetchCart, dataCart } = useStore();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (!dataUser._id) {
            navigate('/login');
        }
    }, [dataUser._id]);

    useEffect(() => {
        if (dataUser?._id) {
            fetchCart();
            setLoading(false);
            setCart(dataCart);
        }
    }, [dataUser]);

    useEffect(() => {
        if (cart) {
            setTotalAmount(cart.totalCartPrice);
        }
    }, [cart]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleApplyDiscount = async (code) => {
        const foundCoupon = counpon?.find((item) => item.nameCoupon === code);
        if (foundCoupon) {
            setSelectedCoupon(foundCoupon);

            if (cart && cart.totalCartPrice) {
                // giảm theo %
                const discountValue = (cart.totalCartPrice * foundCoupon.discount) / 100;
                setDiscount(discountValue);
                setTotalAmount(cart.totalCartPrice - discountValue);
            }

            await requestApplyCoupon({ nameCoupon: foundCoupon.nameCoupon });

            toast.success(`Áp dụng mã ${foundCoupon.nameCoupon} - Giảm ${foundCoupon.discount}%`);
            fetchCart();
        } else {
            setSelectedCoupon(null);
            setDiscount(0);

            if (cart && cart.totalCartPrice) {
                setTotalAmount(cart.totalCartPrice);
            }

            toast.error('Mã giảm giá không hợp lệ');
        }
    };

    const updateQuantity = async (itemId, type, newValue) => {
        try {
            setUpdating((prev) => ({ ...prev, [itemId]: true }));

            // Find current item
            const currentItem = cart.items.find((item) => item._id === itemId);
            if (!currentItem) return;

            const newQuantity = {
                adult: currentItem.quantity.adult,
                child: currentItem.quantity.child,
                baby: currentItem.quantity.baby,
                [type]: newValue,
            };

            // Prevent all quantities from being 0
            if (newQuantity.adult === 0 && newQuantity.child === 0 && newQuantity.baby === 0) {
                toast.warning('Cần ít nhất 1 người để giữ lại item');
                return;
            }

            // Update local state immediately
            const updatedCart = {
                ...cart,
                items: cart.items.map((item) => {
                    if (item._id === itemId) {
                        const updatedQuantity = newQuantity;
                        const newTotalPrice =
                            updatedQuantity.adult * item.priceSnapshot.adult +
                            updatedQuantity.child * item.priceSnapshot.child +
                            updatedQuantity.baby * item.priceSnapshot.baby;

                        return {
                            ...item,
                            quantity: updatedQuantity,
                            totalItemPrice: newTotalPrice,
                        };
                    }
                    return item;
                }),
            };

            updatedCart.totalCartPrice = updatedCart.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
            setCart(updatedCart);

            // Recalculate discount if coupon is applied
            if (selectedCoupon) {
                const newDiscount = (updatedCart.totalCartPrice * selectedCoupon.discount) / 100;
                setDiscount(newDiscount);
                setTotalAmount(updatedCart.totalCartPrice - newDiscount);
            }

            // TODO: Call API to update on backend
            await requestUpdateCartItem({ itemId, quantity: newQuantity, nameCounpon: selectedCoupon?.nameCoupon });
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Không thể cập nhật số lượng');
            fetchCart(); // Refresh cart on error
        } finally {
            setUpdating((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const deleteItem = async (itemId) => {
        try {
            const updatedCart = {
                ...cart,
                items: cart.items.filter((item) => item._id !== itemId),
            };
            updatedCart.totalCartPrice = updatedCart.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
            setCart(updatedCart);

            // Recalculate discount if coupon is applied
            if (selectedCoupon) {
                const newDiscount = (updatedCart.totalCartPrice * selectedCoupon.discount) / 100;
                setDiscount(newDiscount);
                setTotalAmount(updatedCart.totalCartPrice - newDiscount);
            }

            // TODO: Call API to delete item on backend
            await requestDeleteCartItem(itemId);
            await fetchCart();
            toast.success('Đã xóa tour khỏi giỏ hàng');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Không thể xóa item');
            fetchCart(); // Refresh on error
        }
    };

    const handleCheckout = () => {
        if (!cart?.items?.length) {
            toast.warning('Giỏ hàng trống!');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
                    <div className="text-center">
                        <Spin size="large" />
                        <div className="mt-4">
                            <Text className="text-gray-600">Đang tải giỏ hàng...</Text>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
            <Header />

            <main className="container mx-auto px-3 py-4">
                {/* Page Header */}
                <div className="mb-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <Title
                            level={2}
                            className="mb-0 text-xl md:text-2xl bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent"
                        >
                            Giỏ hàng của tôi
                        </Title>
                    </div>
                    {cart?.items?.length > 0 && (
                        <Text className="text-gray-600 text-sm">Bạn có {cart.items.length} tour trong giỏ hàng</Text>
                    )}
                </div>
                {console.log(cart)}

                {!cart?.items?.length ? (
                    /* Empty Cart */
                    <Card className="text-center py-8 shadow-lg border-0 rounded-2xl bg-white/80 backdrop-blur-sm">
                        <Empty
                            image={
                                <div className="flex justify-center mb-3">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>
                            }
                            description={
                                <div className="space-y-2">
                                    <Title level={4} className="text-gray-600">
                                        Giỏ hàng trống
                                    </Title>
                                    <Text className="text-gray-500 text-sm">
                                        Hãy khám phá những tour du lịch tuyệt vời và thêm vào giỏ hàng!
                                    </Text>
                                </div>
                            }
                        />
                        <Button
                            type="primary"
                            size="middle"
                            onClick={() => navigate('/')}
                            className="mt-4 h-10 px-6 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-full hover:from-blue-600 hover:to-purple-700 font-semibold text-sm shadow-md transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                <span>Khám phá tours</span>
                            </div>
                        </Button>
                    </Card>
                ) : (
                    <Row gutter={[16, 16]}>
                        {/* Cart Items */}
                        <Col xs={24} lg={16}>
                            <div className="space-y-3">
                                {cart.items.map((item, index) => (
                                    <Card
                                        key={item._id}
                                        className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                                    >
                                        <div className="p-3">
                                            <Row gutter={[12, 12]}>
                                                <Col xs={24} md={6}>
                                                    <div className="relative">
                                                        <img
                                                            src={`http://localhost:3000/uploads/products/${item.product.images[0]}`}
                                                            alt={item.product.title}
                                                            className="w-full h-24 md:h-20 object-cover rounded-lg shadow-sm"
                                                        />
                                                        <div className="absolute top-1 left-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                                            #{index + 1}
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xs={24} md={18}>
                                                    <div className="h-full flex flex-col">
                                                        <div className="flex-1 space-y-2">
                                                            <div>
                                                                <Title
                                                                    level={5}
                                                                    className="mb-1 text-sm font-bold text-gray-800 line-clamp-2"
                                                                >
                                                                    {item.product.title}
                                                                </Title>

                                                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span>{item.product.destination}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {(() => {
                                                                            const schedule =
                                                                                item.product.departureSchedules.find(
                                                                                    (s) =>
                                                                                        s._id ===
                                                                                        item.departureScheduleId,
                                                                                );
                                                                            return schedule ? (
                                                                                <span>
                                                                                    {moment(
                                                                                        schedule.departureDate,
                                                                                    ).format('DD/MM')}{' '}
                                                                                    -
                                                                                    {moment(schedule.returnDate).format(
                                                                                        'DD/MM/YYYY',
                                                                                    )}
                                                                                </span>
                                                                            ) : null;
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Quantity Controls */}
                                                            <div className="grid grid-cols-3 gap-1">
                                                                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs font-medium">
                                                                            Người lớn
                                                                        </span>
                                                                    </div>
                                                                    <InputNumber
                                                                        min={0}
                                                                        max={20}
                                                                        value={item.quantity.adult}
                                                                        onChange={(value) =>
                                                                            updateQuantity(
                                                                                item._id,
                                                                                'adult',
                                                                                value || 0,
                                                                            )
                                                                        }
                                                                        size="lg"
                                                                        className="w-12"
                                                                        controls={{
                                                                            upIcon: <Plus className="w-2 h-2" />,
                                                                            downIcon: <Minus className="w-2 h-2" />,
                                                                        }}
                                                                        disabled={updating[item._id]}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs font-medium">
                                                                            Trẻ em
                                                                        </span>
                                                                    </div>
                                                                    <InputNumber
                                                                        min={0}
                                                                        max={20}
                                                                        value={item.quantity.child}
                                                                        onChange={(value) =>
                                                                            updateQuantity(
                                                                                item._id,
                                                                                'child',
                                                                                value || 0,
                                                                            )
                                                                        }
                                                                        size="small"
                                                                        className="w-12"
                                                                        controls={{
                                                                            upIcon: <Plus className="w-2 h-2" />,
                                                                            downIcon: <Minus className="w-2 h-2" />,
                                                                        }}
                                                                        disabled={updating[item._id]}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs font-medium">
                                                                            Em bé
                                                                        </span>
                                                                    </div>
                                                                    <InputNumber
                                                                        min={0}
                                                                        max={20}
                                                                        value={item.quantity.baby}
                                                                        onChange={(value) =>
                                                                            updateQuantity(item._id, 'baby', value || 0)
                                                                        }
                                                                        size="lg"
                                                                        className="w-12"
                                                                        controls={{
                                                                            upIcon: <Plus className="w-2 h-2" />,
                                                                            downIcon: <Minus className="w-2 h-2" />,
                                                                        }}
                                                                        disabled={updating[item._id]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Price and Actions */}
                                                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                                                            <div>
                                                                <div className="text-xs text-gray-500">Thành tiền</div>
                                                                <div className="text-lg font-bold text-red-600">
                                                                    {formatPrice(item.totalItemPrice)}
                                                                </div>
                                                            </div>

                                                            <Popconfirm
                                                                title="Xóa tour khỏi giỏ hàng?"
                                                                description="Bạn có chắc chắn muốn xóa tour này không?"
                                                                onConfirm={() => deleteItem(item._id)}
                                                                okText="Xóa"
                                                                cancelText="Hủy"
                                                                okButtonProps={{ danger: true }}
                                                            >
                                                                <Button
                                                                    danger
                                                                    size="lg"
                                                                    className="flex items-center gap-1 rounded-lg px-2 hover:shadow-sm transition-all duration-300"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    <span className="text-xs">Xóa</span>
                                                                </Button>
                                                            </Popconfirm>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Col>

                        {/* Cart Summary */}
                        <Col xs={24} lg={8}>
                            <div className="sticky top-4 space-y-3">
                                {/* Summary Card */}
                                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                                    <div className="relative p-3">
                                        <div className="relative z-10">
                                            <Title level={5} className="text-sm font-bold text-gray-800 mb-3">
                                                Tóm tắt đơn hàng
                                            </Title>

                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-base text-gray-600">
                                                    <span>Số lượng tour:</span>
                                                    <span className="font-semibold">{cart.items.length}</span>
                                                </div>

                                                <div className="flex justify-between text-base text-gray-600">
                                                    <span>Tổng số người:</span>
                                                    <span className="font-semibold">
                                                        {cart.items.reduce(
                                                            (sum, item) =>
                                                                sum +
                                                                item.quantity.adult +
                                                                item.quantity.child +
                                                                item.quantity.baby,
                                                            0,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mb-3 text-base">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-base font-bold text-gray-800">
                                                            Mã giảm giá
                                                        </span>
                                                        {selectedCoupon && (
                                                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                Đã áp dụng
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-1">
                                                        {counpon?.map((item) => (
                                                            <span
                                                                key={item._id}
                                                                onClick={() => handleApplyDiscount(item.nameCoupon)}
                                                                className={`px-2 py-1 text-sm font-medium rounded-lg border cursor-pointer transition-all duration-200
                                                                    ${
                                                                        selectedCoupon?._id === item._id
                                                                            ? 'bg-green-500 text-white border-green-500 shadow-md transform scale-105'
                                                                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                                                                    }`}
                                                            >
                                                                {item.nameCoupon} -{item.discount}%
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Divider className="my-2" />

                                                {selectedCoupon && (
                                                    <div className="flex justify-between text-base text-green-600">
                                                        <span>Giảm giá ({selectedCoupon.discount}%):</span>
                                                        <span>-{formatPrice(discount)}</span>
                                                    </div>
                                                )}

                                                <Divider className="my-2" />

                                                <div className="flex justify-between text-2xl font-black text-red-600">
                                                    <span>Tổng cộng:</span>
                                                    <span>{formatPrice(totalAmount)}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Button
                                                    type="primary"
                                                    size="middle"
                                                    block
                                                    onClick={handleCheckout}
                                                    className="h-10 bg-gradient-to-r from-red-500 to-pink-500 border-0 rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold text-base shadow-md transform hover:scale-105 transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>Thanh toán</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                </Button>

                                                <Button
                                                    size="middle"
                                                    block
                                                    onClick={() => navigate('/')}
                                                    className="h-8 rounded-lg border-gray-300 hover:border-blue-400 transition-all duration-300 text-base"
                                                >
                                                    Tiếp tục mua sắm
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Promo Card */}
                                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                                    <div className="relative p-3">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-white/10 rounded-full -translate-y-5 translate-x-5"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4" />
                                                <span className="font-bold text-base">Ưu đãi đặc biệt</span>
                                            </div>

                                            <div className="space-y-1 text-base">
                                                <div>✓ Miễn phí hủy tour 24h</div>
                                                <div>✓ Bảo hiểm du lịch toàn diện</div>
                                                <div>✓ Hỗ trợ 24/7</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Cart;

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
