import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rate, Empty, Spin, Popconfirm } from 'antd';
import { Star, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { requestGetUserReviews, requestDeleteReview } from '../../../config/Feedback';

const RATING_LABELS = { 5: 'Tuyệt vời', 4: 'Tốt', 3: 'Bình thường', 2: 'Tệ', 1: 'Rất tệ' };

function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        setLoading(true);
        try {
            const res = await requestGetUserReviews();
            setReviews(res.metadata || []);
        } catch {
            toast.error('Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    const handleDelete = async (reviewId) => {
        try {
            await requestDeleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
            toast.success('Đã xóa đánh giá');
        } catch {
            toast.error('Xóa thất bại, vui lòng thử lại');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Spin size="large" />
                <p className="text-gray-400 text-sm">Đang tải đánh giá...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-yellow-100 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Đánh giá của tôi</h2>
                    <p className="text-sm text-gray-400">{reviews.length} đánh giá đã viết</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-5">
                        <MessageSquare className="w-12 h-12 text-yellow-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                        Hoàn thành một chuyến đi và chia sẻ trải nghiệm của bạn
                    </p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
                    >
                        Khám phá tour ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const tour = review.productId;
                        return (
                            <div
                                key={review._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex gap-4 p-4">
                                    {/* Tour image */}
                                    {tour && (
                                        <Link
                                            to={`/detail-product/${tour._id}`}
                                            className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden block"
                                        >
                                            <img
                                                src={
                                                    tour.images?.[0]
                                                        ? `${import.meta.env.VITE_API_URL}/uploads/products/${tour.images[0]}`
                                                        : 'https://placehold.co/80x80?text=Tour'
                                                }
                                                alt={tour.title}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Tour'; }}
                                            />
                                        </Link>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        {/* Tour name + actions */}
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="min-w-0">
                                                {tour ? (
                                                    <Link
                                                        to={`/detail-product/${tour._id}`}
                                                        className="font-semibold text-gray-800 text-sm line-clamp-1 hover:text-orange-500 transition-colors flex items-center gap-1 group"
                                                    >
                                                        {tour.title}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Tour không còn tồn tại</span>
                                                )}
                                                <p className="text-xs text-gray-400 mt-0.5">{tour?.destination}</p>
                                            </div>

                                            <Popconfirm
                                                title="Xóa đánh giá này?"
                                                description="Hành động này không thể hoàn tác."
                                                onConfirm={() => handleDelete(review._id)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <button className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </Popconfirm>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Rate disabled value={review.rating} className="text-xs !text-yellow-400" />
                                            <span className="text-xs font-medium text-yellow-600">
                                                {RATING_LABELS[review.rating]}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 bg-gray-50 rounded-lg p-2.5">
                                            {review.content}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">
                                            {moment(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyReviews;
