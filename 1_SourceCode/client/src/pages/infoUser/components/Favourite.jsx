import { useEffect, useState } from 'react';
import { requestGetFavouriteByUserId } from '../../../config/FavouriteRequest';
import CardBody from '../../../components/CardBody';
import { Empty, Spin } from 'antd';

function Favourite() {
    const [favourite, setFavourite] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavourite = async () => {
            try {
                setLoading(true);
                const res = await requestGetFavouriteByUserId();
                setFavourite(res.metadata || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách yêu thích:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavourite();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!favourite.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <Empty description="Bạn chưa có sản phẩm yêu thích nào" />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Danh sách yêu thích ❤️</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {favourite.map((item) => (
                    <CardBody key={item._id} tour={item.productId} />
                ))}
            </div>
        </div>
    );
}

export default Favourite;
