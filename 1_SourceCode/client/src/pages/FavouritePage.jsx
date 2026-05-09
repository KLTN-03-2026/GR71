import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spin, Empty, Badge, Select } from 'antd';
import { Heart, MapPin, Calendar, Users, Trash2, ExternalLink, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestGetFavouriteByUserId, requestRemoveFavourite } from '../config/FavouriteRequest';
import { useStore } from '../hooks/useStore';

function FavouriteCard({ item, onRemove }) {
    const tour = item.productId;
    const [removing, setRemoving] = useState(false);

    if (!tour) return null;

    const firstSchedule = tour.departureSchedules?.[0];

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getDuration = () => {
        if (!firstSchedule?.departureDate || !firstSchedule?.returnDate) return null;
        const diff = Math.ceil(
            Math.abs(new Date(firstSchedule.returnDate) - new Date(firstSchedule.departureDate)) /
                (1000 * 60 * 60 * 24),
        );
        return `${diff} ngày ${diff - 1} đêm`;
    };

    const isExpired = firstSchedule?.departureDate && new Date(firstSchedule.departureDate) < new Date();
    const noSeats = firstSchedule?.seatsAvailable === 0;
    const isUnavailable = isExpired || noSeats;

    const handleRemove = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setRemoving(true);
        try {
            await requestRemoveFavourite(tour._id);
            toast.info('Đã xóa khỏi danh sách yêu thích');
            onRemove(item._id);
        } catch {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 ${
                isUnavailable ? 'opacity-75' : ''
            }`}
        >
            {/* Ảnh */}
            <div className="relative overflow-hidden h-48">
                <Link to={`/detail-product/${tour._id}`}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/products/${tour.images?.[0]}`}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Tour';
                        }}
                    />
                </Link>

                {/* Overlay mờ nếu hết hạn */}
                {isUnavailable && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                            {isExpired ? 'Đã qua ngày khởi hành' : 'Hết chỗ'}
                        </span>
                    </div>
                )}

                {/* Badge trạng thái (khi còn khả dụng) */}
                {!isUnavailable && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                            Còn {firstSchedule.seatsAvailable} chỗ
                        </span>
                    </div>
                )}

                {/* Nút xóa - hover mới hiện */}
                <button
                    onClick={handleRemove}
                    disabled={removing}
                    title="Xóa khỏi yêu thích"
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    {removing ? (
                        <Spin size="small" />
                    ) : (
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                    )}
                </button>
            </div>

            {/* Nội dung card */}
            <div className="p-4">
                {/* Category badge */}
                {tour.category?.categoryName && (
                    <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2 font-medium">
                        {tour.category.categoryName}
                    </span>
                )}

                {/* Tên tour */}
                <Link to={`/detail-product/${tour._id}`}>
                    <h3 className="font-semibold text-gray-800 text-sm leading-5 line-clamp-2 min-h-[2.5rem] mb-3 hover:text-blue-600 transition-colors">
                        {tour.title}
                    </h3>
                </Link>

                {/* Thông tin chi tiết */}
                <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span className="font-medium">{tour.destination}</span>
                    </div>

                    {getDuration() && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span>{getDuration()}</span>
                            {firstSchedule?.departureDate && !isExpired && (
                                <span className="text-gray-400 truncate">
                                    · {moment(firstSchedule.departureDate).format('DD/MM/YYYY')}
                                </span>
                            )}
                        </div>
                    )}

                    {firstSchedule && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <Users className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <span className={isUnavailable ? 'text-red-400' : 'text-green-600 font-medium'}>
                                {isExpired
                                    ? 'Đã qua ngày khởi hành'
                                    : noSeats
                                    ? 'Hết chỗ'
                                    : `Còn ${firstSchedule.seatsAvailable} chỗ`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Giá + nút xem */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 leading-none mb-0.5">Từ</p>
                        <p className="text-red-500 font-bold text-base leading-none">
                            {formatPrice(firstSchedule?.price?.adult)}
                        </p>
                    </div>
                    <Link
                        to={`/detail-product/${tour._id}`}
                        className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-red-500 to-orange-400 text-white px-3.5 py-2 rounded-full hover:from-red-600 hover:to-orange-500 transition-all font-semibold shadow-sm hover:shadow-md"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Xem tour
                    </Link>
                </div>
            </div>

            {/* Thời gian lưu */}
            <div className="px-4 pb-3 -mt-1">
                <p className="text-[11px] text-gray-300">Đã lưu {moment(item.createdAt).fromNow()}</p>
            </div>
        </div>
    );
}

