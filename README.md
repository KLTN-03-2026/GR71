# THIẾT KẾ VÀ PHÁT TRIỂN WEBSITE ĐẶT TOUR DU LỊCH TÍCH HỢP AI HỖ TRỢ NGƯỜI DÙNG

Website đặt tour du lịch trực tuyến, cho phép người dùng tìm kiếm, đặt và thanh toán các tour trong nước.

## Tính năng chính

### Khách hàng
- Tìm kiếm tour theo điểm đến, ngày khởi hành, số khách
- Xem chi tiết tour, lịch khởi hành, giá vé
- Đặt tour, thêm vào giỏ hàng
- Thanh toán qua VNPay hoặc MoMo
- Áp dụng mã giảm giá (coupon)
- Flash Sale theo thời gian
- Đăng ký / Đăng nhập (Google OAuth)
- Quản lý đặt chỗ, lịch sử đơn hàng
- Tour yêu thích
- Đánh giá và nhận xét tour
- Chatbot AI hỗ trợ tư vấn (Gemini / Groq)
- Chat trực tiếp với admin
- Gợi ý tour cá nhân hoá

### Admin
- Quản lý tour (thêm, sửa, xoá, lịch khởi hành)
- Quản lý danh mục
- Quản lý blog / bài viết
- Quản lý đơn hàng và thanh toán
- Quản lý coupon và flash sale
- Dashboard thống kê doanh thu, booking
- Chat hỗ trợ khách hàng real-time

## Công nghệ sử dụng

### Frontend
- React 18
- Vite 7
- Tailwind CSS 4
- Ant Design 5
- React Router 7
- Framer Motion 12
- Socket.IO Client 4
- Axios
- React Toastify
- Recharts

### Backend
- Node.js + Express 5
- MongoDB + Mongoose 8
- Socket.IO 4
- JWT (jsonwebtoken)
- Bcrypt
- Multer (upload ảnh)
- Nodemailer (gửi OTP)
- VNPay SDK
- Cloudinary
- Google Generative AI
- Groq SDK

## Cài đặt và chạy dự án

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)

### 1. Clone dự án
git clone <repository-url>
cd tour-du-lich

### 2. Cấu hình biến môi trường

Tạo file .env trong thư mục server/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/tour-du-lich
JWT_SECRET=your_jwt_secret

# VNPay
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECRET_KEY=your_secret_key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment-success

# MoMo
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# AI Chatbot
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

# Email (OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

---

Tạo file .env trong thư mục client/:

VITE_API_URL=http://localhost:5000
VITE_URL_IMAGE=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

### 3. Chạy dự án

Chạy cả frontend và backend cùng lúc (từ thư mục gốc):
npm install
npm start

Hoặc chạy riêng từng phần:

Backend:
cd server
npm install
npm run dev

Frontend (terminal mới):
cd client
npm install
npm run dev

### 4. Truy cập
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Cấu trúc dự án

tour-du-lich/
├── client/                  # Frontend React
│   └── src/
│       ├── assets/          # Ảnh, font
│       ├── components/      # Component dùng chung
│       ├── config/          # Axios request functions
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Các trang
│       │   ├── admin/       # Trang quản trị
│       │   └── infoUser/    # Trang thông tin người dùng
│       ├── routes/          # Cấu hình routing
│       └── store/           # Context / state management
│
├── server/                  # Backend Node.js
│   └── src/
│       ├── auth/            # Xác thực (Google OAuth)
│       ├── controller/      # Request handlers
│       ├── models/          # MongoDB schemas
│       ├── routes/          # API routes
│       ├── services/        # Business logic
│       └── utils/           # Chatbot, socket, helpers
│
└── package.json             # Script chạy toàn dự án
## API chính

GET    /api/tour/all          Lấy tất cả tour
GET    /api/tour/:id          Chi tiết tour
POST   /api/tour/search       Tìm kiếm tour
POST   /api/payment/vnpay     Tạo thanh toán VNPay
POST   /api/payment/momo      Tạo thanh toán MoMo
POST   /api/users/register    Đăng ký
POST   /api/users/login       Đăng nhập
GET    /api/cart              Lấy giỏ hàng
POST   /api/feedback          Gửi đánh giá

## Tác giả

- Phạm Văn Hoàng
- Hoàng Tuấn Kiệt
- Nguyễn Thị Nhung
- Bùi Nhật Tịnh
- Lê Thành Sang
