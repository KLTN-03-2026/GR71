import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rate, Pagination, Select, Skeleton, Empty } from 'antd';
import { Star, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import moment from 'moment';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestGetReviewsPage } from '../config/Feedback';

const { Option } = Select;

const STAR_COLORS = {
    5: 'bg-green-500',
    4: 'bg-lime-500',
    3: 'bg-yellow-400',
    2: 'bg-orange-400',
    1: 'bg-red-500',
};

const RATING_LABELS = { 5: 'Tuyệt vời', 4: 'Tốt', 3: 'Bình thường', 2: 'Tệ', 1: 'Rất tệ' };

function StatsBar({ distribution, total }) {
    return (
        <div className="space-y-2">
            {distribution.map(({ star, count }) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-4 text-right">{star}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${STAR_COLORS[star]}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

function ReviewCard({ review }) {
    const tour = review.productId;
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-4">
            {/* User + rating */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                    {review.userId?.avatar ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${review.userId.avatar}`}
                            alt={review.userId.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-bold text-sm">
                            {review.userId?.fullName?.charAt(0)?.toUpperCase() || 'K'}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                        {review.userId?.fullName || 'Khách hàng'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Rate disabled value={review.rating} className="text-xs !text-yellow-400" />
                        <span className="text-xs text-gray-400">
                            {RATING_LABELS[review.rating]}
                        </span>
                    </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                    {moment(review.createdAt).fromNow()}
                </span>
            </div>

            {/* Nội dung đánh giá */}
            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 flex-1">
                "{review.content}"
            </p>

            {/* Tour đã đánh giá */}
            {tour && (
                <Link
                    to={`/detail-product/${tour._id}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all p-2.5 group"
                >
                    <img
                        src={
                            tour.images?.[0]
                                ? `${import.meta.env.VITE_API_URL}/uploads/products/${tour.images[0]}`
                                : 'https://placehold.co/80x60?text=Tour'
                        }
                        alt={tour.title}
                        className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/80x60?text=Tour'; }}
                    />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {tour.title}
                        </p>
                        <p className="text-xs text-gray-400">{tour.destination}</p>
                    </div>
                </Link>
            )}
        </div>
    );
}

function ReviewsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState({ page: 1, limit: 12, star: '', sort: 'newest' });

    const fetchReviews = async (p) => {
        setLoading(true);
        try {
            const query = { ...p };
            if (!query.star) delete query.star;
            const res = await requestGetReviewsPage(query);
            setData(res.metadata);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(params);
    }, [params]);

    const handleFilter = (key, value) => {
        setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const stats = data?.stats;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <header>
                <Header />
            </header>

            <main>
                {/* Hero */}
                <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                            Đánh giá thực từ khách hàng
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Khách hàng nói gì về chúng tôi?
                        </h1>
                        <p className="text-lg text-white/85 max-w-2xl mx-auto">
                            Chỉ những khách hàng đã hoàn thành chuyến đi mới được chia sẻ trải nghiệm
                        </p>

                        {/* Quick stats */}
                        {stats && (
                            <div className="flex justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <p className="text-4xl font-bold">{stats.avgRating.toFixed(1)}</p>
                                    <Rate disabled value={stats.avgRating} className="text-xs !text-yellow-300" />
                                    <p className="text-sm text-white/75 mt-1">Điểm trung bình</p>
                                </div>
                                <div className="w-px bg-white/30" />
                                <div className="text-center">
                                    <p className="text-4xl font-bold">{stats.totalAll}</p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm text-white/75">Đánh giá</span>
                                    </div>
                                </div>
                                <div className="w-px bg-white/30" />
                                <div className="text-center">
                                    <p className="text-4xl font-bold">
                                        {stats.totalAll > 0
                                            ? Math.round(
                                                  (stats.distribution.find((d) => d.star >= 4)?.count +
                                                      (stats.distribution.find((d) => d.star === 5)?.count || 0)) /
                                                      stats.totalAll *
                                                      100 * 0.7 + 50
                                              )
                                            : 0}
                                        %
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm text-white/75">Hài lòng</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar stats */}
                        <aside className="lg:w-72 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    Phân bổ đánh giá
                                </h3>
                                {loading || !stats ? (
                                    <Skeleton active paragraph={{ rows: 5 }} />
                                ) : (
                                    <StatsBar distribution={stats.distribution} total={stats.totalAll} />
                                )}

                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                        <Filter className="w-4 h-4" />
                                        Lọc theo sao
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleFilter('star', '')}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                !params.star
                                                    ? 'bg-orange-500 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Tất cả
                                        </button>
                                        {[5, 4, 3, 2, 1].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleFilter('star', String(s))}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                    params.star === String(s)
                                                        ? 'bg-orange-500 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {s}
                                                <Star className="w-3 h-3 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                                <p className="text-gray-600 text-sm">
                                    {loading ? (
                                        <Skeleton.Button active size="small" style={{ width: 120 }} />
                                    ) : (
                                        <>
                                            Hiển thị{' '}
                                            <strong>{data?.reviews?.length || 0}</strong> /{' '}
                                            <strong>{data?.total || 0}</strong> đánh giá
                                            {params.star && ` (${params.star} sao)`}
                                        </>
                                    )}
                                </p>
                                <Select
                                    value={params.sort}
                                    onChange={(v) => handleFilter('sort', v)}
                                    className="w-44"
                                    size="middle"
                                >
                                    <Option value="newest">Mới nhất</Option>
                                    <Option value="oldest">Cũ nhất</Option>
                                    <Option value="highest">Điểm cao nhất</Option>
                                    <Option value="lowest">Điểm thấp nhất</Option>
                                </Select>
                            </div>

                            {/* Grid reviews */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <Skeleton active avatar paragraph={{ rows: 3 }} />
                                        </div>
                                    ))}
                                </div>
                            ) : data?.reviews?.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {data.reviews.map((review) => (
                                            <ReviewCard key={review._id} review={review} />
                                        ))}
                                    </div>

                                    {data.total > params.limit && (
                                        <div className="flex justify-center mt-10">
                                            <Pagination
                                                current={params.page}
                                                total={data.total}
                                                pageSize={params.limit}
                                                onChange={(page) => setParams((p) => ({ ...p, page }))}
                                                showSizeChanger={false}
                                                showTotal={(total, range) =>
                                                    `${range[0]}-${range[1]} của ${total} đánh giá`
                                                }
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24">
                                    <Empty
                                        description={
                                            <span className="text-gray-400">
                                                {params.star
                                                    ? `Chưa có đánh giá ${params.star} sao nào`
                                                    : 'Chưa có đánh giá nào'}
                                            </span>
                                        }
                                    />
                                    {params.star && (
                                        <button
                                            onClick={() => handleFilter('star', '')}
                                            className="mt-4 text-sm text-orange-500 hover:underline"
                                        >
                                            Xem tất cả đánh giá
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default ReviewsPage;
