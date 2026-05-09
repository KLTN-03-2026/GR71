import { useEffect, useState } from 'react';
import { Tag, Spin, Empty, Rate, Tabs, Badge, Tooltip, Modal, Divider } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    PhoneOutlined,
    CreditCardOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    Plane,
    Bus,
    Train,
    Ship,
    Car,
    Hotel,
    MapPin,
    Calendar,
    Users,
    ChevronRight,
    Ticket,
    Clock,
    ArrowRight,
    Star,
    Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestGetPaymentByUserId } from '../config/PaymentRequest';
import { requestCheckUserReview } from '../config/Feedback';
import ReviewModal from '../components/ReviewModal';

/* ─── Helpers ─────────────────────────────────────── */
const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const transportIcon = (t) => {
    const map = {
        'Máy bay': <Plane className="w-4 h-4" />,
        'Xe bus': <Bus className="w-4 h-4" />,
        'Tàu hoả': <Train className="w-4 h-4" />,
        'Tàu thuỷ': <Ship className="w-4 h-4" />,
        'Xe limousine': <Car className="w-4 h-4" />,
    };
    return map[t] ?? <Bus className="w-4 h-4" />;
};

const STATUS_CONFIG = {
    pending: { color: 'orange', antColor: 'orange', icon: <ClockCircleOutlined />, label: 'Chờ xác nhận', step: 1 },
    success: { color: '#1677ff', antColor: 'blue', icon: <CheckCircleOutlined />, label: 'Đã xác nhận', step: 2 },
    completed: { color: '#52c41a', antColor: 'green', icon: <CheckCircleOutlined />, label: 'Hoàn thành', step: 3 },
    failed: { color: '#ff4d4f', antColor: 'red', icon: <CloseCircleOutlined />, label: 'Thất bại', step: 0 },
    cancelled: { color: '#8c8c8c', antColor: 'default', icon: <CloseCircleOutlined />, label: 'Đã hủy', step: 0 },
};

const PAYMENT_METHOD = { momo: 'MoMo', vnpay: 'VNPay', cash: 'Tiền mặt', bank: 'Chuyển khoản' };

