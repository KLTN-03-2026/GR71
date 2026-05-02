import { useEffect, useState } from 'react';
import { requestGetFlashSaleByDate } from '../config/flashSale';
import CardBody from './CardBody';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function FlashSale() {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const fetchFlashSale = async () => {
            try {
                setLoading(true);
                const res = await requestGetFlashSaleByDate();
                setFlashSales(res.metadata);

                // Calculate days left if there are flash sales
                if (res.metadata && res.metadata.length > 0) {
                    const endDate = new Date(res.metadata[0].endDate);
                    calculateDaysLeft(endDate);
                }
            } catch (error) {
                console.error('Error fetching flash sales:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlashSale();
    }, []);

    // Update days left once per day
    useEffect(() => {
        if (flashSales.length === 0) return;

        const endDate = new Date(flashSales[0].endDate);
        const timer = setInterval(() => {
            calculateDaysLeft(endDate);
        }, 86400000); // Update every 24 hours

        return () => clearInterval(timer);
    }, [flashSales]);

    const calculateDaysLeft = (endDate) => {
        const difference = endDate - new Date();
        if (difference <= 0) {
            setDaysLeft(0);
            return;
        }

        setDaysLeft(Math.ceil(difference / (1000 * 60 * 60 * 24)));
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (flashSales.length === 0) {
        return null;
    }

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 opacity-70 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

            <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <motion.div
                                initial={{ rotate: -5, scale: 1 }}
                                animate={{ rotate: 5, scale: 1.1 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.7 }}
                                className="text-4xl"
                            >
                                🔥
                            </motion.div>
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                                initial={{ opacity: 0.5, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.2 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2 }}
                            />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                                Flash Sale
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base">Ưu đãi đặc biệt, thời gian có hạn</p>
                        </div>
                    </div>

                    {/* Countdown and CTA */}
                </div>

                {/* Flash Sale Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {flashSales.map((item) => (
                        <div
                            key={item._id}
                            className="relative group transform transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Flash Sale Animation */}
                            <motion.div
                                className="absolute inset-0 rounded-xl z-0 opacity-70"
                                initial={{ boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' }}
                                animate={{ boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />

                            <div className="relative z-10 overflow-hidden rounded-xl">
                                <CardBody tour={item.productId} />
                            </div>

                            {/* Original Price and Discounted Price */}
                            {item.productId?.departureSchedules?.[0]?.price?.adult && (
                                <div className="absolute top-20 left-0 z-20">
                                    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-r-lg shadow-lg">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white/80 line-through">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    item.productId.departureSchedules[0].price.adult,
                                                )}
                                                ₫
                                            </span>
                                            <span className="text-lg font-bold">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    Math.round(
                                                        item.productId.departureSchedules[0].price.adult *
                                                            (1 - item.discount / 100),
                                                    ),
                                                )}
                                                ₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* "Flash Sale" label */}
                            <div className="absolute top-4 left-4 z-20">
                                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-yellow-500 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-800">Flash Sale</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FlashSale;
