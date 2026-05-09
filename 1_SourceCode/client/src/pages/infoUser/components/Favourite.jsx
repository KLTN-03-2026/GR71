import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestGetFavouriteByUserId, requestRemoveFavourite } from '../../../config/FavouriteRequest';
import { Spin, Empty, Badge } from 'antd';
import { Heart, MapPin, Calendar, Users, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';

function FavouriteCard({ item, onRemove }) {
    const tour = item.productId;
    const [removing, setRemoving] = useState(false);

    if (!tour) return null;

    const firstSchedule = tour.departureSchedules?.[0];

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const getDuration = () => {
        if (!firstSchedule?.departureDate || !firstSchedule?.returnDate) return null;
        const diff = Math.ceil(
            Math.abs(new Date(firstSchedule.returnDate) - new Date(firstSchedule.departureDate)) /
                (1000 * 60 * 60 * 24),
        );
        return `${diff} ngày ${diff - 1} đêm`;
    };

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

    const isExpired =
        firstSchedule?.departureDate && new Date(firstSchedule.departureDate) < new Date();
    const noSeats = firstSchedule?.seatsAvailable === 0;

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
            {/* Ảnh */}
            <div className="relative overflow-hidden">
                <Link to={`/detail-product/${tour._id}`}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/products/${tour.images?.[0]}`}
                        alt={tour.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400x200?text=Tour';
                        }}
                    />
                </Link>

                {/* Badge trạng thái */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {isExpired ? (
                        <span className="bg-gray-700/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            Đã qua
                        </span>
                    ) : noSeats ? (
                        <span className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            Hết chỗ
                        </span>
                    ) : (
                        <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            Còn chỗ
                        </span>
                    )}
                </div>

                {/* Nút xóa */}
                <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Xóa khỏi yêu thích"
                >
                    {removing ? (
                        <Spin size="small" />
                    ) : (
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                    )}
                </button>
            </div>

            {/* Nội dung */}
            <div className="p-4">
                {/* Category */}
                {tour.category?.categoryName && (
                    <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                        {tour.category.categoryName}
                    </span>
                )}

                {/* Tên tour */}
                <h3 className="font-semibold text-gray-800 text-sm leading-5 line-clamp-2 min-h-[2.5rem] mb-3">
                    {tour.title}
                </h3>

                <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                    {/* Điểm đến */}
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span>{tour.destination}</span>
                    </div>

                    {/* Thời gian */}
                    {getDuration() && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span>{getDuration()}</span>
                            {firstSchedule?.departureDate && !isExpired && (
                                <span className="text-gray-400">
                                    · Khởi hành {moment(firstSchedule.departureDate).format('DD/MM/YYYY')}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Chỗ còn */}
                    {firstSchedule && !isExpired && (
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <span
                                className={
                                    firstSchedule.seatsAvailable > 0 ? 'text-green-600' : 'text-red-500'
                                }
                            >
                                {firstSchedule.seatsAvailable > 0
                                    ? `Còn ${firstSchedule.seatsAvailable} chỗ`
                                    : 'Hết chỗ'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Giá + nút */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400">Từ</p>
                        <p className="text-red-500 font-bold text-base">
                            {formatPrice(firstSchedule?.price?.adult)}
                        </p>
                    </div>
                    <Link
                        to={`/detail-product/${tour._id}`}
                        className="flex items-center gap-1 text-xs bg-gradient-to-r from-red-500 to-orange-400 text-white px-3 py-2 rounded-full hover:from-red-600 hover:to-orange-500 transition-all font-medium shadow-sm hover:shadow-md"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Xem tour
                    </Link>
                </div>
            </div>

            {/* Ngày thêm vào yêu thích */}
            <div className="px-4 pb-3">
                <p className="text-[11px] text-gray-300">
                    Đã lưu {moment(item.createdAt).fromNow()}
                </p>
            </div>
        </div>
    );
}

function Favourite() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | available | expired

    useEffect(() => {
        fetchFavourites();
    }, []);

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

    const filtered = favourites.filter((item) => {
        if (filter === 'all') return true;
        const firstSchedule = item.productId?.departureSchedules?.[0];
        const isExpired = firstSchedule?.departureDate && new Date(firstSchedule.departureDate) < new Date();
        if (filter === 'available') return !isExpired && firstSchedule?.seatsAvailable > 0;
        if (filter === 'expired') return isExpired || firstSchedule?.seatsAvailable === 0;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
                <Spin size="large" />
                <p className="text-gray-400 text-sm">Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Tour yêu thích</h2>
                        <p className="text-sm text-gray-400">
                            {favourites.length} tour đã lưu
                        </p>
                    </div>
                </div>

                {/* Filter tabs */}
                {favourites.length > 0 && (
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                        {[
                            { key: 'all', label: 'Tất cả', count: favourites.length },
                            {
                                key: 'available',
                                label: 'Còn chỗ',
                                count: favourites.filter((f) => {
                                    const s = f.productId?.departureSchedules?.[0];
                                    return s && new Date(s.departureDate) >= new Date() && s.seatsAvailable > 0;
                                }).length,
                            },
                            {
                                key: 'expired',
                                label: 'Hết / Qua hạn',
                                count: favourites.filter((f) => {
                                    const s = f.productId?.departureSchedules?.[0];
                                    return !s || new Date(s.departureDate) < new Date() || s.seatsAvailable === 0;
                                }).length,
                            },
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
                                <Badge
                                    count={tab.count}
                                    style={{
                                        backgroundColor: filter === tab.key ? '#ef4444' : '#d1d5db',
                                        fontSize: '10px',
                                        height: '16px',
                                        minWidth: '16px',
                                        lineHeight: '16px',
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Empty state */}
            {favourites.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5">
                        <Heart className="w-12 h-12 text-red-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có tour yêu thích</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                        Hãy khám phá và lưu lại những tour bạn thích để xem lại sau
                    </p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-red-600 hover:to-orange-500 transition-all shadow-md hover:shadow-lg"
                    >
                        Khám phá tour ngay
                    </Link>
                </div>
            )}

            {/* Filtered empty */}
            {favourites.length > 0 && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Empty description={<span className="text-gray-400">Không có tour nào trong mục này</span>} />
                </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((item) => (
                        <FavouriteCard key={item._id} item={item} onRemove={handleRemove} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favourite;
