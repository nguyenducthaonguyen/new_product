# User Story: Xem chi tiết sản phẩm
**Story ID:** US-PROD-02
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-PROD-002** | Product Detail Page (Logic & UI) | `features/feature-002-product-detail-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** xem thông tin chi tiết của một sản phẩm (giá, ảnh, mô tả, biến thể),
**Để** quyết định có mua sản phẩm đó hay không.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Happy Path
1.  **Given** người dùng click vào một sản phẩm từ trang Home, Shop hoặc Search,
2.  **When** trang chi tiết tải xong (`/products/{slug}`),
3.  **Then** hệ thống hiển thị đầy đủ:
    *   Header và Footer
    *   Tên sản phẩm, Giá tiền với currency
    *   Rating và review count
    *   Gallery ảnh (Main image + Thumbnail list)
    *   Bộ chọn biến thể (Màu sắc - circles, Kích thước - buttons)
    *   Quantity selector với nút +/- (tối đa theo stock)
    *   Nút "Add to Cart" (Enable nếu còn hàng, Disable nếu hết hàng)
    *   Mô tả chi tiết sản phẩm

### 1.2. Variant Selection (Chọn biến thể)
1.  **Given** người dùng đang xem sản phẩm có nhiều màu/size,
2.  **When** người dùng chọn một màu,
3.  **Then** hệ thống:
    *   Cập nhật lại danh sách Size khả dụng cho màu đó
    *   Disable các size không có sẵn cho màu đã chọn
4.  **And** khi người dùng chọn một size,
5.  **Then** hệ thống:
    *   Cập nhật lại danh sách Màu khả dụng cho size đó
    *   Disable các màu không có sẵn cho size đã chọn

### 1.3. Image Gallery
1.  **Given** sản phẩm có nhiều ảnh,
2.  **When** người dùng click vào một thumbnail,
3.  **Then** main image thay đổi với fade effect.

### 1.4. Out of Stock (Hết hàng)
1.  **Given** một biến thể (SKU) đã hết hàng (Stock = 0),
2.  **When** người dùng chọn biến thể đó,
3.  **Then** nút "Add to Cart" bị disable và hiển thị text "Out of Stock".

### 1.5. Add to Cart
1.  **Given** người dùng đã chọn variant và quantity,
2.  **When** người dùng click "Add to Cart",
3.  **Then** hệ thống:
    *   Gọi API `POST /api/v1/cart/items` với SKU và quantity
    *   Hiển thị toast message "Item added to cart"
    *   Fetch full cart và update cart badge trên header
    *   Update cart store (Zustand)

---

## 2. Business Rules
-   Giá sản phẩm hiển thị = base price + variant price_modifier
-   Guest User vẫn xem được full thông tin và thêm vào giỏ hàng.
-   Quantity không được vượt quá stock của variant đã chọn.
-   Mặc định chọn variant đầu tiên còn hàng (stock > 0).
-   Page sử dụng Header và Footer giống các page khác.

---

## 3. Implementation Status

### ✅ Completed Features
- **Product Detail View:** Implemented với layout 2 columns (Desktop) / Stack (Mobile)
- **Image Gallery:** Main image + thumbnails, click thumbnail để đổi ảnh
- **Variant Selection:** 
  - Color selection với circles (swatches)
  - Size selection với buttons grid
  - Auto-filter variants dựa trên selection
- **Quantity Selector:** Nút +/- để tăng/giảm số lượng
- **Add to Cart:** Tích hợp với cart API, tự động fetch full cart sau khi add
- **Header & Footer:** Đã thêm vào product detail page
- **Responsive Design:** Desktop 2-column layout, Mobile stack layout
- **Loading State:** Skeleton loader để tránh hydration errors

### 📝 Technical Notes
- Component: `ProductDetailView` trong `components/product/product-detail-view.tsx`
- Page: `app/[locale]/products/[slug]/page.tsx`
- Server Action: `actions/product-action.ts` - `getProductBySlug()`
- API: `GET /api/v1/products/{slug}` để fetch product detail
- Cart Integration: `actions/cart-action.ts` - `addToCart()` → `getCart()`
- Entity: `ProductDetail` type trong `entities/product.ts`
- Store: `cart-store.ts` để update cart state

