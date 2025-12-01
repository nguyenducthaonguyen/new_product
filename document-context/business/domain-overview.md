# 🏢 Business Domain Overview: NEXUS E-commerce

## 1. 🌟 Project Vision (Tầm nhìn Dự án)
**NEXUS** là nền tảng thương mại điện tử B2C thế hệ mới, tập trung vào trải nghiệm mua sắm tối giản, tốc độ cao và cá nhân hóa.
Mục tiêu là xây dựng một hệ thống có khả năng scale lớn, hỗ trợ đa nền tảng (Web & Mobile), và tích hợp sâu với các hệ thống Logistics/Payment.

## 2. 👥 User Roles (Vai trò Người dùng)

| Role | Description | Quyền hạn chính |
| :--- | :--- | :--- |
| **Guest (Khách)** | Người dùng chưa đăng nhập. | Xem sản phẩm, thêm vào giỏ hàng, Checkout (Guest). |
| **Customer (Khách hàng)** | Người dùng đã đăng ký thành viên. | Quản lý đơn hàng, lưu địa chỉ, tích điểm, đánh giá sản phẩm. |
| **Admin (Quản trị viên)** | Nhân viên vận hành hệ thống. | Quản lý sản phẩm, đơn hàng, khách hàng, cấu hình khuyến mãi. |
| **System** | Các tác vụ tự động (Cronjob). | Gửi email, hủy đơn quá hạn, cập nhật tồn kho. |

## 3. 📖 Domain Dictionary (Từ điển Nghiệp vụ)

| Term (Thuật ngữ) | Definition (Định nghĩa) | Vietnamese Meaning |
| :--- | :--- | :--- |
| **SKU (Stock Keeping Unit)** | Mã định danh duy nhất cho từng biến thể sản phẩm (VD: Áo thun - Size M - Màu Đỏ). | Mã phân loại hàng hóa |
| **Variant** | Một phiên bản cụ thể của sản phẩm (theo Size, Color, Material). | Biến thể |
| **Cart (Session Cart)** | Giỏ hàng tạm thời, lưu trữ phía Client hoặc Redis, có thể merge khi login. | Giỏ hàng |
| **Checkout** | Quy trình thanh toán: Shipping -> Payment -> Review -> Place Order. | Thanh toán |
| **Order** | Đơn hàng đã được tạo thành công. Có trạng thái (Pending, Processing, Shipped...). | Đơn hàng |
| **Payment Gateway** | Cổng thanh toán bên thứ 3 (Stripe, PayPal, VNPay). | Cổng thanh toán |
| **Inventory** | Số lượng tồn kho khả dụng của một SKU. | Tồn kho |
| **Flash Sale** | Chương trình khuyến mãi giảm giá sâu trong thời gian ngắn. | Bán hàng chớp nhoáng |

## 4. 🔄 Core Business Flows (Luồng nghiệp vụ chính)
1.  **Product Discovery:** Search -> Filter -> View Detail -> Related Products.
2.  **Shopping Flow:** Add to Cart -> View Cart -> Checkout -> Payment -> Order Confirmation.
3.  **Order Management:** View History -> Cancel/Return -> Review.
4.  **Admin Operations:** Create Product -> Update Inventory -> Process Order.

## 5. 🛡️ Security & Compliance
- **PCI DSS:** Tuân thủ tiêu chuẩn bảo mật thanh toán (không lưu full thẻ tín dụng).
- **PII Protection:** Mã hóa dữ liệu cá nhân (SĐT, Email, Địa chỉ) tại DB.
- **Rate Limiting:** Chống spam đơn hàng và crawl dữ liệu.