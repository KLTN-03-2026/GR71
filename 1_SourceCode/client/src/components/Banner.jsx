import { useState, useEffect } from 'react';
import { Input, Button, Select, DatePicker, Card, message, Typography } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';
import Banner1 from '../assets/images/banner3.jpg';
import Banner2 from '../assets/images/banner4.jpg';
import Banner3 from '../assets/images/banner5.jpg';
import Banner4 from '../assets/images/banner6.jpg';

import { requestGetAllDestination, requestSearchTour } from '../config/TourRequest';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// Set moment locale to Vietnamese
moment.locale('vi');

function Banner() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(false);

    const [destinations, setDestinations] = useState([]);
    const [date, setDate] = useState([]);
    const [guests, setGuests] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            const res = await requestGetAllDestination();
            setDestinations(res.metadata);
        };
        fetchDestinations();
    }, []);

    // Dữ liệu banner slides
    const bannerData = [
        {
            id: 1,
            image: Banner1,
        },
        {
            id: 2,
            image: Banner2,
        },
        {
            id: 3,
            image: Banner3,
        },
        {
            id: 4,
            image: Banner4,
        },
    ];

    // Cài đặt slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        pauseOnHover: true,
        beforeChange: (current, next) => setCurrentSlide(next),
        customPaging: (i) => (
            <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300"></div>
        ),
        appendDots: (dots) => (
            <div className="absolute bottom-8 w-full">
                <ul className="flex justify-center space-x-2">{dots}</ul>
            </div>
        ),
    };

    const handleSearch = async () => {
        try {
            setLoading(true);

            // Validate input
            if (!selectedDestination && !date.length && !guests) {
                message.warning('Vui lòng chọn ít nhất một tiêu chí tìm kiếm!');
                return;
            }

            // Prepare search data
            const searchData = {
                destination: selectedDestination || '',
                date: date.length === 2 ? [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')] : [],
                guests: guests || '',
            };

            // Navigate to search page with search params
            const searchParams = new URLSearchParams();
            if (searchData.destination) searchParams.set('destination', searchData.destination);
            if (searchData.date.length === 2) {
                searchParams.set('startDate', searchData.date[0]);
                searchParams.set('endDate', searchData.date[1]);
            }
            if (searchData.guests) searchParams.set('guests', searchData.guests);

            navigate(`/search-tour?${searchParams.toString()}`);
        } catch (error) {
            console.error('Search error:', error);
            message.error('Có lỗi xảy ra khi tìm kiếm!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative h-[75vh] overflow-hidden">
            <Slider {...sliderSettings} className="h-full">
                {bannerData.map((slide, index) => (
                    <div key={slide.id} className="relative h-full">
                        {/* Full Width Image */}
                        <img src={slide.image} alt={`Banner ${slide.id}`} />

                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                        {/* Content Overlay */}
                    </div>
                ))}
            </Slider>

            {/* Search Form Card */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[100%] max-w-7xl">
                <Card className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border-0 overflow-hidden">
                    <div className="p-6">
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
                                    onChange={(value) => setSelectedDestination(value)}
                                >
                                    {destinations.map((destination) => (
                                        <Option value={destination}>{destination}</Option>
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
                                    onChange={(value) => setDate(value)}
                                    disabledDate={(current) => {
                                        return current && current < moment().startOf('day');
                                    }}
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
                                    onChange={(value) => setGuests(value)}
                                >
                                    <Option value="1">1 người</Option>
                                    <Option value="2">2 người</Option>
                                    <Option value="3-5">3-5 người</Option>
                                    <Option value="6-10">6-10 người</Option>
                                    <Option value="10+">Trên 10 người</Option>
                                </Select>
                            </div>

                            {/* Search Button */}
                            <div className="lg:col-span-1">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SearchOutlined />}
                                    onClick={handleSearch}
                                    loading={loading}
                                    className="w-full bg-gradient-to-r from-[#FF3B2F] to-[#FF6F4A] hover:from-[#E62E24] hover:to-[#FF5A3D] border-0 rounded-lg h-12 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    {loading ? 'Đang tìm...' : 'Tìm Tour'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Scroll Indicator */}
        </section>
    );
}

export default Banner;