function FavouritePage() {
    const { dataUser } = useStore();
    const navigate = useNavigate();
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        if (!dataUser?._id) {
            navigate('/login');
            return;
        }
        fetchFavourites();
    }, [dataUser]);

    const fetchFavourites = async () => {
        try {
            setLoading(true);
            const res = await requestGetFavouriteByUserId();
            setFavourites(res.metadata || []);
        } catch {
            toast.error('Không thể tải danh sách yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (favouriteId) => {
        setFavourites((prev) => prev.filter((f) => f._id !== favouriteId));
    };

    // Lọc
    const getFiltered = () => {
        let result = [...favourites];

        if (filter === 'available') {
            result = result.filter((f) => {
                const s = f.productId?.departureSchedules?.[0];
                return s && new Date(s.departureDate) >= new Date() && s.seatsAvailable > 0;
            });
        } else if (filter === 'unavailable') {
            result = result.filter((f) => {
                const s = f.productId?.departureSchedules?.[0];
                return !s || new Date(s.departureDate) < new Date() || s.seatsAvailable === 0;
            });
        }

        // Sắp xếp
        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'price-asc') {
            result.sort(
                (a, b) =>
                    (a.productId?.departureSchedules?.[0]?.price?.adult || 0) -
                    (b.productId?.departureSchedules?.[0]?.price?.adult || 0),
            );
        } else if (sortBy === 'price-desc') {
            result.sort(
                (a, b) =>
                    (b.productId?.departureSchedules?.[0]?.price?.adult || 0) -
                    (a.productId?.departureSchedules?.[0]?.price?.adult || 0),
            );
        }

        return result;
    };

    const filtered = getFiltered();

    // Thống kê
    const countAvailable = favourites.filter((f) => {
        const s = f.productId?.departureSchedules?.[0];
        return s && new Date(s.departureDate) >= new Date() && s.seatsAvailable > 0;
    }).length;

    const countUnavailable = favourites.length - countAvailable;

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-orange-50/20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-red-500 transition-colors">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">Tour yêu thích</span>
                </div>

                {/* Page Header */}
                <div className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Heart className="w-8 h-8 fill-white text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black">Tour Yêu Thích</h1>
                                <p className="text-white/80 text-sm mt-1">
                                    Những tour bạn đã lưu để xem lại sau
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        {!loading && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-2xl font-black">{favourites.length}</span>
                                    <span className="text-white/80 text-sm ml-2">tour đã lưu</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-2xl font-black text-green-300">{countAvailable}</span>
                                    <span className="text-white/80 text-sm ml-2">còn đặt được</span>
                                </div>
                                {countUnavailable > 0 && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <span className="text-2xl font-black text-red-200">{countUnavailable}</span>
                                        <span className="text-white/80 text-sm ml-2">hết / qua hạn</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Toolbar: Filter + Sort */}
                {!loading && favourites.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        {/* Filter tabs */}
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            {[
                                { key: 'all', label: 'Tất cả', count: favourites.length },
                                { key: 'available', label: 'Còn đặt được', count: countAvailable },
                                { key: 'unavailable', label: 'Hết / Qua hạn', count: countUnavailable },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        filter === tab.key
                                            ? 'bg-white text-red-500 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                            filter === tab.key
                                                ? 'bg-red-100 text-red-500'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                size="middle"
                                className="w-44"
                                options={[
                                    { value: 'newest', label: 'Mới lưu nhất' },
                                    { value: 'oldest', label: 'Lưu lâu nhất' },
                                    { value: 'price-asc', label: 'Giá tăng dần' },
                                    { value: 'price-desc', label: 'Giá giảm dần' },
                                ]}
                            />
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Spin size="large" />
                        <p className="text-gray-400">Đang tải danh sách yêu thích...</p>
                    </div>
                )}

                {/* Empty — chưa có gì */}
                {!loading && favourites.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Heart className="w-14 h-14 text-red-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-3">Chưa có tour yêu thích</h2>
                        <p className="text-gray-400 max-w-sm mb-8">
                            Hãy khám phá các tour hấp dẫn và nhấn nút{' '}
                            <span className="text-red-400 font-semibold">Yêu thích</span> để lưu lại nhé!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-400 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Khám phá tour ngay
                        </Link>
                    </div>
                )}

                {/* Empty — filter không có kết quả */}
                {!loading && favourites.length > 0 && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Empty
                            description={
                                <span className="text-gray-400">Không có tour nào trong mục này</span>
                            }
                        />
                        <button
                            onClick={() => setFilter('all')}
                            className="mt-4 text-sm text-red-500 hover:underline"
                        >
                            Xem tất cả
                        </button>
                    </div>
                )}

                {/* Grid tours */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((item) => (
                            <FavouriteCard key={item._id} item={item} onRemove={handleRemove} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default FavouritePage;
