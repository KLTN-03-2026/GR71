import { useEffect, useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Modal,
    Select,
    message,
    Image,
    Typography,
    Divider,
    Card,
    Space,
    Tooltip,
    Row,
    Col,
    Statistic,
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { requestGetPaymentByAdmin, requestUpdatePaymentStatus } from '../../../config/PaymentRequest';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await requestGetPaymentByAdmin();
            if (res?.metadata) {
                setOrders(res.metadata);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getAvailableStatuses = (currentStatus) => {
        const statusFlow = {
            pending: ['success', 'failed', 'cancelled'],
            success: ['completed'],
            completed: [],
            failed: [],
            cancelled: [],
        };
        return statusFlow[currentStatus] || [];
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xác nhận' },
            success: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
            completed: { color: 'blue', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
            failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Thất bại' },
            cancelled: { color: 'default', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
        };
        return configs[status] || configs.pending;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Calculate statistics
    const getStatistics = () => {
        const total = orders.length;
        const pending = orders.filter((o) => o.paymentStatus === 'pending').length;
        const completed = orders.filter((o) => o.paymentStatus === 'completed').length;
        const totalRevenue = orders
            .filter((o) => o.paymentStatus === 'completed')
            .reduce((sum, o) => sum + o.totalCartPrice, 0);
        return { total, pending, completed, totalRevenue };
    };

    const stats = getStatistics();

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    const handleUpdateStatus = (order) => {
        const availableStatuses = getAvailableStatuses(order.paymentStatus);
        if (availableStatuses.length === 0) {
            message.warning('Không thể thay đổi trạng thái của đơn hàng này');
            return;
        }
        setSelectedOrder(order);
        setNewStatus(availableStatuses[0]);
        setStatusModalVisible(true);
    };

    const handleConfirmUpdateStatus = async () => {
        try {
            setUpdatingStatus(true);

            await requestUpdatePaymentStatus(selectedOrder._id, newStatus);
            message.success('Cập nhật trạng thái thành công!');
            setStatusModalVisible(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Cập nhật trạng thái thất bại');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: '_id',
            key: '_id',
            width: 130,
            fixed: 'left',
            render: (id) => <Text className="font-mono font-bold text-[#FF3B2F]">#{id.slice(-8).toUpperCase()}</Text>,
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 220,
            render: (_, record) => (
                <div className="py-2">
                    <Text strong className="block text-gray-800 text-base mb-1">
                        {record.fullName}
                    </Text>
                    <Text type="secondary" className="text-xs flex items-center gap-1">
                        <PhoneOutlined className="text-xs" /> {record.phone}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (email) => (
                <Text className="text-gray-600 flex items-center gap-1">
                    <MailOutlined /> {email}
                </Text>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalCartPrice',
            key: 'totalCartPrice',
            width: 160,
            render: (amount) => (
                <Text strong className="text-[#FF3B2F] text-lg">
                    {formatCurrency(amount)}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 160,
            render: (status) => {
                const config = getStatusConfig(status);
                return (
                    <Tag color={config.color} icon={config.icon} className="px-4 py-1.5 text-sm font-medium">
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 130,
            render: (method) => (
                <Tag color="blue" className="px-3 py-1">
                    {method?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 170,
            render: (date) => (
                <Text className="text-gray-600">
                    <CalendarOutlined className="mr-1" />
                    {dayjs(date).format('DD/MM/YYYY HH:mm')}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                            className="!bg-blue-500 hover:!bg-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật trạng thái">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdateStatus(record)}
                            disabled={getAvailableStatuses(record.paymentStatus).length === 0}
                            className="!bg-[#FF3B2F] hover:!bg-[#E62E24]"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-orange-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold">Quản lý đơn hàng</h2>
                <Text type="secondary" className="text-base">
                    Quản lý và theo dõi tất cả đơn hàng trong hệ thống
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg">
                            <Statistic
                                title={<span className="text-white opacity-90">Tổng đơn hàng</span>}
                                value={stats.total}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg">
                            <Statistic
                                title={<span className="text-white opacity-90">Chờ xác nhận</span>}
                                value={stats.pending}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg">
                            <Statistic
                                title={<span className="text-white opacity-90">Hoàn thành</span>}
                                value={stats.completed}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-[#FF3B2F] to-[#FF6F4A] p-4 rounded-lg">
                            <Statistic
                                title={<span className="text-white opacity-90">Doanh thu</span>}
                                value={stats.totalRevenue}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Orders Table */}
            <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                        className: 'px-4',
                    }}
                    className="custom-table"
                    rowClassName="hover:bg-orange-50 transition-colors"
                />
            </Card>

            {/* Detail Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF3B2F] to-[#FF6F4A] rounded-lg flex items-center justify-center">
                            <EyeOutlined className="text-white text-lg" />
                        </div>
                        <div>
                            <div className="text-lg font-bold">Chi tiết đơn hàng</div>
                            <Text type="secondary" className="text-sm">
                                #{selectedOrder?._id.slice(-8).toUpperCase()}
                            </Text>
                        </div>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={900}
                className="custom-modal"
            >
                {selectedOrder && (
                    <div className="space-y-6 pt-4">
                        <Card size="small" className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-md">
                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={12}>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <UserOutlined className="text-blue-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Khách hàng
                                                </Text>
                                                <Text strong className="text-base">
                                                    {selectedOrder.fullName}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <PhoneOutlined className="text-green-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Số điện thoại
                                                </Text>
                                                <Text strong className="text-base">
                                                    {selectedOrder.phone}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MailOutlined className="text-orange-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Email
                                                </Text>
                                                <Text strong className="text-base">
                                                    {selectedOrder.email}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <EnvironmentOutlined className="text-red-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Địa chỉ
                                                </Text>
                                                <Text strong className="text-base">
                                                    {selectedOrder.address}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CalendarOutlined className="text-purple-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Ngày đặt
                                                </Text>
                                                <Text strong className="text-base">
                                                    {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircleOutlined className="text-green-500 mt-1" />
                                            <div>
                                                <Text type="secondary" className="text-xs block mb-1">
                                                    Trạng thái
                                                </Text>
                                                {(() => {
                                                    const config = getStatusConfig(selectedOrder.paymentStatus);
                                                    return (
                                                        <Tag
                                                            color={config.color}
                                                            icon={config.icon}
                                                            className="px-3 py-1"
                                                        >
                                                            {config.text}
                                                        </Tag>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Divider className="my-6" />

                        <div>
                            <Title level={5} className="mb-4 flex items-center gap-2">
                                <ShoppingCartOutlined className="text-[#FF3B2F]" />
                                Sản phẩm đã đặt
                            </Title>
                            {selectedOrder.items?.map((item, index) => (
                                <Card
                                    key={index}
                                    size="small"
                                    className="mb-4 shadow-md hover:shadow-lg transition-shadow border-0"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Image
                                                width={120}
                                                height={120}
                                                src={
                                                    item.product?.images?.[0]
                                                        ? `${import.meta.env.VITE_API_URL}/uploads/products/${
                                                              item.product.images[0]
                                                          }`
                                                        : 'https://via.placeholder.com/120'
                                                }
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Title level={5} className="!mb-3 line-clamp-2">
                                                {item.product?.title}
                                            </Title>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Text type="secondary" className="text-sm">
                                                        Số lượng:
                                                    </Text>
                                                    <Space size="middle">
                                                        {item.quantity?.adult > 0 && (
                                                            <Tag color="blue"> {item.quantity.adult} người lớn</Tag>
                                                        )}
                                                        {item.quantity?.child > 0 && (
                                                            <Tag color="green"> {item.quantity.child} trẻ em</Tag>
                                                        )}
                                                        {item.quantity?.baby > 0 && (
                                                            <Tag color="orange"> {item.quantity.baby} em bé</Tag>
                                                        )}
                                                    </Space>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Text type="secondary" className="text-sm">
                                                        Giá tiền:
                                                    </Text>
                                                    <Text strong className="text-[#FF3B2F] text-xl">
                                                        {formatCurrency(item.totalItemPrice)}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Divider className="my-6" />

                        <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-6 rounded-xl shadow-inner border-2 border-orange-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Text className="text-gray-700 text-lg font-semibold block mb-2">
                                        Tổng thanh toán
                                    </Text>
                                    {selectedOrder.nameCounpon && (
                                        <Tag color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
                                            Mã giảm giá: {selectedOrder.nameCounpon}
                                        </Tag>
                                    )}
                                </div>
                                <Text strong className="text-[#FF3B2F] text-3xl font-bold">
                                    {formatCurrency(selectedOrder.totalCartPrice)}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Update Status Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <EditOutlined className="text-white" />
                        </div>
                        <span className="text-lg font-bold">Cập nhật trạng thái đơn hàng</span>
                    </div>
                }
                open={statusModalVisible}
                onOk={handleConfirmUpdateStatus}
                onCancel={() => setStatusModalVisible(false)}
                confirmLoading={updatingStatus}
                okText="Cập nhật"
                cancelText="Hủy"
                okButtonProps={{
                    className: '!bg-[#FF3B2F] hover:!bg-[#E62E24] !h-10 !px-6',
                }}
                cancelButtonProps={{
                    className: '!h-10 !px-6',
                }}
            >
                {selectedOrder && (
                    <div className="space-y-6 py-4">
                        <Card size="small" className="bg-gray-50">
                            <div className="space-y-3">
                                <div>
                                    <Text type="secondary" className="text-xs block mb-1">
                                        Mã đơn hàng
                                    </Text>
                                    <Text strong className="text-lg font-mono text-[#FF3B2F]">
                                        #{selectedOrder._id.slice(-8).toUpperCase()}
                                    </Text>
                                </div>
                                <Divider className="my-3" />
                                <div>
                                    <Text type="secondary" className="text-xs block mb-2">
                                        Trạng thái hiện tại
                                    </Text>
                                    {(() => {
                                        const config = getStatusConfig(selectedOrder.paymentStatus);
                                        return (
                                            <Tag
                                                color={config.color}
                                                icon={config.icon}
                                                className="px-4 py-2 text-base"
                                            >
                                                {config.text}
                                            </Tag>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Card>

                        <div>
                            <Text className="block mb-3 font-semibold text-base">Chọn trạng thái mới:</Text>
                            <Select
                                value={newStatus}
                                onChange={setNewStatus}
                                className="w-full"
                                size="large"
                                options={getAvailableStatuses(selectedOrder.paymentStatus).map((status) => {
                                    const config = getStatusConfig(status);
                                    return {
                                        value: status,
                                        label: (
                                            <span className="text-base">
                                                {config.icon} {config.text}
                                            </span>
                                        ),
                                    };
                                })}
                            />
                        </div>

                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-yellow-600 text-xl">⚠️</div>
                                <div>
                                    <Text strong className="block mb-1 text-yellow-800">
                                        Lưu ý quan trọng
                                    </Text>
                                    <Text className="text-sm text-yellow-700">
                                        Sau khi cập nhật trạng thái, bạn sẽ không thể quay lại trạng thái trước đó. Vui
                                        lòng kiểm tra kỹ trước khi xác nhận.
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default OrderManager;
