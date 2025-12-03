# User Story: Quản lý giỏ hàng
**Story ID:** US-CART-01
**Epic:** EP-02 Shopping Cart & Checkout

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-CART-001** | Cart Management (Logic & UI) | `features/feature-005-cart-management-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** quản lý giỏ hàng của mình (xem, thêm, sửa, xóa sản phẩm),
**Để** chuẩn bị cho việc thanh toán.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. View Cart
1.  **Given** người dùng đã thêm sản phẩm vào giỏ hàng,
2.  **When** người dùng truy cập trang Cart (`/cart`),
3.  **Then** hệ thống hiển thị:
    *   Header và Footer
    *   Danh sách tất cả sản phẩm trong giỏ hàng
    *   Mỗi item hiển thị: image, name, SKU, quantity, price, subtotal
    *   Quantity selector với +/- buttons
    *   Remove button (trash icon)
    *   Tổng số lượng items (total_items)
    *   Tổng tiền (total_price) với currency
    *   "Continue Shopping" link
    *   "Checkout" button (chưa implement checkout)

### 1.2. Add to Cart (from Product Detail)
1.  **Given** người dùng đang xem chi tiết sản phẩm,
2.  **When** người dùng chọn variant, quantity và click "Add to Cart",
3.  **Then** hệ thống:
    *   Gọi API `POST /api/v1/cart/items` với SKU và quantity
    *   Nếu item cùng SKU đã có trong cart → merge (tăng quantity)
    *   Fetch full cart từ `GET /api/v1/cart`
    *   Update cart store (Zustand)
    *   Hiển thị toast message "Item added to cart"
    *   Cập nhật cart badge trên header

### 1.3. Update Quantity
1.  **Given** người dùng đang xem giỏ hàng,
2.  **When** người dùng click +/- để thay đổi quantity,
3.  **Then** hệ thống:
    *   Validate quantity (>= 1, <= stock)
    *   Gọi API `PATCH /api/v1/cart/items/{itemId}` với quantity mới
    *   Update cart store
    *   Recalculate totals
    *   Cập nhật cart badge trên header

### 1.4. Remove Item
1.  **Given** người dùng đang xem giỏ hàng,
2.  **When** người dùng click "Remove" (trash icon) cho một item,
3.  **Then** hệ thống:
    *   Gọi API `DELETE /api/v1/cart/items/{itemId}`
    *   Xóa item khỏi cart
    *   Update cart store
    *   Recalculate totals
    *   Cập nhật cart badge trên header
    *   Hiển thị toast message "Item removed from cart"

### 1.5. Empty Cart
1.  **Given** giỏ hàng không có items,
2.  **When** người dùng truy cập trang Cart,
3.  **Then** hiển thị message "Your cart is empty" với link "Continue Shopping".

### 1.6. Loading State
1.  **Given** hệ thống đang fetch hoặc update cart,
2.  **When** request đang xử lý,
3.  **Then** hiển thị loading state (skeleton hoặc spinner) cho item đang được update.

---

## 2. Business Rules
-   Guest User có thể thêm sản phẩm vào giỏ hàng (sử dụng `session_id`).
-   Khi User login, giỏ hàng của guest sẽ được merge vào giỏ hàng của user (nếu có).
-   Items cùng SKU sẽ được merge vào 1 item với quantity tăng lên (backend tự động merge).
-   Cart được lưu theo `user_id` (nếu đã login) hoặc `session_id` (nếu guest).
-   Cart page sử dụng Header và Footer giống các page khác.
-   Quantity không được vượt quá stock của variant.

---

## 3. Implementation Status

### ✅ Completed Features
- **Cart View Component:** Implemented với danh sách items (image, name, SKU, quantity, price, subtotal), quantity selector, remove button
- **Add to Cart:** Tích hợp từ product detail page, tự động fetch full cart sau khi add
- **Update Quantity:** Nút +/- để tăng/giảm quantity, auto-update cart
- **Remove Item:** Xóa item khỏi cart
- **Cart Store:** Zustand store để quản lý cart state với persistence
- **Header & Footer:** Đã thêm vào cart page
- **Guest Cart Support:** Hỗ trợ cart cho guest users với `session_id`
- **User Cart Support:** Hỗ trợ cart cho authenticated users với `user_id`
- **Cart Badge:** Real-time update trên header khi cart thay đổi
- **Product Information:** Cart items hiển thị product image và name từ product relationship
- **API Endpoints:** Tất cả endpoints (GET, POST, PATCH, DELETE) đã được implement đầy đủ

### 📝 Technical Notes
- Component: `CartView` trong `components/cart/cart-view.tsx`
- Page: `app/[locale]/cart/page.tsx`
- Store: `cart-store.ts` (Zustand với persistence)
- Server Actions: `actions/cart-action.ts`
  - `getCart()` - Get full cart
  - `addToCart()` - Add item (fetch full cart after)
  - `updateCartItem()` - Update quantity
  - `removeCartItem()` - Remove item
- API Endpoints:
  - `GET /api/v1/cart` - Get full cart with all items ✅
  - `POST /api/v1/cart/items` - Add item (returns SimpleCartResponse) ✅
  - `PATCH /api/v1/cart/items/{itemId}` - Update quantity ✅
  - `DELETE /api/v1/cart/items/{itemId}` - Remove item ✅
- Entity: `Cart`, `CartItem` types trong `entities/cart.ts`
- Authentication: Cart endpoints validate token nếu có, nhưng cho phép guest access

### 🔧 Fixed Issues
- **User ID Null Issue:** Fixed AuthMiddleware để validate token cho cart endpoints, đảm bảo `user_id` được set đúng khi user đã login
- **Session ID Persistence:** Frontend persist `session_id` trong cookie để reuse cart cho guest users
- **Cart Merge Logic:** Backend tự động merge items cùng SKU vào 1 item với quantity tăng lên
- **Missing API Endpoints:** Added PATCH và DELETE endpoints cho cart items
- **itemId Format:** Fixed itemId extraction (item_1 -> 1) trong frontend actions
- **Product Information:** Added product name và image vào cart items response và UI

