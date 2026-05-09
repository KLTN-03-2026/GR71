import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import SidebarAdmin from './components/SidebarAdmin';
import CategoryAdmin from './components/CategoryAdmin';
import TourAdmin from './components/TourAdmin';
import CounponAdmin from './components/CounponManager';
import OrderManager from './components/OrderManager';
import UserManager from './components/UserManager';
import MessageManager from './components/MessageManager';
import BlogAdmin from './components/BlogAdmin';
import ContactManager from './components/ContactManager';
import FlashSaleAdmin from './components/FlashSaleManagement';
import Dashbroad from './components/Dashbroad';
import { useStore } from '../../hooks/useStore';

import { useNavigate } from 'react-router-dom';

const { Content, Header } = Layout;

function Admin() {
    const [selectedKey, setSelectedKey] = useState('dashboard');

    const { dataUser } = useStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (dataUser?.isAdmin === false) {
            navigate('/');
        }
    }, [dataUser]);

    return (
        <Layout className="min-h-screen">
            <Layout.Sider
                width={260}
                collapsible
                trigger={null}
                className="shadow-xl transition-all duration-300"
                style={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                    minHeight: '100vh',
                }}
            >
                <div className="p-4 flex items-center justify-center">
                    <div className="text-white text-xl font-bold">
                        <span>Quản Lý Tour</span>
                    </div>
                </div>
                <SidebarAdmin selectedKey={selectedKey} onSelect={setSelectedKey} />
            </Layout.Sider>

            <Layout>
                <Content className="bg-gray-50">
                    <div className="bg-white rounded-xl shadow-md ">
                        {selectedKey === 'dashboard' && <Dashbroad />}
                        {selectedKey === 'category' && <CategoryAdmin />}
                        {selectedKey === 'tour' && <TourAdmin />}
                        {selectedKey === 'coupon' && <CounponAdmin />}
                        {selectedKey === 'orders' && <OrderManager />}
                        {selectedKey === 'users' && <UserManager />}
                        {selectedKey === 'message' && <MessageManager />}
                        {selectedKey === 'blog' && <BlogAdmin />}
                        {selectedKey === 'contact' && <ContactManager />}
                        {selectedKey === 'flashSale' && <FlashSaleAdmin />}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;
