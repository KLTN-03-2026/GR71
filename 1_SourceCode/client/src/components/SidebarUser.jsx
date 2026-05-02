import { useState } from 'react';
import { Card, Avatar, Typography, Menu, Button, Badge, Divider } from 'antd';
import { User, History, LogOut, Settings, Star, MapPin, Calendar, Heart, Shield, ChevronRight } from 'lucide-react';

const { Title, Text } = Typography;

function SidebarUser({ activeKey = 'profile', onMenuSelect, userInfo }) {
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        {
            key: 'profile',
            icon: <User className="w-5 h-5" />,
            label: 'Thông tin cá nhân',
            description: 'Quản lý thông tin tài khoản',
            badge: null,
        },
        {
            key: 'history',
            icon: <History className="w-5 h-5" />,
            label: 'Lịch sử tour đã đặt',
            description: 'Xem các tour đã đặt',
            badge: 3, // Example badge count
        },
        {
            key: 'favorites',
            icon: <Heart className="w-5 h-5" />,
            label: 'Tour yêu thích',
            description: 'Danh sách tour đã lưu',
            badge: null,
        },
        {
            key: 'settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Cài đặt',
            description: 'Tùy chỉnh tài khoản',
            badge: null,
        },
    ];

    const handleMenuClick = (key) => {
        onMenuSelect?.(key);
    };

    const handleLogout = () => {
        // Logout logic will be implemented later
        console.log('Logging out...');
    };

    return (
        <div className="h-full bg-white border-r border-gray-200">
            <div className="p-6 space-y-6">
                {/* User Profile Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 rounded-2xl shadow-lg border border-red-100/50 p-6 text-gray-800">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100/20 to-orange-100/20 rounded-full -translate-y-10 translate-x-10"></div>
                    
                    <div className="relative z-10 text-center">
                        <div className="mb-4 relative inline-block">
                            <Avatar size={80} src={userInfo?.avatar} className="border-3 border-white shadow-lg" style={{ borderColor: '#FF3B2F' }}>
                                {userInfo?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            {userInfo?.isAdmin && (
                                <div className="absolute -bottom-2 -right-2 rounded-full p-1 shadow-lg" style={{ backgroundColor: '#FF3B2F' }}>
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <Title level={5} className="!text-gray-800 !mb-1 font-semibold">
                            {userInfo?.fullName || 'Người dùng'}
                        </Title>
                        <Text className="text-gray-500 text-xs">{userInfo?.email || 'user@example.com'}</Text>

                        {userInfo?.isAdmin && (
                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm" style={{ backgroundColor: '#FF3B2F' }}>
                                <Shield className="w-3 h-3" />
                                Admin
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-white to-orange-50/30 p-3 rounded-lg border border-red-100 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xl font-bold mb-1" style={{ color: '#FF3B2F' }}>12</div>
                        <div className="text-xs text-gray-500 font-medium">Tour đã đi</div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-red-50/30 p-3 rounded-lg border border-orange-100 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xl font-bold mb-1" style={{ color: '#FF3B2F' }}>4.9</div>
                        <div className="text-xs text-gray-500 font-medium">Đánh giá</div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="space-y-2">
                    <Text className="text-gray-500 text-sm font-semibold px-3 uppercase tracking-wider">Menu</Text>

                    {menuItems.map((item) => (
                        <div
                            key={item.key}
                            className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                activeKey === item.key ? 'scale-[1.02]' : ''
                            }`}
                            onClick={() => handleMenuClick(item.key)}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <div
                                className={`relative overflow-hidden rounded-lg p-4 border transition-all duration-300 ${
                                    activeKey === item.key
                                        ? 'border-red-200 shadow-md'
                                        : hoveredItem === item.key
                                        ? 'bg-gray-50 border-gray-200 shadow-sm'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                                style={activeKey === item.key ? { 
                                    background: 'linear-gradient(135deg, #FF3B2F 0%, #FF6B5A 100%)',
                                    color: 'white'
                                } : {}}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                                </div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-lg transition-all duration-300 ${
                                                activeKey === item.key
                                                    ? ''
                                                    : 'bg-gray-100 group-hover:bg-gray-200'
                                            }`}
                                            style={activeKey === item.key ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : {}}
                                        >
                                            <div
                                                className={`transition-colors duration-300 ${
                                                    activeKey === item.key
                                                        ? 'text-white'
                                                        : 'text-gray-600 group-hover:text-gray-700'
                                                }`}
                                            >
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className={`font-medium transition-colors duration-300 ${
                                                    activeKey === item.key
                                                        ? 'text-white'
                                                        : 'text-gray-800 group-hover:text-gray-900'
                                                }`}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                className={`text-xs transition-colors duration-300 ${
                                                    activeKey === item.key
                                                        ? 'text-white/80'
                                                        : 'text-gray-500 group-hover:text-gray-600'
                                                }`}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.badge && (
                                            <Badge
                                                count={item.badge}
                                                style={{
                                                    backgroundColor: activeKey === item.key ? '#fff' : '#ef4444',
                                                    color: activeKey === item.key ? '#3b82f6' : '#fff',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        )}
                                        <ChevronRight
                                            className={`w-4 h-4 transition-all duration-300 transform ${
                                                activeKey === item.key
                                                    ? 'text-white translate-x-1'
                                                    : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Divider className="my-6" />

                {/* Logout Button */}
                <Button
                    size="large"
                    block
                    onClick={handleLogout}
                    className="h-12 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 text-white"
                    style={{ 
                        backgroundColor: '#FF3B2F',
                        borderColor: '#FF3B2F'
                    }}
                    icon={<LogOut className="w-4 h-4" />}
                >
                    Đăng xuất
                </Button>

                {/* Support Info */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <Text className="text-sm font-medium text-gray-800">Hỗ trợ 24/7</Text>
                            <Text className="text-xs text-gray-600">Hotline: 1900 1234</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarUser;
