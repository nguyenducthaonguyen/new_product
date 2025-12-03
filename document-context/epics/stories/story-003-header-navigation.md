# User Story: Header Navigation với Search và User Menu
**Story ID:** US-NAV-01
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-NAV-001** | Header Component (Logic & UI) | `features/feature-003-header-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** có một header navigation với logo, search bar, menu links, giỏ hàng và user menu,
**Để** dễ dàng điều hướng, tìm kiếm sản phẩm và quản lý tài khoản/giỏ hàng.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Header Layout
1.  **Given** người dùng đang ở bất kỳ trang nào (trừ Login),
2.  **When** trang được tải,
3.  **Then** header hiển thị trên cùng một hàng:
    *   **Góc trái:** Logo (text "NEXUS") linking to home
    *   **Trái giữa:** Search input với placeholder "Search products..."
    *   **Phải giữa:** Navigation links (Shop, About, Contact)
    *   **Góc phải:** Cart icon với badge số lượng items, Login button (nếu chưa login) hoặc Avatar user (nếu đã login)

### 1.2. Search Functionality
1.  **Given** người dùng nhập từ khóa vào search input,
2.  **When** người dùng nhấn Enter hoặc submit form,
3.  **Then** hệ thống redirect đến `/search?q={keyword}` (search page chưa implement).

### 1.3. Navigation Links
1.  **Given** người dùng click vào một navigation link (Shop, About, Contact),
2.  **When** link được click,
3.  **Then** hệ thống navigate đến trang tương ứng (`/shop`, `/about`, `/contact`).

### 1.4. Cart Icon
1.  **Given** giỏ hàng có items,
2.  **When** header được render,
3.  **Then** cart icon hiển thị badge với số lượng items (tối đa 99+).
4.  **And** khi click vào cart icon, navigate đến `/cart`.

### 1.5. User Menu (Authenticated)
1.  **Given** người dùng đã đăng nhập,
2.  **When** header được render,
3.  **Then** hiển thị Avatar với user's avatar image (hoặc initials nếu không có avatar).
4.  **And** khi click vào avatar, hiển thị dropdown menu với:
    *   User email
    *   User full name (hoặc username nếu không có full_name)
    *   Separator
    *   "Logout" option
    *   "Logout All" option

### 1.6. Login Button (Unauthenticated)
1.  **Given** người dùng chưa đăng nhập,
2.  **When** header được render,
3.  **Then** hiển thị "Login" button.
4.  **And** khi click, navigate đến `/login`.

### 1.7. User State Management
1.  **Given** người dùng đã login và có access_token trong cookies,
2.  **When** header được mount,
3.  **Then** hệ thống:
    *   Check Zustand store trước (cache)
    *   Nếu không có trong store, fetch user từ `/api/v1/auth/me`
    *   Save user vào Zustand store để cache
    *   Hiển thị avatar với user info

---

## 2. Business Rules
-   Header hiển thị trên tất cả các trang (Home, Shop, About, Contact, Product Detail, Cart).
-   Cart badge cập nhật real-time khi có thay đổi trong giỏ hàng (từ Zustand store).
-   User avatar dropdown chỉ hiển thị khi user đã đăng nhập.
-   Logo luôn link về trang Home (`/`).
-   User state được cache trong Zustand store để tránh gọi API nhiều lần.

---

## 3. Implementation Status

### ✅ Completed Features
- **HomeHeader Component:** Implemented với logo, search, navigation links, cart icon, avatar/login button
- **User Avatar Component:** Dropdown menu hiển thị user email, full name, logout options
- **Cart Badge:** Hiển thị số lượng items trong cart từ Zustand store
- **Authentication State:** Tự động fetch user data khi có access token
- **User State Caching:** Zustand store để cache user data, tránh gọi API nhiều lần
- **Logout Integration:** Clear user từ Zustand store khi logout
- **Responsive Design:** Header hiển thị trên tất cả các page

### 📝 Technical Notes
- Component: `HomeHeader` trong `components/home/home-header.tsx`
- Component: `UserAvatar` trong `components/user/user-avatar.tsx`
- Store: `user-store.ts` (Zustand với persistence)
- Client Auth: `lib/client-auth.ts` để fetch user từ client-side
- Pages sử dụng: Home, Shop, About, Contact, Product Detail, Cart
- Cart Store: `cart-store.ts` để lấy cart item count cho badge

