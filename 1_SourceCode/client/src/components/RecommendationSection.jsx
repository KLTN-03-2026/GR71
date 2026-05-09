import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Skeleton } from 'antd';
import CardBody from './CardBody';
import { requestGetRecommendations } from '../config/UserRequest';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

function RecommendationSection() {
    const [tours, setTours] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const fetchRecommendations = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await requestGetRecommendations();
            setTours(res.metadata?.tours || []);
            setMessage(res.metadata?.message || '');
        } catch {
            setTours([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton.Button active size="small" style={{ width: 200 }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} active paragraph={{ rows: 4 }} className="rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (tours.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true, margin: '-80px' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl mt-0.5 flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Gợi ý cho bạn</h3>
                        {message && (
                            <p className="text-sm text-gray-500 mt-0.5 max-w-xl">{message}</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => fetchRecommendations(true)}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors mt-1 flex-shrink-0"
                    title="Làm mới gợi ý"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Làm mới</span>
                </button>
            </div>

            {/* Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={shouldReduceMotion ? {} : containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                {tours.map((tour) => (
                    <motion.div
                        key={tour._id}
                        variants={shouldReduceMotion ? {} : itemVariants}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.04, transition: { duration: 0.2 } }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    >
                        <CardBody tour={tour} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default RecommendationSection;
