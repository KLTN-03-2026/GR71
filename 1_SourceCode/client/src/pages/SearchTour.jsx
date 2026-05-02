import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Select, DatePicker, Input, Spin, Empty, Row, Col, Tag } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined, FilterOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CardBody from '../components/CardBody';
import { requestSearchTour, requestGetAllDestination } from '../config/TourRequest';
import moment from 'moment';
import 'moment/locale/vi';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Set moment locale to Vietnamese
moment.locale('vi');

function SearchTour() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [tours, setTours] = useState([]);
    const [destinations, setDestinations] = useState([]);

    // Search filters
    const [selectedDestination, setSelectedDestination] = useState('');
    const [date, setDate] = useState([]);
    const [guests, setGuests] = useState('');

    // Get search params from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const destination = searchParams.get('destination') || '';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const guestsParam = searchParams.get('guests') || '';

        setSelectedDestination(destination);
        setGuests(guestsParam);

        if (startDate && endDate) {
            setDate([moment(startDate), moment(endDate)]);
        }

        // Perform initial search
        performSearch(destination, startDate && endDate ? [startDate, endDate] : [], guestsParam);
    }, [location.search]);

    // Fetch destinations
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await requestGetAllDestination();
                setDestinations(res.metadata);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };
        fetchDestinations();
    }, []);

    const performSearch = async (destination, dateRange, guestsCount) => {
        try {
            setLoading(true);
            const searchData = {
                destination: destination || '',
                date: dateRange || [],
                guests: guestsCount || '',
            };

            const res = await requestSearchTour(searchData);
            setTours(res.metadata || []);
        } catch (error) {
            console.error('Search error:', error);
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setSearchLoading(true);

            const searchData = {
                destination: selectedDestination || '',
                date: date.length === 2 ? [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')] : [],
                guests: guests || '',
            };

            // Update URL with new search params
            const searchParams = new URLSearchParams();
            if (searchData.destination) searchParams.set('destination', searchData.destination);
            if (searchData.date.length === 2) {
                searchParams.set('startDate', searchData.date[0]);
                searchParams.set('endDate', searchData.date[1]);
            }
            if (searchData.guests) searchParams.set('guests', searchData.guests);

            navigate(`/search-tour?${searchParams.toString()}`, { replace: true });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const clearFilters = () => {
        setSelectedDestination('');
        setDate([]);
        setGuests('');
        navigate('/search-tour', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8">
                <div className="container mx-auto px-4">
                    {/* Search Header */}
                    <div className="mb-8">
                        <Title level={2} className="text-center text-gray-800 mb-2">
                            Tìm kiếm tour du lịch
                        </Title>
                        <Text className="block text-center text-gray-600">
                            Khám phá những điểm đến tuyệt vời cùng chúng tôi
                        </Text>
                    </div>

                    {/* Search Filters */}
                    <Card className="mb-8 shadow-lg border-0 rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            {/* Destination */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <EnvironmentOutlined className="mr-1" />
                                    Điểm đến
                                </label>
                                <Select
                                    placeholder="Chọn điểm đến"
                                    size="large"
                                    className="w-full"
                                    showSearch
                                    value={selectedDestination}
                                    onChange={setSelectedDestination}
                                    allowClear
                                >
                                    {destinations.map((destination) => (
                                        <Option key={destination} value={destination}>
                                            {destination}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Date Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <CalendarOutlined className="mr-1" />
                                    Ngày khởi hành
                                </label>
                                <RangePicker
                                    size="large"
                                    className="w-full"
                                    placeholder={['Ngày đi sớm nhất', 'Ngày đi muộn nhất']}
                                    format="DD/MM/YYYY"
                                    value={date}
                                    onChange={setDate}
                                />
                            </div>

                            {/* Guests */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <UserOutlined className="mr-1" />
                                    Số khách
                                </label>
                                <Select
                                    placeholder="Chọn số khách"
                                    size="large"
                                    className="w-full"
                                    value={guests}
                                    onChange={setGuests}
                                    allowClear
                                >
                                    <Option value="1">1 người</Option>
                                    <Option value="2">2 người</Option>
                                    <Option value="3-5">3-5 người</Option>
                                    <Option value="6-10">6-10 người</Option>
                                    <Option value="10+">Trên 10 người</Option>
                                </Select>
                            </div>

                            {/* Search Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SearchOutlined />}
                                    onClick={handleSearch}
                                    loading={searchLoading}
                                    className="flex-1 bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] hover:from-[#E62E24] hover:to-[#FF5A3D] border-0 rounded-lg font-semibold"
                                >
                                    Tìm kiếm
                                </Button>
                                <Button size="large" onClick={clearFilters} className="rounded-lg">
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Search Results */}
                    <div>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <Title level={4} className="mb-1">
                                    Kết quả tìm kiếm
                                </Title>
                                <Text className="text-gray-600">
                                    {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${tours.length} tour phù hợp`}
                                </Text>
                            </div>

                            {/* Active Filters */}
                            {(selectedDestination || date.length > 0 || guests) && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedDestination && (
                                        <Tag color="blue" closable onClose={() => setSelectedDestination('')}>
                                            📍 {selectedDestination}
                                        </Tag>
                                    )}
                                    {date.length === 2 && (
                                        <Tag color="green" closable onClose={() => setDate([])}>
                                            📅 {date[0].format('DD/MM')} - {date[1].format('DD/MM')}
                                        </Tag>
                                    )}
                                    {guests && (
                                        <Tag color="orange" closable onClose={() => setGuests('')}>
                                            👥{' '}
                                            {guests === '1'
                                                ? '1 người'
                                                : guests === '2'
                                                ? '2 người'
                                                : guests === '3-5'
                                                ? '3-5 người'
                                                : guests === '6-10'
                                                ? '6-10 người'
                                                : 'Trên 10 người'}
                                        </Tag>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Results Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spin size="large" />
                            </div>
                        ) : tours.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {tours.map((tour) => (
                                    <Col key={tour._id} xs={24} sm={12} lg={8} xl={6}>
                                        <CardBody tour={tour} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center py-20">
                                <Empty
                                    description={
                                        <div>
                                            <Title level={4} className="text-gray-500 mb-2">
                                                Không tìm thấy tour phù hợp
                                            </Title>
                                            <Text className="text-gray-400">
                                                Hãy thử thay đổi tiêu chí tìm kiếm hoặc xóa bộ lọc
                                            </Text>
                                        </div>
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default SearchTour;
