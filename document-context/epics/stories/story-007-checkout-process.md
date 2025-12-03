# User Story: Quy trình thanh toán
**Story ID:** US-CHECKOUT-01
**Epic:** EP-02 Shopping Cart & Checkout

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-CHECKOUT-001** | Checkout Process (Logic & UI) | `features/feature-007-checkout-process-logic.md` |

---

**Là** một khách hàng đã có sản phẩm trong giỏ hàng,
**Tôi muốn** hoàn tất quy trình thanh toán (nhập địa chỉ, chọn shipping, thanh toán, xác nhận),
**Để** mua được sản phẩm.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Checkout Page Access
1.  **Given** người dùng đang ở trang Cart,
2.  **When** người dùng click "Checkout" button,
3.  **Then** hệ thống navigate đến `/checkout`.

### 1.2. Shipping Information
1.  **Given** người dùng đang ở trang Checkout,
2.  **When** người dùng điền thông tin shipping,
3.  **Then** form yêu cầu:
    *   Full Name (required)
    *   Email (required, validate format)
    *   Phone (required)
    *   Address (required)
    *   City (required)
    *   Postal Code (required)
    *   Country (required, dropdown)

### 1.3. Shipping Method Selection
1.  **Given** người dùng đã điền shipping information,
2.  **When** người dùng chọn shipping method,
3.  **Then** hiển thị:
    *   Standard Shipping (5-7 days, free)
    *   Express Shipping (2-3 days, $10)
    *   Overnight Shipping (1 day, $25)

### 1.4. Payment Method Selection
1.  **Given** người dùng đã chọn shipping method,
2.  **When** người dùng chọn payment method,
3.  **Then** hiển thị:
    *   Credit Card
    *   PayPal
    *   Bank Transfer

### 1.5. Order Review
1.  **Given** người dùng đã điền đầy đủ thông tin,
2.  **When** người dùng xem order review,
3.  **Then** hiển thị:
    *   Danh sách items trong cart
    *   Subtotal
    *   Shipping cost
    *   Tax (nếu có)
    *   Total amount

### 1.6. Place Order
1.  **Given** người dùng đã xác nhận thông tin,
2.  **When** người dùng click "Place Order",
3.  **Then** hệ thống:
    *   Validate tất cả thông tin
    *   Gọi API `POST /api/v1/orders` để tạo order
    *   Redirect đến `/orders/{orderId}/confirmation`
    *   Clear cart sau khi order thành công

---

## 2. Business Rules
-   User phải đăng nhập để checkout (hoặc có guest checkout option).
-   Shipping cost được tính dựa trên shipping method đã chọn.
-   Order được tạo với status "pending" ban đầu.
-   Sau khi order thành công, cart được clear.

---

## 3. Implementation Status

### ⏳ Pending Features
- **Checkout Page:** Chưa implement
- **Shipping Form:** Chưa implement
- **Payment Integration:** Chưa implement
- **Order Creation API:** Chưa implement
- **Order Confirmation Page:** Chưa implement

### 📝 Technical Notes
- Pending: Checkout page component, shipping form, payment form, order API integration

