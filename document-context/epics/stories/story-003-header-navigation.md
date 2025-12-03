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
3.  **Then** header hiển thị:
    *   **Sticky Header:** Header luôn hiển thị ở top khi scroll (`sticky top-0 z-50`)
    *   **Container:** Container với padding để tránh overflow
    *   **Mobile (< 640px):** `[☰ Menu] [NEXUS] [🔍] [🛒] [👤]`
      - Menu button (Sheet dropdown từ trái)
      - Logo (text-xl)
      - Search icon button
      - Cart icon
      - Avatar/Login button
    *   **Tablet (640px - 1023px):** `[☰ Menu] [NEXUS] [Search Input...] [🛒] [👤]`
      - Menu button (Sheet dropdown từ trái)
      - Logo (text-2xl)
      - Search input
      - Cart icon
      - Avatar/Login button
    *   **Desktop (≥ 1024px):** `[NEXUS] [Search Input...] [Shop] [About] [Contact] [🛒] [👤]`
      - Logo (text-2xl)
      - Search input
      - Navigation links (full display)
      - Cart icon
      - Avatar/Login button

### 1.2. Search Functionality
1.  **Given** người dùng nhập từ khóa vào search input,
2.  **When** người dùng nhấn Enter hoặc submit form,
3.  **Then** hệ thống redirect đến `/search?q={keyword}` (search page chưa implement).

### 1.3. Navigation Links
1.  **Given** người dùng muốn truy cập navigation links (Shop, About, Contact),
2.  **When** trên Mobile/Tablet,
3.  **Then** hiển thị Menu button (☰) phía trước logo, click mở Sheet menu từ trái với navigation links.
4.  **And** khi trên Desktop (≥ 1024px),
5.  **Then** hiển thị navigation links trực tiếp trên header với padding và hover effects.
6.  **And** khi click vào link,
7.  **Then** hệ thống navigate đến trang tương ứng (`/shop`, `/about`, `/contact`).
8.  **And** Sheet menu tự động đóng sau khi click link.

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
- **Sticky Header:** Header sticky với `sticky top-0 z-50` để luôn hiển thị khi scroll
- **Responsive Layout:** 
  - Mobile: Menu button + Logo + Search icon + Cart + Avatar/Login
  - Tablet: Menu button + Logo + Search input + Cart + Avatar/Login
  - Desktop: Logo + Search input + Navigation links + Cart + Avatar/Login
- **Mobile Menu:** Sheet component với slide-in từ trái, chứa navigation links
- **Navigation Links Styling:** 
  - Desktop: Padding (`px-4 py-2`), rounded, hover background, smooth transitions
  - Mobile Menu: Padding (`px-4 py-3`), rounded, hover effects
- **Search Input:** Ẩn trên mobile, hiển thị search icon button thay thế
- **User Avatar Component:** Dropdown menu hiển thị user email, full name, logout options
- **Cart Badge:** Hiển thị số lượng items trong cart từ Zustand store (chỉ khi mounted)
- **Authentication State:** Tự động fetch user data khi có access token
- **User State Caching:** Zustand store để cache user data, tránh gọi API nhiều lần
- **Logout Integration:** Clear user từ Zustand store khi logout

### 📝 Technical Notes
- Component: `HomeHeader` trong `components/home/home-header.tsx`
- Component: `UserAvatar` trong `components/user/user-avatar.tsx`
- UI Components: `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` từ `@/components/ui/sheet`
- Store: `user-store.ts` (Zustand với persistence)
- Client Auth: `lib/client-auth.ts` để fetch user từ client-side
- Pages sử dụng: Home, Shop, About, Contact, Product Detail, Cart
- Cart Store: `cart-store.ts` để lấy cart item count cho badge
- Responsive Breakpoints:
  - Mobile: `< 640px` (sm)
  - Tablet: `640px - 1023px` (sm to lg)
  - Desktop: `≥ 1024px` (lg+)
- Styling: Tailwind CSS với padding, rounded corners, hover effects, transitions

