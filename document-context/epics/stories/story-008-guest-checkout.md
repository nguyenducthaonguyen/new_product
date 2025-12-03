# User Story: Thanh toán không cần đăng ký
**Story ID:** US-CHECKOUT-02
**Epic:** EP-02 Shopping Cart & Checkout

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-CHECKOUT-002** | Guest Checkout (Logic & UI) | `features/feature-008-guest-checkout-logic.md` |

---

**Là** một khách hàng chưa có tài khoản,
**Tôi muốn** thanh toán mà không cần đăng ký tài khoản,
**Để** mua sản phẩm nhanh chóng hơn.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Guest Checkout Option
1.  **Given** người dùng chưa đăng nhập và có items trong cart,
2.  **When** người dùng click "Checkout",
3.  **Then** hệ thống hiển thị 2 options:
    *   "Checkout as Guest" - Continue với guest checkout
    *   "Login to Checkout" - Redirect đến login page

### 1.2. Guest Checkout Form
1.  **Given** người dùng chọn "Checkout as Guest",
2.  **When** người dùng điền thông tin checkout,
3.  **Then** form yêu cầu:
    *   Email (required, để gửi order confirmation)
    *   Full Name (required)
    *   Phone (required)
    *   Shipping Address (required)
    *   Payment Information (required)

### 1.3. Guest Order Creation
1.  **Given** người dùng đã điền đầy đủ thông tin guest checkout,
2.  **When** người dùng click "Place Order",
3.  **Then** hệ thống:
    *   Tạo order với `user_id = null`
    *   Lưu email và thông tin shipping
    *   Gửi order confirmation email
    *   Redirect đến order confirmation page

### 1.4. Guest Cart to User Cart Merge
1.  **Given** người dùng đã checkout as guest,
2.  **When** người dùng đăng ký tài khoản sau đó,
3.  **Then** hệ thống:
    *   Merge guest cart vào user cart (nếu có)
    *   Link guest orders với user account (nếu email match)

---

## 2. Business Rules
-   Guest checkout không yêu cầu đăng ký tài khoản.
-   Email là bắt buộc để gửi order confirmation.
-   Guest orders được lưu với `user_id = null`.
-   Guest cart sử dụng `session_id` để track.

---

## 3. Implementation Status

### ⏳ Pending Features
- **Guest Checkout Option:** Chưa implement
- **Guest Checkout Form:** Chưa implement
- **Guest Order Creation:** Chưa implement
- **Guest Cart to User Cart Merge:** Chưa implement

### ✅ Current Support
- **Guest Cart:** Đã hỗ trợ guest cart với `session_id` (có thể add items vào cart mà không cần login)

### 📝 Technical Notes
- Pending: Guest checkout page, guest order API, email confirmation, cart merge logic

