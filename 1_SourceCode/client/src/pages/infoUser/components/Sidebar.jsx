import { Avatar, Menu } from 'antd';
import {
    UserOutlined,
    HistoryOutlined,
    LockOutlined,
    SettingOutlined,
    LogoutOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { useStore } from '../../../hooks/useStore';

function Sidebar({ activeTab, setActiveTab, isOpen, onToggle }) {
    const { dataUser } = useStore();

    const menuItems = [
        {
            key: 'personal-info',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
        },
        {
            key: 'tour-history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử đặt tour',
        },
        {
            key: 'favourite',
            icon: <HeartOutlined />,
            label: 'Tour yêu thích',
        },
        {
            key: 'change-password',
            icon: <LockOutlined />,
            label: 'Đổi mật khẩu',
        },

        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
        },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            // Handle logout logic later
            console.log('Logout clicked');
            return;
        }
        setActiveTab(key);

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            onToggle?.(false);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                w-64 bg-gradient-to-br from-[#FF3B2F] via-[#FF5722] to-[#FF6F4A]
                text-white transition-all duration-300 ease-in-out
                fixed left-0 top-0 h-screen z-50 transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-[calc(100vh-0px)] lg:shadow-2xl
            `}
            >
                {/* User Info Header */}
                <div className="p-6 text-center border-b border-white/20 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4 group">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
                            <Avatar
                                size={100}
                                src={
                                    `${import.meta.env.VITE_API_URL}/uploads/avatars/${dataUser?.avatar}` ||
                                    'https://via.placeholder.com/100'
                                }
                                className="border-4 border-white shadow-2xl relative z-10"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">
                            {dataUser?.fullName || 'Người dùng'}
                        </h3>
                        <p className="text-white/95 text-sm font-medium">{dataUser?.email || 'user@example.com'}</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="py-6 px-3 overflow-y-auto h-[calc(100%-220px)]">
                    <Menu
                        mode="vertical"
                        selectedKeys={[activeTab]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        className="!bg-transparent !border-none sidebar-menu"
                        theme="dark"
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                        }}
                    />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none"></div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => onToggle?.(false)}
                />
            )}

            {/* Custom Styles */}
            <style jsx global>{`
                .sidebar-menu .ant-menu-item {
                    border-radius: 12px;
                    margin: 6px 8px;
                    padding: 14px 18px !important;
                    height: auto !important;
                    line-height: 1.5;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .sidebar-menu .ant-menu-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .sidebar-menu .ant-menu-item:hover::before {
                    left: 100%;
                }

                .sidebar-menu .ant-menu-item:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateX(6px) scale(1.02);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .sidebar-menu .ant-menu-item-selected {
                    background: rgba(255, 255, 255, 0.25) !important;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                    font-weight: 700;
                    border-left: 4px solid white;
                    padding-left: 14px !important;
                }

                .sidebar-menu .ant-menu-item-selected::after {
                    content: '';
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                }

                .sidebar-menu .ant-menu-item-danger:hover {
                    background: rgba(220, 38, 38, 0.3) !important;
                    transform: translateX(6px) scale(1.02);
                }

                .sidebar-menu .ant-menu-item .ant-menu-title-content {
                    color: white;
                    font-size: 15px;
                    font-weight: 500;
                }

                .sidebar-menu .ant-menu-item .anticon {
                    font-size: 20px;
                    color: white;
                    margin-right: 12px;
                }

                .sidebar-menu .ant-menu-item-divider {
                    background: rgba(255, 255, 255, 0.15);
                    margin: 12px 16px;
                    height: 1px;
                }

                /* Scrollbar styling */
                .sidebar-menu::-webkit-scrollbar {
                    width: 6px;
                }

                .sidebar-menu::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }

                .sidebar-menu::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }

                .sidebar-menu::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </>
    );
}

export default Sidebar;
