const FlashSale = require('../models/flashSale.model');

class FlashSaleService {
    async createFlashSale(data) {
        await Promise.all(
            data.map(async (item) => {
                await FlashSale.create(item);
            }),
        );
        return data;
    }

    async getAllFlashSale() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const flashSales = await FlashSale.find().populate('productId');

        // Lọc flash sale còn hiệu lực và sản phẩm còn đợt khởi hành
        const activeFlashSales = flashSales.filter((flashSale) => {
            // Kiểm tra flash sale còn hiệu lực (endDate >= currentDate)
            const endDate = new Date(flashSale.endDate);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < currentDate) {
                return false; // Flash sale đã hết hạn
            }

            // Kiểm tra sản phẩm còn đợt khởi hành hợp lệ
            if (flashSale.productId && flashSale.productId.departureSchedules) {
                const hasValidSchedule = flashSale.productId.departureSchedules.some((schedule) => {
                    const departureDate = new Date(schedule.departureDate);
                    departureDate.setHours(0, 0, 0, 0);
                    return departureDate >= currentDate;
                });
                return hasValidSchedule;
            }

            return false;
        });

        return activeFlashSales;
    }

    async getFlashSaleByDate() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const flashSales = await FlashSale.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
        }).populate('productId');

        // Lọc sản phẩm còn đợt khởi hành hợp lệ
        const activeFlashSales = flashSales.filter((flashSale) => {
            if (flashSale.productId && flashSale.productId.departureSchedules) {
                const hasValidSchedule = flashSale.productId.departureSchedules.some((schedule) => {
                    const departureDate = new Date(schedule.departureDate);
                    departureDate.setHours(0, 0, 0, 0);
                    return departureDate >= currentDate;
                });
                return hasValidSchedule;
            }
            return false;
        });

        return activeFlashSales;
    }

    async editFlashSale(id, data) {
        const flashSale = await FlashSale.findByIdAndUpdate(id, data);
        return flashSale;
    }
    async deleteFlashSale(id) {
        const flashSale = await FlashSale.findByIdAndDelete(id);
        return flashSale;
    }
}

module.exports = new FlashSaleService();
