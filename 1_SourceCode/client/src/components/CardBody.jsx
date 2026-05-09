import { Link } from 'react-router-dom';
import CustomButton from './button/CustomButton';

function CardBody({ tour }) {
    if (!tour) return null;

    // Get first departure schedule for display
    const firstSchedule = tour.departureSchedules?.[0];

    // Calculate duration between departure and return dates
    const getDuration = () => {
        if (!firstSchedule?.departureDate || !firstSchedule?.returnDate) return '';

        const departure = new Date(firstSchedule.departureDate);
        const returnDate = new Date(firstSchedule.returnDate);
        const diffTime = Math.abs(returnDate - departure);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nights = diffDays - 1;

        return `${diffDays} ngày ${nights} đêm`;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return '';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Tour Image */}
            <div className="relative">
                <Link to={`/detail-product/${tour._id}`}>
                    <img
                        src={
                            `${import.meta.env.VITE_API_URL}/uploads/products/${tour.images?.[0]}` ||
                            '/placeholder-image.jpg'
                        }
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                    />
                </Link>
            </div>

            {/* Card Content */}
            <div className="p-4">
                {/* Tour Title */}
                <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2 min-h-[2.5rem] leading-5">
                    {tour.title}
                </h3>

                {/* Tour Details */}
                <div className="space-y-2 mb-4">
                    {/* Duration */}
                    {getDuration() && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{getDuration()}</span>
                            </div>
                            {firstSchedule?.hotel?.stars && (
                                <div className="flex items-center text-sm">
                                    <svg
                                        className="w-4 h-4 text-yellow-500 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
                                    </svg>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                        KHÁCH SAN {firstSchedule.hotel.stars}*
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hotel */}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mb-4">
                    {/* Departure Date */}
                    {firstSchedule?.departureDate && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Đi: {formatDate(firstSchedule.departureDate)}</span>
                        </div>
                    )}

                    {/* Available Seats */}
                    {firstSchedule?.seatsAvailable !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>Còn: {firstSchedule.seatsAvailable} chỗ</span>
                        </div>
                    )}
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between">
                    {/* Price */}
                    <div className="text-red-500 font-bold text-lg">{formatPrice(firstSchedule?.price?.adult)}</div>

                    {/* Book Button */}
                    <Link to={`/detail-product/${tour._id}`}>
                        <CustomButton text={'Giữ Chỗ'} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CardBody;
