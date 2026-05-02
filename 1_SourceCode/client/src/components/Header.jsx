import { Input, Dropdown, Avatar } from 'antd';
import {
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    GlobalOutlined,
    PhoneOutlined,
    DownOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import logo from '../assets/images/logo.svg';
import CustomButton from './button/CustomButton';
import { Link, useNavigate } from 'react-router-dom';

import { useStore } from '../hooks/useStore';
import { requestLogout } from '../config/UserRequest';

function Header() {
    const handleLogout = async () => {
        try {
            await requestLogout();
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const { dataUser, dataCart } = useStore();

    const navigationItems = [
        { key: 'about', label: 'Giới thiệu', icon: <GlobalOutlined />, href: '/info-website' },
        { key: 'blog', label: 'Bài viết', icon: <FileTextOutlined />, href: '/blog' },
        { key: 'contact', label: 'Liên hệ', icon: <PhoneOutlined />, href: '/contact' },
        {
            key: 'cart',
            label: `Giỏ hàng (${dataCart?.items?.length || 0})`,
            icon: <ShoppingCartOutlined />,
            href: '/cart',
        },
    ];

    const navigate = useNavigate();

    const navigateUser = (path) => {
        navigate(path);
    };

    // User dropdown menu
    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', href: '/info-user', onClick: () => navigateUser('/info-user') },
        { key: 'bookings', label: 'Đặt chỗ của tôi', href: '/bookings', onClick: () => navigateUser('/bookings') },
        { key: 'favorites', label: 'Tour yêu thích', href: '/favorites', onClick: () => navigateUser('/favorites') },
        { key: 'logout', label: 'Đăng xuất', onClick: handleLogout },
    ];

    return (
        <header className="bg-gradient-to-r from-white via-blue-50 to-white backdrop-blur-md shadow-xl border-b border-blue-100 sticky top-0 z-50">
            <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center flex-shrink-0">
                            <img src={logo} alt="Tour Du Lịch Logo" className="h-8 w-auto sm:h-10 lg:h-12" />
                        </div>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}

                    <nav className="hidden lg:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.key}
                                to={item.href}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-full transition-all duration-300 font-medium group"
                            >
                                <span className="group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </span>
                                <span className="group-hover:font-semibold transition-all duration-300">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {!dataUser?._id ? (
                            <div className="hidden lg:flex items-center space-x-3">
                                <Link to="/login">
                                    <CustomButton text={'Đăng nhập'} />
                                </Link>
                                <Link to="/register">
                                    <CustomButton text={'Đăng ký'} />
                                </Link>
                            </div>
                        ) : (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                                dropdownRender={(menu) => (
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 mt-1 min-w-[200px] overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-medium text-gray-800">
                                                {dataUser.fullName || 'Người dùng'}
                                            </p>

                                            <p className="text-xs text-gray-500 truncate">{dataUser.email}</p>
                                        </div>
                                        {menu}
                                    </div>
                                )}
                            >
                                <div className="flex items-center cursor-pointer gap-2">
                                    <Avatar
                                        icon={<UserOutlined />}
                                        className="bg-green-500 flex items-center justify-center"
                                        size="large"
                                        src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${dataUser.avatar}`}
                                    />
                                    <div className="hidden md:block">
                                        <span className="text-sm font-medium">{dataUser.fullName || 'Người dùng'}</span>
                                        <DownOutlined className="text-xs ml-1" />
                                    </div>
                                </div>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
