// import { useEffect } from 'react';
// import { requestGetAllUser } from '../../../config/UserRequest';

// function UserManager() {
//     useEffect(() => {
//         const fetchUsers = async () => {
//             const res = await requestGetAllUser();
//             console.log(res);
//         };
//         fetchUsers();
//     });

//     return <div>UserManager</div>;
// }

// export default UserManager;

import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Typography,
    Avatar,
    Tooltip,
    Popconfirm,
    Badge,
    Empty,
    message,
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ExclamationCircleOutlined,
    GoogleOutlined,
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import { requestGetAllUser, requestUpdateUserAdmin, requestDeleteUserAdmin } from '../../../config/UserRequest';

const { Title, Text } = Typography;
const { Option } = Select;

function UserAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        const res = await requestGetAllUser();
        setUsers(res.metadata);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Lọc người dùng theo từ khóa tìm kiếm
    const filteredUsers = users.filter(
        (user) =>
            user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.phone.includes(searchText),
    );

    // Mở modal thêm người dùng mới
    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Mở modal chỉnh sửa người dùng
    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            fullName: record.fullName,
            email: record.email,
            phone: record.phone,
            address: record.address,
            isAdmin: record.isAdmin,
            typeLogin: record.typeLogin,
        });
        setIsModalOpen(true);
    };

    // Xử lý lưu (thêm/sửa) người dùng
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Giả lập API call
            setTimeout(async () => {
                if (editingUser) {
                    const data = {
                        id: editingUser._id,
                        fullName: values.fullName,
                        email: values.email,
                        phone: values.phone,
                        address: values.address,
                        isAdmin: values.isAdmin,
                        typeLogin: values.typeLogin,
                    };
                    await requestUpdateUserAdmin(editingUser._id, data);
                    toast.success('Đã cập nhật người dùng thành công');
                    handleRefresh();
                } else {
                    // Thêm người dùng mới
                    const newUser = {
                        _id: (users.length + 1).toString(),
                        ...values,
                        avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
                        createdAt: new Date().toISOString(),
                    };
                    setUsers([newUser, ...users]);
                    toast.success('Đã thêm người dùng mới thành công');
                }
                setIsModalOpen(false);
                setLoading(false);
            }, 500);
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi lưu thông tin người dùng');
        }
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Làm mới danh sách
    const handleRefresh = () => {
        setLoading(true);
        const fetchUsers = async () => {
            const res = await requestGetAllUser();
            setUsers(res.metadata);
        };
        fetchUsers();
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await requestDeleteUserAdmin(id);
            await fetchUsers();
            toast.success('Xóa người dùng thành công');
        } catch (error) {
            toast.error('Xóa người dùng thất bại');
        }
    };

    // Định nghĩa cột cho bảng
    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar src={record.avatar} size={40} icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Liên hệ',
            dataIndex: 'phone',
            key: 'phone',
            render: (text, record) => (
                <div>
                    <div className="flex items-center">
                        <PhoneOutlined className="mr-2 text-blue-500" />
                        <span>{text || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <HomeOutlined className="mr-2 text-green-500" />
                        <span className="text-xs text-gray-600">{record.address || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'typeLogin',
            key: 'typeLogin',
            render: (type) => (
                <Tag
                    icon={type === 'google' ? <GoogleOutlined /> : <MailOutlined />}
                    color={type === 'google' ? 'red' : 'blue'}
                    className="px-3 py-1"
                >
                    {type === 'google' ? 'Google' : 'Email'}
                </Tag>
            ),
            filters: [
                { text: 'Email', value: 'email' },
                { text: 'Google', value: 'google' },
            ],
            onFilter: (value, record) => record.typeLogin === value,
        },
        {
            title: 'Vai trò',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (isAdmin) => (
                <Tag color={isAdmin ? 'gold' : 'green'} className="px-3 py-1">
                    {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                </Tag>
            ),
            filters: [
                { text: 'Quản trị viên', value: true },
                { text: 'Khách hàng', value: false },
            ],
            onFilter: (value, record) => record.isAdmin === value,
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title="Xoá người dùng này?"
                            description="Bạn chắc chắn muốn xoá người dùng này? Hành động này không thể hoàn tác."
                            onConfirm={() => handleDelete(record._id)}
                            okText="Xoá"
                            cancelText="Huỷ"
                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <ToastContainer />
            <Card bordered={false} className="shadow-sm mb-6">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="mb-4 md:mb-0">
                        <Title level={4} className="!mb-1">
                            Quản lý người dùng
                        </Title>
                        <Text type="secondary">Quản lý tất cả tài khoản người dùng</Text>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-64"
                        />
                        <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total) => `Tổng ${total} người dùng`,
                        }}
                        locale={{
                            emptyText: <Empty description="Không có dữ liệu" />,
                        }}
                    />
                </div>
            </Card>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {editingUser ? (
                            <>
                                <EditOutlined className="text-blue-500" />
                                <span>Chỉnh sửa người dùng</span>
                            </>
                        ) : (
                            <>
                                <PlusOutlined className="text-green-500" />
                                <span>Thêm người dùng mới</span>
                            </>
                        )}
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingUser ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Huỷ"
                confirmLoading={loading}
                centered
                maskClosable={false}
                className="rounded-xl"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                        ]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input placeholder="Nhập email" prefix={<MailOutlined />} />
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item name="address" label="Địa chỉ">
                        <Input placeholder="Nhập địa chỉ" prefix={<HomeOutlined />} />
                    </Form.Item>

                    <Form.Item name="typeLogin" label="Loại tài khoản" initialValue="email">
                        <Select>
                            <Option value="email">Email</Option>
                            <Option value="google">Google</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="isAdmin" label="Quyền quản trị" valuePropName="checked" initialValue={false}>
                        <Switch checkedChildren="Quản trị viên" unCheckedChildren="Khách hàng" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default UserAdmin;
