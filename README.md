# 🌍 THIẾT KẾ VÀ PHÁT TRIỂN WEBSITE ĐẶT TOUR DU LỊCH TÍCH HỢP AI HỖ TRỢ NGƯỜI DÙNG

Website đặt tour du lịch trực tuyến cho phép người dùng tìm kiếm, đặt và thanh toán các tour du lịch trong nước một cách nhanh chóng và thuận tiện. Hệ thống tích hợp AI hỗ trợ tư vấn tour, gợi ý cá nhân hoá và hỗ trợ khách hàng theo thời gian thực.

---

# 📌 Tính Năng Chính

## 👤 Khách Hàng

- Tìm kiếm tour theo:
  - Điểm đến
  - Ngày khởi hành
  - Số lượng khách

- Xem:
  - Chi tiết tour
  - Lịch khởi hành
  - Giá vé

- Đặt tour và thêm vào giỏ hàng
- Thanh toán trực tuyến qua:
  - VNPay
  - MoMo

- Áp dụng mã giảm giá (Coupon)
- Flash Sale theo thời gian thực
- Đăng ký / Đăng nhập bằng:
  - Email
  - Google OAuth

- Quản lý:
  - Đơn đặt tour
  - Lịch sử giao dịch
  - Tour yêu thích

- Đánh giá và nhận xét tour
- Chatbot AI hỗ trợ tư vấn bằng:
  - Gemini AI
  - Groq AI

- Chat trực tiếp với admin (real-time)
- Gợi ý tour cá nhân hoá theo hành vi người dùng

---

## 🛠️ Admin

- Quản lý tour:
  - Thêm tour
  - Chỉnh sửa tour
  - Xoá tour
  - Quản lý lịch khởi hành

- Quản lý danh mục tour
- Quản lý blog / bài viết
- Quản lý đơn hàng và thanh toán
- Quản lý coupon và flash sale
- Dashboard thống kê:
  - Doanh thu
  - Booking
  - Người dùng

- Hỗ trợ khách hàng real-time

---

# ⚙️ Công Nghệ Sử Dụng

## 🎨 Frontend

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

---

## 🧠 Backend

- Node.js
- Express 5
- MongoDB
- Mongoose 8
- Socket.IO 4
- JWT (jsonwebtoken)
- Bcrypt
- Multer
- Nodemailer
- VNPay SDK
- Cloudinary
- Google Generative AI
- Groq SDK

---

# 🚀 Cài Đặt Và Chạy Dự Án

## 📌 Yêu Cầu Hệ Thống

- Node.js >= 18
- MongoDB (Local hoặc MongoDB Atlas)

---

## 1️⃣ Clone Dự Án

```bash
git clone <repository-url>
cd tour-du-lich
```

---

## 2️⃣ Cấu Hình Biến Môi Trường

### 📁 Server `.env`

Tạo file `.env` trong thư mục `server/`

```env
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

# Email OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

### 📁 Client `.env`

Tạo file `.env` trong thư mục `client/`

```env
VITE_API_URL=http://localhost:5000
VITE_URL_IMAGE=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 3️⃣ Chạy Dự Án

### Chạy toàn bộ dự án

```bash
npm install
npm start
```

---

### Chạy riêng Backend

```bash
cd server
npm install
npm run dev
```

---

### Chạy riêng Frontend

```bash
cd client
npm install
npm run dev
```

---

## 4️⃣ Truy Cập Hệ Thống

| Hệ Thống | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

# 📂 Cấu Trúc Dự Án

```bash
tour-du-lich/
│
├── client/                     # Frontend React
│   └── src/
│       ├── assets/             # Ảnh, font
│       ├── components/         # Components dùng chung
│       ├── config/             # Axios request functions
│       ├── hooks/              # Custom hooks
│       ├── pages/              # Các trang
│       │   ├── admin/          # Trang quản trị
│       │   └── infoUser/       # Trang thông tin người dùng
│       ├── routes/             # Cấu hình routing
│       └── store/              # State management
│
├── server/                     # Backend Node.js
│   └── src/
│       ├── auth/               # Google OAuth
│       ├── controller/         # Request handlers
│       ├── models/             # MongoDB schemas
│       ├── routes/             # API routes
│       ├── services/           # Business logic
│       └── utils/              # Socket, chatbot, helpers
│
└── package.json
```

---

# 🔗 API Chính

| Method | Endpoint | Mô Tả |
|---|---|---|
| GET | `/api/tour/all` | Lấy danh sách tour |
| GET | `/api/tour/:id` | Chi tiết tour |
| POST | `/api/tour/search` | Tìm kiếm tour |
| POST | `/api/payment/vnpay` | Thanh toán VNPay |
| POST | `/api/payment/momo` | Thanh toán MoMo |
| POST | `/api/users/register` | Đăng ký tài khoản |
| POST | `/api/users/login` | Đăng nhập |
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/feedback` | Gửi đánh giá |

---

# 🤖 AI Integration

Hệ thống tích hợp AI nhằm nâng cao trải nghiệm người dùng:

- Tư vấn tour tự động
- Gợi ý tour cá nhân hoá
- Hỗ trợ trả lời câu hỏi nhanh
- Hỗ trợ khách hàng 24/7

Công nghệ sử dụng:

- Gemini AI
- Groq AI

---

# 📊 Chức Năng Nổi Bật

- Responsive UI hiện đại
- Real-time chat với Socket.IO
- Dashboard thống kê trực quan
- Hệ thống Flash Sale
- Coupon giảm giá
- Upload ảnh bằng Cloudinary
- Authentication bằng JWT + Google OAuth

---

# 👨‍💻 Nhóm Phát Triển

- Phạm Văn Hoàng
- Hoàng Tuấn Kiệt
- Nguyễn Thị Nhung
- Bùi Nhật Tịnh
- Lê Thành Sang

---

# 📄 Giấy Phép

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu.

```
