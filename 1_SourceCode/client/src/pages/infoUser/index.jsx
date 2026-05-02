import { useState } from 'react';
import { Button } from 'antd';
import { MenuOutlined, HistoryOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from './components/Sidebar';
import PersonalInfo from './components/PersonalInfo';
import HistoryOrder from './components/HistoryOrder';
import Favourite from './components/Favourite';

import ChangePassword from './components/ChangePassword';

function InfoUser() {
    const [activeTab, setActiveTab] = useState('personal-info');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'personal-info':
                return <PersonalInfo />;
            case 'tour-history':
                return <HistoryOrder />;
            case 'favourite':
                return <Favourite />;
            case 'change-password':
                return <ChangePassword />;
            case 'settings':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FF3B2F] to-[#FF6F4A] rounded-full flex items-center justify-center mx-auto mb-6">
                                <SettingOutlined className="text-4xl text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Cài đặt</h2>
                            <p className="text-gray-500">Trang này sẽ được phát triển sau...</p>
                        </div>
                    </div>
                );
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-orange-50/30">
            {/* Header - Sticky at top */}
            <header>
                <Header />
            </header>

            <div className="flex relative">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isOpen={sidebarOpen}
                    onToggle={setSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center justify-center !text-[#FF3B2F] hover:!text-[#E62E24] hover:!bg-red-50"
                            size="large"
                        />
                        <h1 className="text-lg font-bold bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] bg-clip-text text-transparent">
                            Trang cá nhân
                        </h1>
                        <div className="w-10"></div>
                    </div>

                    {/* Content Area with better spacing */}
                    <div className="flex-1 p-6 lg:p-10">
                        <div className="max-w-7xl mx-auto">{renderContent()}</div>
                    </div>

                    {/* Footer */}
                </main>
            </div>
            <footer className="bg-white border-t border-gray-200 mt-auto shadow-lg">
                <Footer />
            </footer>
        </div>
    );
}

export default InfoUser;
