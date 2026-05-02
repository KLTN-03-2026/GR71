import React from 'react';
import { Menu } from 'antd';
import {
    PieChartOutlined,
    AppstoreOutlined,
    CarOutlined,
    TeamOutlined,
    ShoppingOutlined,
    DollarOutlined,
    CreditCardOutlined,
    FileOutlined,
    MessageOutlined,
    PhoneOutlined,
} from '@ant-design/icons';

function SidebarAdmin({ selectedKey, onSelect }) {
    const menuItems = [
        {
            key: 'dashboard',
            icon: <PieChartOutlined />,
            label: <span className="font-medium">Thống kê</span>,
        },
        {
            key: 'category',
            icon: <AppstoreOutlined />,
            label: <span className="font-medium">Quản lý danh mục</span>,
        },
        {
            key: 'tour',
            icon: <CarOutlined />,
            label: <span className="font-medium">Quản lý tour</span>,
        },
        {
            type: 'divider',
        },
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: <span className="font-medium">Quản lý người dùng</span>,
        },
        {
            key: 'orders',
            icon: <ShoppingOutlined />,
            label: <span className="font-medium">Đơn đặt tour</span>,
        },
        {
            key: 'coupon',
            icon: <DollarOutlined />,
            label: <span className="font-medium">Quản lý giảm giá</span>,
        },
        {
            key: 'blog',
            icon: <FileOutlined />,
            label: <span className="font-medium">Quản lý bài viết</span>,
        },
        {
            key: 'message',
            icon: <MessageOutlined />,
            label: <span className="font-medium">Quản lý tin nhắn</span>,
        },
        {
            key: 'contact',
            icon: <PhoneOutlined />,
            label: <span className="font-medium">Quản lý liên hệ</span>,
        },
        {
            key: 'flashSale',
            icon: <DollarOutlined />,
            label: <span className="font-medium">Flash Sale</span>,
        },
    ];

    return (
        <div className="flex flex-col">
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={({ key }) => onSelect && onSelect(key)}
                items={menuItems}
                className="border-r-0 text-white"
                style={{
                    background: 'transparent',
                }}
                theme="dark"
            />
        </div>
    );
}

export default SidebarAdmin;