/* ─── Itinerary Timeline ───────────────────────────── */
function ItineraryTimeline({ item }) {
    const schedule = item.product?.departureSchedules?.find((s) => String(s._id) === String(item.departureScheduleId));
    if (!schedule) return null;

    const depDate = dayjs(schedule.departureDate);
    const retDate = dayjs(schedule.returnDate);
    const nights = retDate.diff(depDate, 'day');

    return (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            {/* Departure — Return bar */}
            <div className="flex items-center gap-3">
                {/* Departure */}
                <div className="text-center min-w-[72px]">
                    <div className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-0.5">Khởi hành</div>
                    <div className="text-lg font-black text-blue-700">{depDate.format('DD/MM')}</div>
                    <div className="text-xs text-gray-500">{depDate.format('YYYY')}</div>
                    <div className="text-xs text-gray-400">{depDate.format('ddd')}</div>
                </div>

                {/* Line */}
                <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-indigo-600 font-semibold">
                        {nights} ngày {nights - 1} đêm
                    </div>
                    <div className="w-full flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="flex-1 border-t-2 border-dashed border-indigo-300 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                                {item.product?.transport?.slice(0, 3).map((t, i) => (
                                    <span key={i} className="text-indigo-400">
                                        {transportIcon(t)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                        {item.product?.transport?.map((t, i) => (
                            <span
                                key={i}
                                className="bg-white px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1"
                            >
                                {transportIcon(t)} {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Return */}
                <div className="text-center min-w-[72px]">
                    <div className="text-xs text-purple-500 font-semibold uppercase tracking-wide mb-0.5">Trở về</div>
                    <div className="text-lg font-black text-purple-700">{retDate.format('DD/MM')}</div>
                    <div className="text-xs text-gray-500">{retDate.format('YYYY')}</div>
                    <div className="text-xs text-gray-400">{retDate.format('ddd')}</div>
                </div>
            </div>

            {/* Hotel */}
            {schedule.hotel?.name && (
                <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{schedule.hotel.name}</span>
                    <Rate disabled value={schedule.hotel.stars} className="!text-xs ml-1" />
                </div>
            )}
        </div>
    );
}

/* ─── Status Steps ─────────────────────────────────── */
function StatusSteps({ status }) {
    const steps = [
        { key: 'pending', label: 'Đặt chỗ', icon: <Ticket className="w-4 h-4" /> },
        { key: 'success', label: 'Xác nhận', icon: <CheckCircleOutlined className="text-sm" /> },
        { key: 'completed', label: 'Hoàn thành', icon: <Star className="w-4 h-4" /> },
    ];

    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const activeStep = cfg.step;

    if (status === 'failed' || status === 'cancelled') {
        return (
            <div className="flex items-center gap-2">
                <Tag color={cfg.antColor} icon={cfg.icon} className="text-sm px-3 py-1">
                    {cfg.label}
                </Tag>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            {steps.map((s, i) => {
                const done = i < activeStep;
                const active = i === activeStep - 1;
                return (
                    <div key={s.key} className="flex items-center gap-1">
                        <div
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                                active
                                    ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                                    : done
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {s.icon} {s.label}
                        </div>
                        {i < steps.length - 1 && (
                            <ArrowRight className={`w-3 h-3 ${done ? 'text-green-400' : 'text-gray-300'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Booking Card ─────────────────────────────────── */
function BookingCard({ order, reviewedMap, onReview }) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const totalPassengers = order.items?.reduce(
        (acc, item) => acc + (item.quantity?.adult ?? 0) + (item.quantity?.child ?? 0) + (item.quantity?.baby ?? 0),
        0,
    );

    const allReviewed =
        order.paymentStatus === 'completed' &&
        order.items?.every((item) => reviewedMap[order._id]?.has(String(item.product?._id)));

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* ── Card Header ── */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarOutlined />
                        <span>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <Tag color="blue" className="text-xs">
                        {PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}
                    </Tag>
                </div>

                <div className="flex items-center gap-2">
                    <StatusSteps status={order.paymentStatus} />
                </div>
            </div>

            {/* ── Tour Items ── */}
            {order.items?.map((item, idx) => (
                <div key={idx} className={`px-6 py-5 ${idx > 0 ? 'border-t border-dashed border-gray-200' : ''}`}>
                    <div className="flex gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-md">
                            <img
                                src={
                                    item.product?.images?.[0]
                                        ? `${import.meta.env.VITE_API_URL}/uploads/products/${item.product.images[0]}`
                                        : 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'
                                }
                                alt={item.product?.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                onClick={() => navigate(`/detail-product/${item.product?._id}`)}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* Title + destination */}
                            <div>
                                <h3
                                    className="font-bold text-gray-800 text-base md:text-lg line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => navigate(`/detail-product/${item.product?._id}`)}
                                >
                                    {item.product?.title}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                                    <span>{item.product?.destination}</span>
                                </div>
                            </div>

                            {/* Itinerary timeline */}
                            <ItineraryTimeline item={item} />

                            {/* Passengers */}
                            <div className="flex flex-wrap gap-2 text-sm">
                                {item.quantity?.adult > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">
                                        <Users className="w-3.5 h-3.5" /> {item.quantity.adult} Người lớn
                                    </span>
                                )}
                                {item.quantity?.child > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium border border-purple-100">
                                        <Users className="w-3.5 h-3.5" /> {item.quantity.child} Trẻ em
                                    </span>
                                )}
                                {item.quantity?.baby > 0 && (
                                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1 rounded-full font-medium border border-pink-100">
                                        <Users className="w-3.5 h-3.5" /> {item.quantity.baby} Em bé
                                    </span>
                                )}
                            </div>

                            {/* Price breakdown for this item */}
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-400 space-y-0.5">
                                    {item.quantity?.adult > 0 && item.priceSnapshot?.adult > 0 && (
                                        <div>
                                            {item.quantity.adult} × {formatVND(item.priceSnapshot.adult)}
                                        </div>
                                    )}
                                    {item.quantity?.child > 0 && item.priceSnapshot?.child > 0 && (
                                        <div>
                                            {item.quantity.child} × {formatVND(item.priceSnapshot.child)}
                                        </div>
                                    )}
                                    {item.quantity?.baby > 0 && item.priceSnapshot?.baby > 0 && (
                                        <div>
                                            {item.quantity.baby} × {formatVND(item.priceSnapshot.baby)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-0.5">Thành tiền</div>
                                    <div className="text-xl font-black text-[#FF3B2F]">
                                        {formatVND(item.totalItemPrice)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* ── Expand: Customer Info ── */}
            {expanded && (
                <div className="px-6 pb-4 bg-gray-50/60 border-t border-dashed border-gray-200">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <UserOutlined className="text-gray-400" />
                            <span className="font-medium text-gray-700">{order.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <PhoneOutlined className="text-gray-400" />
                            <span>{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <EnvironmentOutlined className="text-gray-400" />
                            <span className="line-clamp-1">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <CreditCardOutlined className="text-gray-400" />
                            <span>{PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Card Footer ── */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50/60 to-red-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Total */}
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {totalPassengers} hành khách
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500">Tổng:</span>
                            <span className="text-2xl font-black text-[#FF3B2F]">
                                {formatVND(order.totalCartPrice)}
                            </span>
                        </div>
                        {order.nameCounpon && (
                            <Tag color="green" className="text-xs mt-1">
                                Mã giảm giá: {order.nameCounpon}
                            </Tag>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        {expanded ? 'Ẩn bớt' : 'Xem thêm'}
                    </button>

                    {order.paymentStatus === 'completed' &&
                        (allReviewed ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-xl">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Đã đánh giá
                            </span>
                        ) : (
                            <button
                                onClick={() => onReview(order)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] rounded-xl hover:from-[#E62E24] hover:to-[#FF5533] transition-all shadow-sm hover:shadow-md"
                            >
                                <Star className="w-4 h-4" /> Đánh giá tour
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ────────────────────────────────────── */
function Bookings() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [reviewedMap, setReviewedMap] = useState({});
    const [reviewOrder, setReviewOrder] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await requestGetPaymentByUserId();
            const data = res?.metadata ?? [];
            setOrders(data);

            const completed = data.filter((o) => o.paymentStatus === 'completed');
            const checks = await Promise.all(
                completed.map(async (o) => {
                    try {
                        const r = await requestCheckUserReview(o._id);
                        return {
                            paymentId: o._id,
                            ids: new Set((r?.metadata ?? []).map((f) => String(f.productId))),
                        };
                    } catch {
                        return { paymentId: o._id, ids: new Set() };
                    }
                }),
            );
            const map = {};
            checks.forEach(({ paymentId, ids }) => {
                map[paymentId] = ids;
            });
            setReviewedMap(map);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCloseReview = async () => {
        if (reviewOrder) {
            try {
                const r = await requestCheckUserReview(reviewOrder._id);
                const ids = new Set((r?.metadata ?? []).map((f) => String(f.productId)));
                setReviewedMap((prev) => ({ ...prev, [reviewOrder._id]: ids }));
            } catch {
                /* ignore */
            }
        }
        setReviewOrder(null);
    };

    const TAB_FILTERS = {
        all: () => true,
        pending: (o) => o.paymentStatus === 'pending',
        success: (o) => o.paymentStatus === 'success',
        completed: (o) => o.paymentStatus === 'completed',
        cancelled: (o) => ['cancelled', 'failed'].includes(o.paymentStatus),
    };

    const filtered = orders.filter(TAB_FILTERS[activeTab] ?? (() => true));

    const countByStatus = (key) => orders.filter(TAB_FILTERS[key]).length;

    const tabItems = [
        {
            key: 'all',
            label: (
                <span>
                    Tất cả <Badge count={orders.length} showZero color="#8c8c8c" />
                </span>
            ),
        },
        {
            key: 'pending',
            label: (
                <span>
                    Chờ xác nhận <Badge count={countByStatus('pending')} showZero color="orange" />
                </span>
            ),
        },
        {
            key: 'success',
            label: (
                <span>
                    Đã xác nhận <Badge count={countByStatus('success')} showZero color="blue" />
                </span>
            ),
        },
        {
            key: 'completed',
            label: (
                <span>
                    Hoàn thành <Badge count={countByStatus('completed')} showZero color="green" />
                </span>
            ),
        },
        {
            key: 'cancelled',
            label: (
                <span>
                    Đã hủy <Badge count={countByStatus('cancelled')} showZero color="default" />
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
            <Header />

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#FF3B2F] via-[#FF5722] to-[#FF6F4A] py-12 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-4">
                        <Ticket className="w-4 h-4" />
                        <span>Quản lý hành trình của bạn</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow">Đặt chỗ của tôi</h1>
                    <p className="text-white/80 text-base md:text-lg">
                        Theo dõi lịch trình, trạng thái và đánh giá tất cả các chuyến đi của bạn
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6 text-white/90 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-black">{orders.length}</div>
                            <div className="text-xs opacity-80">Tổng đặt chỗ</div>
                        </div>
                        <div className="w-px h-10 bg-white/30" />
                        <div className="text-center">
                            <div className="text-2xl font-black">{countByStatus('completed')}</div>
                            <div className="text-xs opacity-80">Hoàn thành</div>
                        </div>
                        <div className="w-px h-10 bg-white/30" />
                        <div className="text-center">
                            <div className="text-2xl font-black">{countByStatus('pending')}</div>
                            <div className="text-xs opacity-80">Chờ xác nhận</div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* ── Tabs ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        className="px-4"
                        size="large"
                    />
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Spin size="large" />
                        <span className="text-gray-400">Đang tải lịch trình của bạn...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-20">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="text-center">
                                    <p className="text-gray-500 text-base mb-1">Không có đặt chỗ nào</p>
                                    <p className="text-gray-400 text-sm">
                                        {activeTab === 'all'
                                            ? 'Hãy khám phá và đặt tour ngay!'
                                            : 'Không có đơn hàng nào trong trạng thái này.'}
                                    </p>
                                </div>
                            }
                        >
                            {activeTab === 'all' && (
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] text-white rounded-xl font-semibold hover:shadow-md transition-all"
                                >
                                    Khám phá tour <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </Empty>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filtered.map((order) => (
                            <BookingCard
                                key={order._id}
                                order={order}
                                reviewedMap={reviewedMap}
                                onReview={setReviewOrder}
                            />
                        ))}
                    </div>
                )}

                {/* ── CTA ── */}
                {orders.length > 0 && (
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] text-white rounded-2xl font-bold text-base hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Đặt thêm tour mới <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>

            <Footer />

            {/* ── Review Modal ── */}
            <ReviewModal
                visible={!!reviewOrder}
                onClose={handleCloseReview}
                order={reviewOrder}
                reviewedProductIds={reviewOrder ? (reviewedMap[reviewOrder._id] ?? new Set()) : new Set()}
            />
        </div>
    );
}

export default Bookings;
