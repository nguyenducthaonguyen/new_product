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
-   User có thể checkout với hoặc không đăng nhập (guest checkout supported).
-   Shipping cost được tính dựa trên shipping method đã chọn (Standard: $0, Express: $10, Overnight: $25).
-   Order được tạo với status "pending" ban đầu.
-   Sau khi order thành công, cart được clear.
-   Order được tạo với `product_variant_id` và `sku` (không dùng `product_id`).
-   Order bao gồm `total_product` (tổng giá sản phẩm) và `cost_ship` (phí vận chuyển) riêng biệt.

---

## 3. Implementation Status

### ✅ Completed Features
- **Checkout Page:** ✅ Implemented (`/checkout`)
  - Server component với cart validation
  - Redirect to `/cart` nếu cart empty
  - Layout: Header → Checkout Form → Footer
- **Shipping Form:** ✅ Implemented
  - Component: `ShippingForm` (`frontend/src/components/checkout/shipping-form.tsx`)
  - Fields: Full Name, Email, Phone, Address, City, Postal Code, Country
  - Validation với Zod schema
- **Shipping Method Selection:** ✅ Implemented
  - Component: `ShippingMethodSelection` (`frontend/src/components/checkout/shipping-method-selection.tsx`)
  - 3 options: Standard (free), Express ($10), Overnight ($25)
  - Radio buttons với cost display
- **Payment Method Selection:** ✅ Implemented
  - Component: `PaymentMethodSelection` (`frontend/src/components/checkout/payment-method-selection.tsx`)
  - 3 options: Credit Card, PayPal, Bank Transfer
  - Radio buttons (payment processing chưa implement)
- **Order Review:** ✅ Implemented
  - Component: `OrderReview` (`frontend/src/components/checkout/order-review.tsx`)
  - Displays cart items với image, name, quantity, price
  - Shows subtotal, shipping cost, total
- **Order Creation API:** ✅ Implemented
  - Backend: `POST /api/v1/orders/checkout`
  - Endpoint: `backend/functions/product_manager/app/api/v1/order.py`
  - Service: `OrderService.create_checkout_order()`
  - Repository: `OrderRepository.create_order_with_items()`
  - Features:
    - Validates cart items và stock
    - Calculates `total_product` và `cost_ship`
    - Creates order với `product_variant_id` và `sku`
    - Clears cart after successful order
    - Supports both authenticated và guest checkout
- **Order Confirmation Page:** ✅ Implemented
  - Page: `/orders/[orderId]/confirmation`
  - Component: `frontend/src/app/[locale]/orders/[orderId]/confirmation/page.tsx`
  - Displays order details, shipping info, order items, totals
  - Shows order number, status, created date

### 📝 Technical Notes
- **Frontend Components:**
  - `CheckoutForm`: Main form orchestrator với react-hook-form
  - `ShippingForm`: Shipping information fields
  - `ShippingMethodSelection`: Radio group for shipping options
  - `PaymentMethodSelection`: Radio group for payment options
  - `OrderReview`: Order summary với cart items và totals
- **Server Actions:**
  - `createOrder()`: `frontend/src/actions/order-action.ts`
  - `getOrder()`: Fetch order details for confirmation page
- **Entities:**
  - `ShippingInfoSchema`, `CreateOrderRequestSchema`, `OrderSchema`: `frontend/src/entities/order.ts`
- **Backend:**
  - API: `POST /api/v1/orders/checkout`
  - Models: `Order`, `OrderItem` (với `product_variant_id`, `sku`, `total_product`, `cost_ship`)
  - Service: `OrderService.create_checkout_order()`
  - Repository: `OrderRepository.create_order_with_items()`
- **Database:**
  - `orders` table: `total_product`, `cost_ship` columns
  - `order_items` table: `product_variant_id`, `sku` columns (removed `product_id`)

