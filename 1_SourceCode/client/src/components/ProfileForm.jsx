import { Card, Form, Input, Button, DatePicker, Row, Col, Typography } from 'antd';
import { User, Mail, Phone, Save } from 'lucide-react';

const { Title, TextArea } = Typography;

function ProfileForm({ form, userInfo, isEditing, onSave, onCancel }) {
    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-6">
                <Title level={5} className="mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl text-white" style={{ backgroundColor: '#FF3B2F' }}>
                        <User className="w-5 h-5" />
                    </div>
                    Thông tin cá nhân
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...userInfo,
                        birthDay: userInfo.birthDay ? userInfo.birthDay : null,
                    }}
                    onFinish={onSave}
                    disabled={!isEditing}
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input
                                    size="middle"
                                    prefix={<User className="w-4 h-4 text-gray-400" />}
                                    className="rounded-xl"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input
                                    size="middle"
                                    prefix={<Mail className="w-4 h-4 text-gray-400" />}
                                    className="rounded-xl"
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                                ]}
                            >
                                <Input
                                    size="middle"
                                    prefix={<Phone className="w-4 h-4 text-gray-400" />}
                                    className="rounded-xl"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Ngày sinh" name="birthDay">
                                <DatePicker
                                    size="middle"
                                    className="w-full rounded-xl"
                                    placeholder="Chọn ngày sinh"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <TextArea
                                    size="middle"
                                    rows={3}
                                    className="rounded-xl"
                                    placeholder="Nhập địa chỉ chi tiết..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {isEditing && (
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Button size="middle" onClick={onCancel} className="h-10 px-4 rounded-xl">
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                size="middle"
                                htmlType="submit"
                                className="h-10 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
                                style={{ backgroundColor: '#FF3B2F' }}
                                icon={<Save className="w-4 h-4" />}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </Card>
    );
}

export default ProfileForm;

