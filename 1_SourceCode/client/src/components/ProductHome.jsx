import { useEffect, useState } from 'react';
import CustomButton from './button/CustomButton';
import { requestGetAllTour } from '../config/TourRequest';
import CardBody from './CardBody';
import { useStore } from '../hooks/useStore';
import { requestGetFavouriteByUserId } from '../config/FavouriteRequest';
import { motion, useReducedMotion } from 'framer-motion';

import { Pagination } from 'antd';

function ProductHome() {
    const [products, setProducts] = useState([]);
    const [favourite, setFavourite] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [favouritePage, setFavouritePage] = useState(1);
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

    useEffect(() => {
        const fetchFavourite = async () => {
            const res = await requestGetFavouriteByUserId();
            setFavourite(res.metadata);
        };
        if (!dataUser._id) return;
        fetchFavourite();
    }, [dataUser]);

    // Tính toán dữ liệu cho trang hiện tại
    const getCurrentPageData = (data, page) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFavouritePageChange = (page) => {
        setFavouritePage(page);
        // Scroll to favourite section
        const favouriteSection = document.getElementById('favourite-section');
    };

    // Lấy dữ liệu cho trang hiện tại
    const currentProducts = getCurrentPageData(products, currentPage);
    const currentFavourites = getCurrentPageData(favourite, favouritePage);

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

            {/* Tour yêu thích */}
            {dataUser._id && favourite.length > 0 && (
                <motion.div
                    id="favourite-section"
                    initial={{ opacity: 0 }}
                    whileInView={{
                        opacity: 1,
                        transition: { duration: 0.6 },
                    }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <motion.div
                        className="flex items-center justify-between"
                        variants={headerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold">Có thể bạn yêu thích</h3>
                        <span className="text-sm text-gray-500">{favourite.length} tour yêu thích</span>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {currentFavourites.map((product) => (
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
                                <CardBody tour={product.productId} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pagination cho tour yêu thích */}
                    {favourite.length > pageSize && (
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
                                current={favouritePage}
                                total={favourite.length}
                                pageSize={pageSize}
                                onChange={handleFavouritePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} tour yêu thích`}
                                className="custom-pagination"
                            />
                        </motion.div>
                    )}
                </motion.div>
            )}

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
