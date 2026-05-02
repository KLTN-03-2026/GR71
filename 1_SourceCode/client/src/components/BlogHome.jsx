import { useEffect, useState } from 'react';
import { requestGetAllBlog } from '../config/BlogRequest';
import { Card, Typography, Button } from 'antd';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

function BlogHome() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await requestGetAllBlog();
                setBlogs(res.metadata);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Helper function to extract text from HTML content
    const extractTextFromHTML = (htmlContent, maxLength = 150) => {
        if (!htmlContent) return '';

        // Remove HTML tags
        const textContent = htmlContent.replace(/<[^>]*>/g, '');

        if (textContent.length <= maxLength) {
            return textContent;
        }

        // Truncate and add ellipsis
        const truncatedText = textContent.substring(0, maxLength);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;

        return finalText + '...';
    };

    if (loading) {
        return (
            <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-[#FF3B2F] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <Text>Đang tải bài viết...</Text>
                    </div>
                </div>
            </div>
        );
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <Title level={4} className="text-gray-500 mb-2">
                        Chưa có bài viết nào
                    </Title>
                    <Text className="text-gray-400">Hãy quay lại sau để đọc những bài viết mới nhất!</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-[#FF3B2F] text-white px-6 py-3 rounded-full shadow-lg mb-4">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-semibold">Blog du lịch</span>
                    </div>
                    <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Khám phá thế giới cùng chúng tôi
                    </Title>
                    <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Những câu chuyện, kinh nghiệm và mẹo hay cho chuyến du lịch của bạn
                    </Text>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="group">
                            <Card
                                className="h-full shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                bodyStyle={{ padding: 0 }}
                            >
                                {/* Blog Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={
                                            blog.image
                                                ? `${import.meta.env.VITE_API_URL}/uploads/blogs/${blog.image}`
                                                : 'https://via.placeholder.com/400x250?text=Blog+Image'
                                        }
                                        alt={blog.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Date Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                                        <div className="flex items-center gap-1 text-xs text-gray-700">
                                            <Calendar className="w-3 h-3" />
                                            <span>{moment(blog.createdAt).format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-[#FF3B2F] transition-colors duration-300">
                                        {blog.title}
                                    </h3>

                                    {/* Content Preview */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {extractTextFromHTML(blog.content)}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <User className="w-3 h-3" />
                                            <span>Admin</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{moment(blog.createdAt).fromNow()}</div>
                                    </div>

                                    {/* Read More Button */}
                                    <Link to={`/blog/${blog._id}`}>
                                        <Button
                                            type="text"
                                            className="w-full h-10 bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] text-white border-0 rounded-lg hover:from-[#E62E24] hover:to-[#FF5A3D] font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span>Đọc thêm</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {blogs.length > 6 && (
                    <div className="text-center mt-12">
                        <Link to="/blogs">
                            <Button
                                size="large"
                                className="bg-white border-2 border-[#FF3B2F] text-[#FF3B2F] hover:bg-[#FF3B2F] hover:text-white font-semibold px-8 py-2 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <div className="flex items-center gap-2">
                                    <span>Xem tất cả bài viết</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

export default BlogHome;
