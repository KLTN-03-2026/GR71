import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Progress } from 'antd';
import { LockOutlined, SaveOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { requestChangePassword } from '../../../config/UserRequest';

const { Title, Text } = Typography;

function PasswordStrengthIndicator({ password }) {
    const checks = [
        { label: 'Ít nhất 8 ký tự', valid: password.length >= 8 },
        { label: 'Có chữ hoa (A-Z)', valid: /[A-Z]/.test(password) },
        { label: 'Có chữ thường (a-z)', valid: /[a-z]/.test(password) },
        { label: 'Có số (0-9)', valid: /[0-9]/.test(password) },
    ];

    const score = checks.filter((c) => c.valid).length;
    const percent = (score / 4) * 100;

    const strengthInfo = [
        { label: '', color: '' },
        { label: 'Yếu', color: '#ff4d4f' },
        { label: 'Trung bình', color: '#faad14' },
        { label: 'Khá', color: '#1677ff' },
        { label: 'Mạnh', color: '#52c41a' },
    ];

    const info = strengthInfo[score];

    if (!password) return null;

    return (
        <div className="mt-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
                <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor={info.color}
                    trailColor="#f0f0f0"
                    size="small"
                    className="flex-1 !mb-0"
                />
                <span className="text-xs font-medium" style={{ color: info.color, minWidth: 60 }}>
                    {info.label}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
                {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-1">
                        {check.valid ? (
                            <CheckOutlined className="text-green-500 text-xs" />
                        ) : (
                            <CloseOutlined className="text-red-400 text-xs" />
                        )}
                        <span className={`text-xs ${check.valid ? 'text-green-600' : 'text-gray-400'}`}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const newPasswordRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
    {
        validator(_, value) {
            if (!value) return Promise.resolve();
            if (!/[A-Z]/.test(value)) return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ hoa!'));
            if (!/[a-z]/.test(value)) return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ thường!'));
            if (!/[0-9]/.test(value)) return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ số!'));
            return Promise.resolve();
        },
    },
];

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [newPasswordValue, setNewPasswordValue] = useState('');

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
                            rules={newPasswordRules}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Ít nhất 8 ký tự, chữ hoa, chữ thường, số"
                                size="large"
                                className="rounded-lg"
                                onChange={(e) => setNewPasswordValue(e.target.value)}
                            />
                        </Form.Item>
                        <PasswordStrengthIndicator password={newPasswordValue} />

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
