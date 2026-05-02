import { useState } from 'react';
import { Modal, Rate, Input, Button, message, Typography, Card, Image, Tag, Radio, Space } from 'antd';
import { StarOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { requestCreateFeedback } from '../config/Feedback';

const { TextArea } = Input;
const { Title, Text } = Typography;

function ReviewModal({ visible, onClose, order }) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTourIndex, setSelectedTourIndex] = useState(0);

    const handleSubmit = async () => {
        if (!order?.items || order.items.length === 0) {
            message.error('Không tìm thấy thông tin tour!');
            return;
        }

        if (rating === 0) {
            message.error('Vui lòng chọn số sao đánh giá!');
            return;
        }

        if (!content.trim()) {
            message.error('Vui lòng nhập nội dung đánh giá!');
            return;
        }

        const selectedTour = order.items[selectedTourIndex];
        if (!selectedTour) {
            message.error('Vui lòng chọn tour để đánh giá!');
            return;
        }

        setLoading(true);
        try {
            const reviewData = {
                orderId: order._id,
                productId: selectedTour.product._id,
                rating: rating,
                content: content.trim(),
            };

            await requestCreateFeedback(reviewData);
            message.success('Đánh giá thành công!');

            // Reset form
            setRating(0);
            setContent('');
            setSelectedTourIndex(0);
            onClose();
        } catch (error) {
            console.error('Error creating review:', error);
            message.error('Có lỗi xảy ra khi gửi đánh giá!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setContent('');
        setSelectedTourIndex(0);
        onClose();
    };

    const ratingLabels = {
        1: 'Rất tệ',
        2: 'Tệ',
        3: 'Bình thường',
        4: 'Tốt',
        5: 'Tuyệt vời',
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <StarOutlined className="text-yellow-500" />
                    Đánh giá tour du lịch
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            className="review-modal"
        >
            {order?.items && order.items.length > 0 && (
                <div className="space-y-6">
                    {/* Tour Selection */}
                    {order.items.length > 1 && (
                        <div>
                            <Text className="block text-gray-700 font-medium mb-3">Chọn tour bạn muốn đánh giá:</Text>
                            <Radio.Group
                                value={selectedTourIndex}
                                onChange={(e) => setSelectedTourIndex(e.target.value)}
                                className="w-full"
                            >
                                <Space direction="vertical" className="w-full">
                                    {order.items.map((item, index) => (
                                        <Radio key={index} value={index} className="w-full">
                                            <Card
                                                className={`ml-2 border transition-all duration-200 ${
                                                    selectedTourIndex === index
                                                        ? 'border-[#FF3B2F] bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                bodyStyle={{ padding: '12px' }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={
                                                                item.product?.images?.[0]
                                                                    ? `${
                                                                          import.meta.env.VITE_API_URL
                                                                      }/uploads/products/${item.product.images[0]}`
                                                                    : 'https://via.placeholder.com/200'
                                                            }
                                                            alt={item.product?.title}
                                                            className="w-full h-full object-cover"
                                                            preview={false}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Title
                                                            level={5}
                                                            className="!mb-1 !font-bold text-gray-800 line-clamp-1 text-sm"
                                                        >
                                                            {item.product?.title}
                                                        </Title>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Tag color="blue" size="small">
                                                                {item.product?.destination}
                                                            </Tag>
                                                        </div>
                                                        <Text className="text-xs text-gray-500">
                                                            {item.quantity?.adult > 0 &&
                                                                `${item.quantity.adult} người lớn`}
                                                            {item.quantity?.child > 0 &&
                                                                `, ${item.quantity.child} trẻ em`}
                                                            {item.quantity?.baby > 0 && `, ${item.quantity.baby} em bé`}
                                                        </Text>
                                                    </div>
                                                    {selectedTourIndex === index && (
                                                        <CheckCircleOutlined className="text-[#FF3B2F] text-lg" />
                                                    )}
                                                </div>
                                            </Card>
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </div>
                    )}

                    {/* Selected Tour Information */}
                    {order.items.length === 1 && (
                        <Card className="bg-gray-50 border-0 shadow-sm">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                    <Image
                                        src={
                                            order.items[0].product?.images?.[0]
                                                ? `${import.meta.env.VITE_API_URL}/uploads/products/${
                                                      order.items[0].product.images[0]
                                                  }`
                                                : 'https://via.placeholder.com/200'
                                        }
                                        alt={order.items[0].product?.title}
                                        className="w-full h-full object-cover"
                                        preview={false}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Title level={5} className="!mb-2 !font-bold text-gray-800 line-clamp-2">
                                        {order.items[0].product?.title}
                                    </Title>
                                    <div className="flex items-center gap-2">
                                        <Tag color="blue">{order.items[0].product?.destination}</Tag>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Rating Section */}
                    <div className="text-center py-4">
                        <Text className="block text-gray-600 mb-4 text-base">Bạn cảm thấy tour này như thế nào?</Text>
                        <div className="flex flex-col items-center gap-3">
                            <Rate
                                value={rating}
                                onChange={setRating}
                                character={<StarOutlined />}
                                className="text-3xl"
                                style={{ fontSize: '32px' }}
                            />
                            {rating > 0 && (
                                <Text className="text-lg font-medium text-yellow-600">
                                    {ratingLabels[rating]} ({rating}/5 sao)
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MessageOutlined className="text-gray-500" />
                            <Text className="font-medium text-gray-700">Chia sẻ trải nghiệm của bạn</Text>
                        </div>
                        <TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Hãy chia sẻ cảm nhận của bạn về tour này. Điều gì khiến bạn hài lòng hoặc cần cải thiện?"
                            rows={4}
                            maxLength={500}
                            showCount
                            className="resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button onClick={handleCancel} className="px-6">
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={rating === 0 || !content.trim()}
                            className="!bg-[#FF3B2F] hover:!bg-[#E62E24] border-0 px-6"
                        >
                            Gửi đánh giá
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default ReviewModal;
