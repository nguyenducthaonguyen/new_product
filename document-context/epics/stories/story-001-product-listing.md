# User Story: Hiển thị danh sách sản phẩm
**Story ID:** US-PROD-01
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-PROD-001** | Product Listing (Logic & UI) | `features/feature-001-product-listing-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** xem danh sách sản phẩm trên Homepage và Shop Page,
**Để** có thể khám phá và tìm kiếm sản phẩm tôi quan tâm.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Homepage Product Listing
1.  **Given** người dùng truy cập trang Home (`/`),
2.  **When** trang được tải,
3.  **Then** hệ thống hiển thị:
    *   Header với logo, search, navigation, cart, login/avatar
    *   Banner section
    *   Features section
    *   Section "Featured Products" với danh sách sản phẩm (tối đa 20 items)
    *   Testimonials section
    *   Footer

### 1.2. Shop Page Product Listing
1.  **Given** người dùng truy cập trang Shop (`/shop`),
2.  **When** trang được tải,
3.  **Then** hệ thống hiển thị:
    *   Header với logo, search, navigation, cart, login/avatar
    *   Banner section
    *   Section "Shop All Products" với danh sách sản phẩm (tối đa 50 items)
    *   Footer

### 1.3. Product Card Display
1.  **Given** danh sách sản phẩm được tải,
2.  **When** hiển thị product cards,
3.  **Then** mỗi card hiển thị:
    *   Product image (first image từ images array)
    *   Product name
    *   Product price với currency
    *   Product rating (stars) và review count
    *   Link đến product detail page (`/products/{slug}`)

### 1.4. Loading State
1.  **Given** hệ thống đang fetch dữ liệu sản phẩm,
2.  **When** dữ liệu chưa sẵn sàng,
3.  **Then** hiển thị skeleton loaders cho product cards.

### 1.5. Empty State
1.  **Given** không có sản phẩm nào,
2.  **When** danh sách sản phẩm rỗng,
3.  **Then** hiển thị message "No products found".

---

## 2. Business Rules
-   Guest User có thể xem danh sách sản phẩm mà không cần đăng nhập.
-   Product listing hiển thị tối đa 20 items trên Homepage, 50 items trên Shop Page.
-   Product cards clickable và navigate đến product detail page.
-   Product images sử dụng Next.js Image component với optimization.

---

## 3. Implementation Status

### ✅ Completed Features
- **Product List Component:** `ProductList` với grid layout
- **Product Card Component:** `ProductCard` với image, name, price, rating
- **Homepage Integration:** Product list hiển thị trong "Featured Products" section
- **Shop Page Integration:** Product list hiển thị trong "Shop All Products" section
- **Loading State:** Skeleton loaders khi đang fetch data
- **API Integration:** `GET /api/v1/products` với pagination (offset, limit)

### 📝 Technical Notes
- Component: `ProductList` trong `components/product/product-list.tsx`
- Component: `ProductCard` trong `components/product/product-card.tsx`
- Page: `app/[locale]/page.tsx` (Home), `app/[locale]/shop/page.tsx` (Shop)
- Server Action: `actions/product-action.ts` - `getProducts()`
- API: `GET /api/v1/products?offset=0&limit=20` (Home), `limit=50` (Shop)
- Entity: `ProductListItem` type trong `entities/product.ts`

