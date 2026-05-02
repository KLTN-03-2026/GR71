import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Row, Col } from 'antd';
import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { requestChangePassword } from '../../../config/UserRequest';

const { Title, Text } = Typography;

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await requestChangePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            message.success('Đổi mật khẩu thành công!');
            form.resetFields();
        } catch (error) {
            console.error('Change password failed:', error);
            message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card className="shadow-lg border border-gray-100 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b border-gray-100">
                    <Title level={2} className="!text-gray-800 !mb-2 !font-bold">
                        Đổi mật khẩu
                    </Title>
                    <Text type="secondary" className="text-base text-gray-600">
                        Bảo mật tài khoản của bạn bằng mật khẩu mạnh
                    </Text>
                </div>

                {/* Form Section */}
                <div className="max-w-2xl mx-auto py-4">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="space-y-6"
                        requiredMark="optional"
                    >
                        <Form.Item
                            label={<span className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</span>}
                            name="currentPassword"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Nhập mật khẩu hiện tại"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-sm font-medium text-gray-700">Mật khẩu mới</span>}
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Nhập mật khẩu mới"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</span>}
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Nhập lại mật khẩu mới"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                className="!bg-[#FF6B5F] hover:!bg-[#FF5449] border-0 h-12 px-8 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default ChangePassword;
