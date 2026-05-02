import Footer from '../components/Footer';
import Header from '../components/Header';

function InfoWebsite() {
    return (
        <div className="bg-gray-50">
            <header>
                <Header />
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070')] bg-cover bg-center"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Khám Phá Thế Giới Cùng TourDuLich.vn
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            Đồng hành cùng bạn trong mỗi hành trình khám phá những điểm đến tuyệt vời
                        </p>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 relative">
                                <span className="relative z-10">Về Chúng Tôi</span>
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600"></span>
                            </h2>

                            <div className="prose prose-lg mx-auto text-gray-600">
                                <p className="mb-6">
                                    <strong className="text-blue-700">TourDuLich.vn</strong> là nền tảng đặt tour du
                                    lịch trực tuyến hàng đầu Việt Nam, giúp bạn khám phá những điểm đến tuyệt vời trong
                                    và ngoài nước một cách dễ dàng, nhanh chóng và an toàn.
                                </p>
                                <p>
                                    Với hơn 10 năm kinh nghiệm trong ngành du lịch, chúng tôi tự hào mang đến cho khách
                                    hàng những dịch vụ chất lượng cao cùng trải nghiệm đặt tour trực tuyến thuận tiện
                                    nhất. Đội ngũ nhân viên chuyên nghiệp, tận tâm của chúng tôi luôn sẵn sàng hỗ trợ
                                    bạn 24/7 để đảm bảo chuyến đi của bạn trở nên trọn vẹn.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 relative">
                            <span className="relative z-10">Giá Trị Nổi Bật</span>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600"></span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Đa dạng tour</h3>
                                <p className="text-gray-600">
                                    Hàng trăm tour trong nước & quốc tế, phù hợp mọi nhu cầu và ngân sách của khách
                                    hàng.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-500">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Đặt tour dễ dàng</h3>
                                <p className="text-gray-600">
                                    Giao diện thân thiện, thao tác nhanh chóng chỉ với vài cú click, tiết kiệm thời gian
                                    tối đa.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500">
                                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Thanh toán an toàn</h3>
                                <p className="text-gray-600">
                                    Hỗ trợ nhiều hình thức thanh toán bảo mật, đảm bảo an toàn tuyệt đối cho giao dịch
                                    của bạn.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-yellow-500">
                                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Hỗ trợ tận tâm</h3>
                                <p className="text-gray-600">
                                    Đội ngũ tư vấn viên chuyên nghiệp, sẵn sàng hỗ trợ 24/7 cho mọi thắc mắc của bạn.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-red-500">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Ưu đãi hấp dẫn</h3>
                                <p className="text-gray-600">
                                    Nhiều chương trình khuyến mãi, giảm giá đặc biệt quanh năm cho các tour trong và
                                    ngoài nước.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500">
                                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Chất lượng đảm bảo</h3>
                                <p className="text-gray-600">
                                    Cam kết mang đến những trải nghiệm du lịch chất lượng cao với giá thành hợp lý nhất.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg border border-blue-100">
                                <h3 className="text-2xl font-bold text-blue-700 mb-4">Sứ mệnh</h3>
                                <p className="text-gray-700">
                                    Chúng tôi mong muốn mang đến cho khách hàng những trải nghiệm du lịch trọn vẹn, tiện
                                    lợi và đáng nhớ nhất. TourDuLich.vn cam kết cung cấp các tour chất lượng, giá cả
                                    minh bạch, dịch vụ tận tâm và hỗ trợ khách hàng 24/7.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg border border-purple-100">
                                <h3 className="text-2xl font-bold text-purple-700 mb-4">Tầm nhìn</h3>
                                <p className="text-gray-700">
                                    Trở thành nền tảng du lịch trực tuyến được yêu thích nhất tại Việt Nam, kết nối hàng
                                    triệu du khách với những hành trình mơ ước trên khắp thế giới, và đóng góp vào sự
                                    phát triển của ngành du lịch Việt Nam.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 relative">
                            <span className="relative z-10">Liên Hệ</span>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600"></span>
                        </h2>

                        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-4">Thông tin liên hệ</h3>
                                    <p className="mb-6">
                                        Nếu bạn cần tư vấn hoặc hỗ trợ, vui lòng liên hệ với chúng tôi:
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 mr-3 text-blue-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-blue-200">Email:</p>
                                                <a
                                                    href="mailto:hotro@tourdulich.vn"
                                                    className="text-white hover:text-blue-200 transition-colors"
                                                >
                                                    hotro@tourdulich.vn
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 mr-3 text-blue-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-blue-200">Hotline:</p>
                                                <a
                                                    href="tel:19001234"
                                                    className="text-white hover:text-blue-200 transition-colors"
                                                >
                                                    1900 1234
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 mr-3 text-blue-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-blue-200">Địa chỉ:</p>
                                                <p className="text-white">123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 p-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Giờ làm việc</h3>
                                    <div className="space-y-3 text-gray-600">
                                        <p>
                                            <span className="font-semibold">Thứ Hai - Thứ Sáu:</span> 8:00 - 18:00
                                        </p>
                                        <p>
                                            <span className="font-semibold">Thứ Bảy:</span> 8:00 - 12:00
                                        </p>
                                        <p>
                                            <span className="font-semibold">Chủ Nhật:</span> Nghỉ
                                        </p>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="font-bold text-gray-800 mb-2">Kết nối với chúng tôi</h4>
                                        <div className="flex space-x-4">
                                            <a
                                                href="#"
                                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default InfoWebsite;
