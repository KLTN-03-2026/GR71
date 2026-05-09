import { useEffect, useState } from 'react';
import { Card, Avatar, Button, Form, Input, Select, DatePicker, Row, Col, Typography, Upload, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useStore } from '../../../hooks/useStore';

import { requestUpdateUser, requestUploadAvatar } from '../../../config/UserRequest';

const { Title, Text } = Typography;
const { TextArea } = Input;

function PersonalInfo() {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const { dataUser } = useStore();

    useEffect(() => {
        if (dataUser) {
            // Convert string date to dayjs object for DatePicker
            form.setFieldsValue({
                ...dataUser,
                birthDay: dataUser?.birthDay ? dayjs(dataUser.birthDay) : null,
            });
        }
    }, [dataUser, form]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // Convert dayjs object to string for API
            const data = {
                ...values,
                birthDay: values.birthDay ? values.birthDay.format('YYYY-MM-DD') : null,
            };
            await requestUpdateUser(data);

            message.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            console.error('Validation failed:', error);
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    const handleCancel = () => {
        // Reset to original data
        form.setFieldsValue({
            ...dataUser,
            birthDay: dataUser?.birthDay ? dayjs(dataUser.birthDay) : null,
        });
        setIsEditing(false);
    };

    const uploadProps = {
        name: 'avatar',
        listType: 'picture-card',
        className: 'avatar-uploader',
        showUploadList: false,
        beforeUpload: async (file) => {
            const formData = new FormData();
            formData.append('avatar', file);
            await requestUploadAvatar(formData);
            window.location.reload();
        },
        onChange: (info) => {
            if (info.file.status === 'done') {
                message.success('Tải ảnh lên thành công!');
            }
        },
    };

    return (
        <div>
            <Card className="shadow-lg border border-gray-100 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b border-gray-100">
                    <Title level={2} className="!text-gray-800 !mb-2 !font-bold">
                        Thông tin cá nhân
                    </Title>
                    <Text type="secondary" className="text-base text-gray-600">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </Text>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <Avatar
                            size={120}
                            src={
                                `${import.meta.env.VITE_API_URL}/uploads/avatars/${dataUser?.avatar}` ||
                                'https://via.placeholder.com/120'
                            }
                            icon={<UserOutlined />}
                            className="bg-gray-300 shadow-lg"
                        />
                        {isEditing && (
                            <Upload {...uploadProps}>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<CameraOutlined />}
                                    className="absolute -bottom-2 -right-2 !bg-[#FF6B5F] hover:!bg-[#FF5449] border-0 shadow-lg"
                                    size="large"
                                />
                            </Upload>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="max-w-4xl mx-auto">
                    <Form form={form} layout="vertical" className="space-y-4">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<span className="text-sm text-gray-600"> Họ và tên</span>}
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" disabled={!isEditing} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<span className="text-sm text-gray-600"> Email</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input placeholder="Nhập email" disabled={!isEditing} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<span className="text-sm text-gray-600"> Số điện thoại</span>}
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" disabled={!isEditing} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<span className="text-sm text-gray-600">Ngày sinh</span>}
                                    name="birthDay"
                                >
                                    <DatePicker
                                        placeholder="Chọn ngày sinh "
                                        className="w-full"
                                        format="DD/MM/YYYY"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item
                                    label={<span className="text-sm text-gray-600">Địa chỉ</span>}
                                    name="address"
                                >
                                    <TextArea placeholder="Nhập địa chỉ" rows={3} disabled={!isEditing} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleCancel} className="px-6 h-10 hover:border-gray-400">
                                        Hủy
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                        className="!bg-[#FF6B5F] hover:!bg-[#FF5449] border-0 px-6 h-10 shadow-md hover:shadow-lg transition-all"
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                    className="!bg-[#FF6B5F] hover:!bg-[#FF5449] border-0 px-6 h-10 shadow-md hover:shadow-lg transition-all"
                                >
                                    Chỉnh sửa thông tin
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default PersonalInfo;
