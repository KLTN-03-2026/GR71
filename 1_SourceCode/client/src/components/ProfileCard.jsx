import { Avatar, Typography, Tag, Button } from 'antd';
import { Mail, Star, Camera, Edit3, X } from 'lucide-react';

const { Title, Text } = Typography;

function ProfileCard({ userInfo, isEditing, onEditToggle }) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-xl border border-blue-100/50">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/20 to-orange-100/20 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar
                                size={100}
                                src={userInfo.avatar}
                                className="border-4 border-white shadow-lg"
                                style={{ borderColor: '#FF3B2F' }}
                            >
                                {userInfo.fullName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <div
                                className="absolute bottom-2 right-2 rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: '#FF3B2F' }}
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div>
                            <Title
                                level={4}
                                className="!mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                {userInfo.fullName}
                            </Title>
                            <Text className="text-gray-600 text-sm">{userInfo.email}</Text>
                            <div className="flex items-center gap-3 mt-2">
                                <Tag color="blue" className="px-2 py-1 rounded-full text-xs">
                                    <Mail className="w-3 h-3 inline mr-1" />
                                    {userInfo.typeLogin === 'email' ? 'Email' : 'Google'}
                                </Tag>
                                {userInfo.isAdmin && (
                                    <Tag
                                        className="px-2 py-1 rounded-full text-xs text-white border-0"
                                        style={{ backgroundColor: '#FF3B2F' }}
                                    >
                                        <Star className="w-3 h-3 inline mr-1" />
                                        Admin
                                    </Tag>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        type={isEditing ? 'default' : 'primary'}
                        size="middle"
                        onClick={onEditToggle}
                        className="h-10 px-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white border-0"
                        style={{
                            backgroundColor: '#FF3B2F',
                        }}
                        icon={isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    >
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;

