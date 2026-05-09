import { useState } from 'react';
import { Button, Form, Input, Divider, message, Progress } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestRegister } from '../config/UserRequest';
import { toast } from 'react-toastify';

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
        <div className="mt-2 mb-1">
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
            <div className="grid grid-cols-2 gap-1 mt-1">
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

const passwordRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
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

function RegisterUser() {
    const [loading, setLoading] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        // Kiểm tra mật khẩu xác nhận
        if (values.password !== values.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }

        try {
            await requestRegister(values);
            toast.success('Đăng ký thành công!');
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header>
                <Header />
            </header>

            <main className="flex-grow flex items-center justify-center bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-stretch max-w-6xl mx-auto">
                        {/* Phần hình ảnh */}
                        <div className="hidden lg:flex lg:w-1/2 h-auto">
                            <div className="relative w-full h-full">
                                <img
                                    src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop"
                                    alt="Tour du lịch"
                                    className="rounded-l-xl shadow-lg object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-l-xl"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h2 className="text-3xl font-bold shadow-text">Khám phá điểm đến mới</h2>
                                    <p className="text-xl mt-2 shadow-text">Đăng ký ngay để nhận ưu đãi đặc biệt</p>
                                </div>
                            </div>
                        </div>

                        {/* Phần form đăng ký */}
                        <div className="w-full lg:w-1/2 bg-white rounded-r-xl shadow-lg">
                            <div className="p-8">
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h1>
                                    <p className="text-gray-600">Tạo tài khoản mới để sử dụng dịch vụ</p>
                                </div>

                                <Form
                                    name="register_form"
                                    className="register-form"
                                    initialValues={{ typeLogin: 'email' }}
                                    onFinish={onFinish}
                                    layout="vertical"
                                    size="large"
                                >
                                    <Form.Item
                                        name="fullName"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-gray-400" />}
                                            placeholder="Họ và tên"
                                            className="rounded-md"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined className="text-gray-400" />}
                                            placeholder="Email"
                                            className="rounded-md"
                                        />
                                    </Form.Item>

                                    <Form.Item name="password" rules={passwordRules}>
                                        <Input.Password
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder="Mật khẩu (ít nhất 8 ký tự, chữ hoa, chữ thường, số)"
                                            className="rounded-md"
                                            onChange={(e) => setPasswordValue(e.target.value)}
                                        />
                                    </Form.Item>
                                    <PasswordStrengthIndicator password={passwordValue} />

                                    <Form.Item
                                        name="confirmPassword"
                                        rules={[
                                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder="Xác nhận mật khẩu"
                                            className="rounded-md"
                                        />
                                    </Form.Item>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Form.Item name="phone">
                                            <Input
                                                prefix={<PhoneOutlined className="text-gray-400" />}
                                                placeholder="Số điện thoại (không bắt buộc)"
                                                className="rounded-md"
                                            />
                                        </Form.Item>

                                        <Form.Item name="address">
                                            <Input
                                                prefix={<HomeOutlined className="text-gray-400" />}
                                                placeholder="Địa chỉ (không bắt buộc)"
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item name="typeLogin" hidden>
                                        <Input type="hidden" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            loading={loading}
                                        >
                                            Đăng ký
                                        </Button>
                                    </Form.Item>

                                    <Divider plain>Hoặc</Divider>

                                    <div className="text-center">
                                        <p className="text-gray-600 mb-4">Đã có tài khoản?</p>
                                        <Link to="/login">
                                            <Button className="w-full">Đăng nhập ngay</Button>
                                        </Link>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>

            {/* Style cho text trên ảnh */}
            <style jsx>{`
                .shadow-text {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}

export default RegisterUser;
