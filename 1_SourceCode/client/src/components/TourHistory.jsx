import { Card, Typography, Empty } from 'antd';
import { Calendar } from 'lucide-react';
import TourCard from './TourCard';

const { Title } = Typography;

function TourHistory({ tourHistory }) {
    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-6">
                <Title level={5} className="mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl text-white" style={{ backgroundColor: '#FF3B2F' }}>
                        <Calendar className="w-5 h-5" />
                    </div>
                    Lịch sử tour đã đặt
                </Title>

                {tourHistory.length > 0 ? (
                    <div className="space-y-4">
                        {tourHistory.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <Empty description="Bạn chưa đặt tour nào" className="py-12" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </Card>
    );
}

export default TourHistory;

