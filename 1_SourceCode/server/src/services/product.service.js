const Product = require('../models/product.model');
const Feedback = require('../models/feedback.model');
const Favourite = require('../models/favourite.model');
const FlashSale = require('../models/flashSale.model');

class ProductService {
    async uploadImage(image) {
        return image.map((item) => item.filename);
    }

    async createProduct(title, destination, description, category, images, transport, price, departureSchedules) {
        const product = await Product.create({
            title,
            destination,
            description,
            category,
            images,
            transport,
            price,
            departureSchedules,
        });
        return product;
    }

    async getAllProduct() {
        const products = await Product.find();
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh chính xác

        // Lọc và chỉ hiển thị các tour còn đợt khởi hành trong tương lai
        const activeProducts = products
            .map((product) => {
                const productObj = product.toObject();

                // Lọc các đợt khởi hành chưa quá ngày
                if (productObj.departureSchedules && productObj.departureSchedules.length > 0) {
                    productObj.departureSchedules = productObj.departureSchedules.filter((schedule) => {
                        const departureDate = new Date(schedule.departureDate);
                        departureDate.setHours(0, 0, 0, 0);
                        return departureDate >= currentDate;
                    });
                }

                return productObj;
            })
            .filter((product) => product.departureSchedules && product.departureSchedules.length > 0);

        return activeProducts;
    }

    async getProductByAdmin() {
        const products = await Product.find();
        return products;
    }

    async updateProduct(id, data) {
        const product = await Product.findByIdAndUpdate(id, data);
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        return product;
    }

    async getProductById(id) {
        const product = await Product.findById(id);
        const feedback = await Feedback.find({ productId: id }).populate('userId');
        const favourite = await Favourite.find({ productId: id }).populate('userId');
        const flashSale = await FlashSale.findOne({ productId: id }).populate('productId');

        if (!product) {
            return { product: null, feedback, favourite, flashSale };
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh chính xác

        // Tạo bản sao của product
        const productObj = product.toObject();

        // Lọc các đợt khởi hành chưa quá ngày
        if (productObj.departureSchedules && productObj.departureSchedules.length > 0) {
            productObj.departureSchedules = productObj.departureSchedules.filter((schedule) => {
                const departureDate = new Date(schedule.departureDate);
                departureDate.setHours(0, 0, 0, 0);
                return departureDate >= currentDate;
            });
        }

        // Áp dụng giá flash sale nếu có và đang trong thời gian khuyến mãi
        if (flashSale && productObj.departureSchedules && productObj.departureSchedules.length > 0) {
            const checkDate = new Date();
            const isFlashSaleActive =
                checkDate >= new Date(flashSale.startDate) && checkDate <= new Date(flashSale.endDate);

            if (isFlashSaleActive) {
                // Áp dụng giảm giá cho tất cả các đợt khởi hành
                productObj.departureSchedules = productObj.departureSchedules.map((schedule) => {
                    const discountMultiplier = 1 - flashSale.discount / 100;
                    return {
                        ...schedule,
                        price: {
                            adult: Math.round(schedule.price.adult * discountMultiplier),
                            child: Math.round(schedule.price.child * discountMultiplier),
                            baby: Math.round(schedule.price.baby * discountMultiplier),
                        },
                        originalPrice: {
                            adult: schedule.price.adult,
                            child: schedule.price.child,
                            baby: schedule.price.baby,
                        },
                    };
                });
            }
        }

        return { product: productObj, feedback, favourite, flashSale };
    }

    async getAllDestination() {
        const data = await Product.find({ destination: { $ne: null } }).distinct('destination');
        return data;
    }

    async searchProduct(destination, date, guests) {
        let query = {};
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Tìm kiếm theo điểm đến
        if (destination && destination !== '') {
            query.destination = { $regex: destination, $options: 'i' };
        }

        // Tìm kiếm theo ngày khởi hành (chính xác) và ngày kết thúc (linh hoạt)
        if (date && date.length === 2) {
            const [startDate, endDate] = date;
            // Ngày khởi hành phải nằm trong khoảng người dùng chọn
            query['departureSchedules.departureDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Tìm kiếm theo số lượng khách (chỗ trống)
        if (guests && guests !== '') {
            let guestCount = 1;

            // Parse số lượng khách từ string
            if (guests === '1') guestCount = 1;
            else if (guests === '2') guestCount = 2;
            else if (guests === '3-5') guestCount = 3;
            else if (guests === '6-10') guestCount = 6;
            else if (guests === '10+') guestCount = 10;

            query['departureSchedules.seatsAvailable'] = { $gte: guestCount };
        }

        // Thực hiện tìm kiếm
        const products = await Product.find(query);

        // Lọc các đợt khởi hành chưa quá ngày
        let filteredProducts = products
            .map((product) => {
                const productObj = product.toObject();

                // Lọc các đợt khởi hành chưa quá ngày
                if (productObj.departureSchedules && productObj.departureSchedules.length > 0) {
                    productObj.departureSchedules = productObj.departureSchedules.filter((schedule) => {
                        const departureDate = new Date(schedule.departureDate);
                        departureDate.setHours(0, 0, 0, 0);
                        return departureDate >= currentDate;
                    });
                }

                return productObj;
            })
            .filter((product) => product.departureSchedules && product.departureSchedules.length > 0);

        // Lọc thêm theo ngày khởi hành (chính xác), ngày kết thúc linh hoạt
        if (date && date.length === 2) {
            const [startDate, endDate] = date;
            filteredProducts = filteredProducts.filter((product) => {
                return product.departureSchedules.some((schedule) => {
                    const departureDate = new Date(schedule.departureDate);
                    const returnDate = new Date(schedule.returnDate);

                    // Ngày khởi hành phải nằm trong khoảng chọn
                    const departureDateInRange =
                        departureDate >= new Date(startDate) && departureDate <= new Date(endDate);

                    // Ngày kết thúc có thể sau ngày người dùng chọn (linh hoạt)
                    // Chỉ cần ngày kết thúc không trước ngày bắt đầu người dùng chọn
                    const returnDateFlexible = returnDate >= new Date(startDate);

                    return departureDateInRange && returnDateFlexible;
                });
            });
        }

        return filteredProducts;
    }
}

module.exports = new ProductService();
