import { useEffect, useState } from 'react';
import CustomButton from './button/CustomButton';
import { requestGetAllTour } from '../config/TourRequest';
import CardBody from './CardBody';
import { useStore } from '../hooks/useStore';
import RecommendationSection from './RecommendationSection';
import { motion, useReducedMotion } from 'framer-motion';

import { Pagination } from 'antd';

function ProductHome() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // Kiểm tra user preference cho reduced motion
    const shouldReduceMotion = useReducedMotion();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion
                ? { duration: 0.3 }
                : {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                  },
        },
    };

    const itemVariants = {
        hidden: shouldReduceMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  y: 30,
                  scale: 0.9,
              },
        visible: shouldReduceMotion
            ? { opacity: 1 }
            : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                  },
              },
    };

    const headerVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.3 : 0.6,
                ease: 'easeOut',
            },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllTour();
            setProducts(res.metadata);
        };
        fetchData();
    }, []);

    const { dataUser } = useStore();

    const getCurrentPageData = (data, page) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentProducts = getCurrentPageData(products, currentPage);

    return (
        <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-9">
            {/* Tour nổi bật */}
            <motion.div
                className="flex items-center justify-between"
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <h3 className="text-2xl font-bold">Tour nổi bật</h3>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                {currentProducts.map((product, index) => (
                    <motion.div
                        key={product._id}
                        variants={itemVariants}
                        whileHover={
                            shouldReduceMotion
                                ? {}
                                : {
                                      scale: 1.05,
                                      transition: { duration: 0.2 },
                                  }
                        }
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    >
                        <CardBody tour={product} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination cho tour nổi bật */}
            {products.length > pageSize && (
                <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5 },
                    }}
                    viewport={{ once: true }}
                >
                    <Pagination
                        current={currentPage}
                        total={products.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        className="custom-pagination"
                    />
                </motion.div>
            )}

            {/* Gợi ý cá nhân hoá */}
            {dataUser._id && <RecommendationSection />}

            {/* Custom CSS cho pagination */}
            <style jsx>{`
                .custom-pagination .ant-pagination-item {
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                    transition: all 0.3s ease;
                }

                .custom-pagination .ant-pagination-item:hover {
                    border-color: #ff3b2f;
                    transform: translateY(-1px);
                }

                .custom-pagination .ant-pagination-item-active {
                    background: linear-gradient(135deg, #ff3b2f 0%, #ff6f4a 100%);
                    border-color: #ff3b2f;
                }

                .custom-pagination .ant-pagination-item-active a {
                    color: white;
                }

                .custom-pagination .ant-pagination-prev,
                .custom-pagination .ant-pagination-next {
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                    transition: all 0.3s ease;
                }

                .custom-pagination .ant-pagination-prev:hover,
                .custom-pagination .ant-pagination-next:hover {
                    border-color: #ff3b2f;
                    color: #ff3b2f;
                }

                .custom-pagination .ant-pagination-jump-prev,
                .custom-pagination .ant-pagination-jump-next {
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}

export default ProductHome;
