import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Avatar, Badge } from 'antd';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    MessageSquare,
    Star,
    FileText,
    TrendingUp,
    Activity,
    RefreshCw,
    Globe,
    Clock,
    Calendar,
    PieChart as PieChartIcon,
    Trophy,
    Medal,
    Award,
    Crown,
    Sparkles,
} from 'lucide-react';
import { requestGetDashboard } from '../../../config/UserRequest';

const { Title, Text } = Typography;

function Dashbroad() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([]);
    const [quickFilter, setQuickFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange, quickFilter]);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);

            let startDate, endDate;

            // Xử lý quick filter
            if (quickFilter !== 'all') {
                const now = new Date();
                switch (quickFilter) {
                    case 'today':
                        startDate = endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        break;
                    case 'week':
                        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        endDate = now;
                        break;
                    case 'month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        endDate = now;
                        break;
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        endDate = now;
                        break;
                    default:
                        break;
                }
            } else if (dateRange.length === 2) {
                startDate = dateRange[0];
                endDate = dateRange[1];
            }

            const res = await requestGetDashboard(startDate, endDate);
            setDashboardData(res.metadata);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, rotateX: -15 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const chartVariants = {
        hidden: { opacity: 0, scale: 0.8, rotateY: -20 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Colors for charts
    const COLORS = ['#FF3B2F', '#FF6F4A', '#FF8A65', '#FFAB91', '#FFCCBC'];
    const GRADIENT_COLORS = ['#FF3B2F', '#FF6F4A'];
    const NEON_COLORS = ['#00F5FF', '#FF00FF', '#00FF00', '#FFFF00', '#FF4500'];

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    // Status colors
    const getStatusColor = (status) => {
        const colors = {
            pending: '#FAAD14',
            success: '#52C41A',
            completed: '#1890FF',
            failed: '#FF4D4F',
            cancelled: '#8C8C8C',
        };
        return colors[status] || '#8C8C8C';
    };

    // Convert status to Vietnamese
    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Đang xử lý',
            success: 'Thành công',
            completed: 'Hoàn thành',
            failed: 'Thất bại',
            cancelled: 'Đã hủy',
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
                }`}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div
                            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
                            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                        ></div>
                    </div>
                    <Text className={`text-lg ${darkMode ? 'text-white' : 'text-gray-600'}`}>Đang tải thống kê...</Text>
                </motion.div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
                }`}
            >
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-red-600" />
                    </div>
                    <Text className={`text-lg ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                        Không thể tải dữ liệu bảng điều khiển
                    </Text>
                </div>
            </div>
        );
    }

    const { overview, charts } = dashboardData;

    return (
        <div
            className={`min-h-screen transition-all duration-500 ${
                darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
            }`}
        >
            <div className="p-6">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                    {/* Modern Header with Controls */}
                    <motion.div variants={itemVariants}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <motion.div
                                        className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Activity className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <Title
                                            level={1}
                                            className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                        >
                                            Bảng Điều Khiển Thống Kê
                                        </Title>
                                        <Text className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Thống kê thời gian thực & chỉ số hiệu suất
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            {/* Control Panel */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 lg:mt-0">
                                {/* Refresh Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={fetchDashboardData}
                                    disabled={refreshing}
                                    className={`p-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 ${
                                        darkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-blue-400'
                                            : 'bg-white hover:bg-gray-50 text-blue-600'
                                    }`}
                                >
                                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                                    Làm Mới
                                </motion.button>

                                {/* Quick Filters */}
                                <div className={`p-2 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex gap-2">
                                        {[
                                            { key: 'all', label: 'Tất Cả', icon: Globe },
                                            { key: 'today', label: 'Hôm Nay', icon: Clock },
                                            { key: 'week', label: '7 Ngày', icon: Calendar },
                                            { key: 'month', label: 'Tháng Này', icon: Calendar },
                                            { key: 'year', label: 'Năm Này', icon: Calendar },
                                        ].map((filter) => (
                                            <motion.button
                                                key={filter.key}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setQuickFilter(filter.key)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                                    quickFilter === filter.key
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                        : darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <filter.icon className="w-4 h-4" />
                                                {filter.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Overview Cards with Modern Design */}
                    <motion.div variants={itemVariants}>
                        <Row gutter={[24, 24]}>
                            {[
                                {
                                    title: 'Tổng Người Dùng',
                                    value: overview.totalUsers,
                                    icon: Users,
                                    color: 'from-blue-500 to-cyan-500',
                                    bgColor: 'bg-blue-50',
                                    textColor: 'text-blue-600',
                                    change: '+12%',
                                    changeType: 'positive',
                                },
                                {
                                    title: 'Tổng Tour',
                                    value: overview.totalProducts,
                                    icon: Package,
                                    color: 'from-green-500 to-emerald-500',
                                    bgColor: 'bg-green-50',
                                    textColor: 'text-green-600',
                                    change: `${overview.totalCategories} danh mục`,
                                    changeType: 'neutral',
                                },
                                {
                                    title: 'Tổng Đơn Hàng',
                                    value: overview.totalOrders,
                                    icon: ShoppingCart,
                                    color: 'from-yellow-500 to-orange-500',
                                    bgColor: 'bg-yellow-50',
                                    textColor: 'text-yellow-600',
                                    change: `${overview.activeConversations} chat đang hoạt động`,
                                    changeType: 'neutral',
                                },
                                {
                                    title: 'Tổng Doanh Thu',
                                    value: overview.totalRevenue,
                                    icon: DollarSign,
                                    color: 'from-red-500 to-pink-500',
                                    bgColor: 'bg-red-50',
                                    textColor: 'text-red-600',
                                    change: '+8.2%',
                                    changeType: 'positive',
                                    formatter: formatCurrency,
                                },
                            ].map((stat, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover={{
                                            scale: 1.02,
                                            rotateY: 5,
                                            transition: { duration: 0.3 },
                                        }}
                                        className="h-full"
                                    >
                                        <Card
                                            className={`h-full border-0 shadow-xl rounded-2xl overflow-hidden ${
                                                darkMode ? 'bg-gray-800' : 'bg-white'
                                            }`}
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            <div className="relative">
                                                {/* Gradient Background */}
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}
                                                ></div>

                                                {/* Content */}
                                                <div className="relative p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div
                                                            className={`p-3 rounded-xl ${stat.bgColor} ${
                                                                darkMode ? 'bg-gray-700' : ''
                                                            }`}
                                                        >
                                                            <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                                        </div>
                                                        <Badge
                                                            count={stat.changeType === 'positive' ? '+' : ''}
                                                            className={`${
                                                                stat.changeType === 'positive'
                                                                    ? 'text-green-500'
                                                                    : 'text-gray-500'
                                                            }`}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Text
                                                            className={`text-sm font-medium ${
                                                                darkMode ? 'text-gray-400' : 'text-gray-500'
                                                            }`}
                                                        >
                                                            {stat.title}
                                                        </Text>
                                                        <div className="flex items-baseline gap-2">
                                                            <Text
                                                                className={`text-3xl font-bold ${
                                                                    darkMode ? 'text-white' : 'text-gray-800'
                                                                }`}
                                                            >
                                                                {stat.formatter
                                                                    ? stat.formatter(stat.value)
                                                                    : stat.value.toLocaleString()}
                                                            </Text>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {stat.changeType === 'positive' ? (
                                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Activity className="w-4 h-4 text-gray-500" />
                                                            )}
                                                            <Text
                                                                className={`text-sm ${
                                                                    stat.changeType === 'positive'
                                                                        ? 'text-green-500'
                                                                        : darkMode
                                                                        ? 'text-gray-400'
                                                                        : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {stat.change}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>

                    {/* Modern Charts Section */}
                    <motion.div variants={itemVariants}>
                        <Row gutter={[24, 24]}>
                            {/* Revenue Chart - Modern Area Chart */}
                            <Col xs={24} lg={16}>
                                <motion.div variants={chartVariants}>
                                    <Card
                                        className={`shadow-xl border-0 rounded-2xl h-full ${
                                            darkMode ? 'bg-gray-800' : 'bg-white'
                                        }`}
                                        title={
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                                    <TrendingUp className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Title
                                                        level={4}
                                                        className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                                    >
                                                        Phân Tích Doanh Thu
                                                    </Title>
                                                    <Text
                                                        className={`text-sm ${
                                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        Xu hướng doanh thu theo tháng
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <ResponsiveContainer width="100%" height={350}>
                                            <AreaChart data={charts.revenueByMonth}>
                                                <defs>
                                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FF3B2F" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#FF3B2F" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke={darkMode ? '#374151' : '#E5E7EB'}
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                                                    fontSize={12}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                                                    fontSize={12}
                                                />
                                                <RechartsTooltip
                                                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                                    labelFormatter={(label) => `Tháng: ${label}`}
                                                    contentStyle={{
                                                        backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#FF3B2F"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#revenueGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </motion.div>
                            </Col>

                            {/* Orders Status - Modern Pie Chart */}
                            <Col xs={24} lg={8}>
                                <motion.div variants={chartVariants}>
                                    <Card
                                        className={`shadow-xl border-0 rounded-2xl h-full ${
                                            darkMode ? 'bg-gray-800' : 'bg-white'
                                        }`}
                                        title={
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                                    <PieChartIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Title
                                                        level={4}
                                                        className={`!mb-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                                    >
                                                        Trạng Thái Đơn Hàng
                                                    </Title>
                                                    <Text
                                                        className={`text-sm ${
                                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        Tổng quan phân bố
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <ResponsiveContainer width="100%" height={350}>
                                            <PieChart>
                                                <Pie
                                                    data={charts.ordersByStatus}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ status, count }) => `${getStatusLabel(status)}: ${count}`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                >
                                                    {charts.ordersByStatus.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={getStatusColor(entry.status)}
                                                        />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value, name, props) => [
                                                        `${value} đơn`,
                                                        getStatusLabel(props.payload.status),
                                                    ]}
                                                    contentStyle={{
                                                        backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>

                    {/* Additional Charts Row */}
                    <motion.div variants={itemVariants}>
                        <Row gutter={[24, 24]}>
                            {/* Popular Tours - Ranking Style */}
                            <Col xs={24} lg={12}>
                                <motion.div variants={chartVariants}>
                                    <Card
                                        className={`shadow-xl border-0 rounded-2xl h-full overflow-hidden ${
                                            darkMode ? 'bg-gray-800' : 'bg-white'
                                        }`}
                                        bodyStyle={{ padding: 0 }}
                                    >
                                        {/* Header with gradient background */}
                                        <div className="relative p-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
                                            <div className="absolute inset-0 bg-black opacity-10"></div>
                                            <div className="relative flex items-center gap-3">
                                                <motion.div
                                                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Trophy className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <div>
                                                    <Title level={4} className="!mb-0 text-white">
                                                        🏆 Top Tour Phổ Biến
                                                    </Title>
                                                    <Text className="text-white/90 text-sm">
                                                        Xếp hạng theo lượt đặt
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ranking List */}
                                        <div className="p-6 space-y-4">
                                            {charts.popularTours.slice(0, 5).map((tour, index) => {
                                                const maxBookings = Math.max(
                                                    ...charts.popularTours.map((t) => t.bookings),
                                                );
                                                const percentage = (tour.bookings / maxBookings) * 100;

                                                // Medal icons and colors for top 3
                                                const getRankConfig = (rank) => {
                                                    const configs = {
                                                        0: {
                                                            icon: Crown,
                                                            gradient: 'from-yellow-400 to-yellow-600',
                                                            bgGradient: 'from-yellow-50 to-orange-50',
                                                            color: 'text-yellow-600',
                                                            borderColor: 'border-yellow-400',
                                                        },
                                                        1: {
                                                            icon: Medal,
                                                            gradient: 'from-gray-300 to-gray-500',
                                                            bgGradient: 'from-gray-50 to-slate-50',
                                                            color: 'text-gray-600',
                                                            borderColor: 'border-gray-400',
                                                        },
                                                        2: {
                                                            icon: Award,
                                                            gradient: 'from-orange-400 to-orange-600',
                                                            bgGradient: 'from-orange-50 to-amber-50',
                                                            color: 'text-orange-600',
                                                            borderColor: 'border-orange-400',
                                                        },
                                                    };
                                                    return (
                                                        configs[rank] || {
                                                            icon: Star,
                                                            gradient: 'from-blue-400 to-blue-600',
                                                            bgGradient: 'from-blue-50 to-indigo-50',
                                                            color: 'text-blue-600',
                                                            borderColor: 'border-blue-400',
                                                        }
                                                    );
                                                };

                                                const config = getRankConfig(index);
                                                const RankIcon = config.icon;

                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ scale: 1.02, x: 5 }}
                                                        className={`relative rounded-xl border-2 ${
                                                            config.borderColor
                                                        } bg-gradient-to-r ${config.bgGradient} ${
                                                            darkMode ? 'bg-gray-700' : ''
                                                        } overflow-hidden`}
                                                    >
                                                        {/* Shine effect for top 3 */}
                                                        {index < 3 && (
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                                animate={{
                                                                    x: ['-100%', '200%'],
                                                                }}
                                                                transition={{
                                                                    repeat: Infinity,
                                                                    duration: 3,
                                                                    ease: 'linear',
                                                                }}
                                                            />
                                                        )}

                                                        <div className="relative p-4">
                                                            <div className="flex items-center gap-4">
                                                                {/* Rank Medal */}
                                                                <div className="flex-shrink-0">
                                                                    <motion.div
                                                                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                                                                        whileHover={{ rotate: 360 }}
                                                                        transition={{ duration: 0.6 }}
                                                                    >
                                                                        {index < 3 ? (
                                                                            <RankIcon className="w-6 h-6 text-white" />
                                                                        ) : (
                                                                            <span className="text-white font-bold text-lg">
                                                                                {index + 1}
                                                                            </span>
                                                                        )}
                                                                    </motion.div>
                                                                </div>

                                                                {/* Tour Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <Text
                                                                            className={`font-semibold text-base truncate ${
                                                                                darkMode
                                                                                    ? 'text-white'
                                                                                    : 'text-gray-800'
                                                                            }`}
                                                                        >
                                                                            {tour.name}
                                                                        </Text>
                                                                        <div className="flex items-center gap-2">
                                                                            <Sparkles
                                                                                className={`w-4 h-4 ${config.color}`}
                                                                            />
                                                                            <Text
                                                                                className={`font-bold text-lg ${config.color}`}
                                                                            >
                                                                                {tour.bookings}
                                                                            </Text>
                                                                        </div>
                                                                    </div>

                                                                    {/* Progress bar */}
                                                                    <div className="relative">
                                                                        <Progress
                                                                            percent={percentage}
                                                                            showInfo={false}
                                                                            strokeColor={{
                                                                                '0%': '#FF3B2F',
                                                                                '100%': '#FF8A65',
                                                                            }}
                                                                            trailColor={
                                                                                darkMode ? '#374151' : '#E5E7EB'
                                                                            }
                                                                            strokeWidth={8}
                                                                            className="mb-1"
                                                                        />
                                                                        <Text
                                                                            className={`text-xs ${
                                                                                darkMode
                                                                                    ? 'text-gray-400'
                                                                                    : 'text-gray-500'
                                                                            }`}
                                                                        >
                                                                            {formatCurrency(
                                                                                tour.revenue || tour.bookings * 5000000,
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>

                            {/* Feedback Rating - Radar Chart */}
                            <Col xs={24} lg={12}>
                                <motion.div variants={chartVariants}>
                                    <Card
                                        className={`shadow-xl border-0 rounded-2xl h-full overflow-hidden ${
                                            darkMode ? 'bg-gray-800' : 'bg-white'
                                        }`}
                                        bodyStyle={{ padding: 0 }}
                                    >
                                        {/* Header */}
                                        <div className="relative p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
                                            <div className="absolute inset-0 bg-black opacity-10"></div>
                                            <div className="relative flex items-center gap-3">
                                                <motion.div
                                                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <MessageSquare className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <div>
                                                    <Title level={4} className="!mb-0 text-white">
                                                        ⭐ Đánh Giá Khách Hàng
                                                    </Title>
                                                    <Text className="text-white/90 text-sm">
                                                        Phân bố mức độ hài lòng
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Star Ratings with Progress */}
                                            <div className="space-y-4 mb-6">
                                                {charts.feedbackByRating
                                                    .sort((a, b) => {
                                                        const ratingA =
                                                            typeof a.rating === 'string'
                                                                ? parseInt(a.rating)
                                                                : a.rating;
                                                        const ratingB =
                                                            typeof b.rating === 'string'
                                                                ? parseInt(b.rating)
                                                                : b.rating;
                                                        return ratingB - ratingA;
                                                    })
                                                    .map((item, index) => {
                                                        const totalReviews = charts.feedbackByRating.reduce(
                                                            (sum, r) => sum + r.count,
                                                            0,
                                                        );
                                                        const percentage = ((item.count / totalReviews) * 100).toFixed(
                                                            1,
                                                        );
                                                        // Handle rating as either string or number
                                                        const starCount =
                                                            typeof item.rating === 'string'
                                                                ? parseInt(item.rating.split(' ')[0])
                                                                : parseInt(item.rating);

                                                        return (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -30 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-center gap-3"
                                                            >
                                                                {/* Stars */}
                                                                <div className="flex items-center gap-1 w-32">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-4 h-4 ${
                                                                                i < starCount
                                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                                    : 'text-gray-300'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>

                                                                {/* Progress Bar */}
                                                                <div className="flex-1">
                                                                    <Progress
                                                                        percent={parseFloat(percentage)}
                                                                        showInfo={false}
                                                                        strokeColor={{
                                                                            '0%': '#8B5CF6',
                                                                            '100%': '#EC4899',
                                                                        }}
                                                                        trailColor={darkMode ? '#374151' : '#E5E7EB'}
                                                                        strokeWidth={10}
                                                                    />
                                                                </div>

                                                                {/* Count & Percentage */}
                                                                <div className="flex items-center gap-2 w-24 justify-end">
                                                                    <Text
                                                                        className={`font-bold ${
                                                                            darkMode ? 'text-white' : 'text-gray-800'
                                                                        }`}
                                                                    >
                                                                        {item.count}
                                                                    </Text>
                                                                    <Text
                                                                        className={`text-sm ${
                                                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                                                        }`}
                                                                    >
                                                                        ({percentage}%)
                                                                    </Text>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                            </div>

                                            {/* Summary Stats */}
                                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                {[
                                                    {
                                                        label: 'Tổng đánh giá',
                                                        value: charts.feedbackByRating.reduce(
                                                            (sum, r) => sum + r.count,
                                                            0,
                                                        ),
                                                        color: 'text-blue-600',
                                                        bg: 'bg-blue-50',
                                                    },
                                                    {
                                                        label: 'Trung bình',
                                                        value:
                                                            (
                                                                charts.feedbackByRating.reduce((sum, r) => {
                                                                    const rating =
                                                                        typeof r.rating === 'string'
                                                                            ? parseInt(r.rating.split(' ')[0])
                                                                            : parseInt(r.rating);
                                                                    return sum + rating * r.count;
                                                                }, 0) /
                                                                charts.feedbackByRating.reduce(
                                                                    (sum, r) => sum + r.count,
                                                                    0,
                                                                )
                                                            ).toFixed(1) + '⭐',
                                                        color: 'text-yellow-600',
                                                        bg: 'bg-yellow-50',
                                                    },
                                                    {
                                                        label: 'Tích cực',
                                                        value:
                                                            (
                                                                (charts.feedbackByRating
                                                                    .filter((r) => {
                                                                        const rating =
                                                                            typeof r.rating === 'string'
                                                                                ? parseInt(r.rating.split(' ')[0])
                                                                                : parseInt(r.rating);
                                                                        return rating >= 4;
                                                                    })
                                                                    .reduce((sum, r) => sum + r.count, 0) /
                                                                    charts.feedbackByRating.reduce(
                                                                        (sum, r) => sum + r.count,
                                                                        0,
                                                                    )) *
                                                                100
                                                            ).toFixed(0) + '%',
                                                        color: 'text-green-600',
                                                        bg: 'bg-green-50',
                                                    },
                                                ].map((stat, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{ scale: 1.05 }}
                                                        className={`text-center p-3 rounded-xl ${stat.bg} ${
                                                            darkMode ? 'bg-gray-700' : ''
                                                        }`}
                                                    >
                                                        <Text
                                                            className={`text-xs ${
                                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}
                                                        >
                                                            {stat.label}
                                                        </Text>
                                                        <div className={`text-xl font-bold ${stat.color} mt-1`}>
                                                            {stat.value}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>

                    {/* Additional Stats Cards */}
                    <motion.div variants={itemVariants}>
                        <Row gutter={[24, 24]}>
                            {[
                                {
                                    title: 'Tổng Đánh Giá',
                                    value: overview.totalFeedback,
                                    icon: MessageSquare,
                                    color: 'from-purple-500 to-pink-500',
                                    bgColor: 'bg-purple-50',
                                    textColor: 'text-purple-600',
                                },
                                {
                                    title: 'Tổng Blog',
                                    value: overview.totalBlogs,
                                    icon: FileText,
                                    color: 'from-indigo-500 to-blue-500',
                                    bgColor: 'bg-indigo-50',
                                    textColor: 'text-indigo-600',
                                },
                                {
                                    title: 'Cuộc Trò Chuyện',
                                    value: overview.totalConversations,
                                    icon: Activity,
                                    color: 'from-pink-500 to-rose-500',
                                    bgColor: 'bg-pink-50',
                                    textColor: 'text-pink-600',
                                },
                            ].map((stat, index) => (
                                <Col xs={24} sm={8} key={index}>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover={{
                                            scale: 1.05,
                                            rotateY: 10,
                                            transition: { duration: 0.3 },
                                        }}
                                    >
                                        <Card
                                            className={`text-center shadow-xl border-0 rounded-2xl ${
                                                darkMode ? 'bg-gray-800' : 'bg-white'
                                            }`}
                                            bodyStyle={{ padding: '2rem' }}
                                        >
                                            <div className="relative">
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl`}
                                                ></div>
                                                <div className="relative">
                                                    <motion.div
                                                        className={`p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center ${
                                                            stat.bgColor
                                                        } ${darkMode ? 'bg-gray-700' : ''}`}
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{ duration: 0.6 }}
                                                    >
                                                        <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                                                    </motion.div>
                                                    <Statistic
                                                        title={
                                                            <span
                                                                className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                                                            >
                                                                {stat.title}
                                                            </span>
                                                        }
                                                        value={stat.value}
                                                        valueStyle={{
                                                            color: darkMode ? '#FFFFFF' : '#1F2937',
                                                            fontSize: '2rem',
                                                            fontWeight: 'bold',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Dashbroad;
