# Epic List – NEXUS E-commerce Platform

## EP-01: Product Discovery (Khám phá sản phẩm)
**Mục tiêu:** Giúp người dùng tìm kiếm và xem chi tiết sản phẩm một cách nhanh nhất, trực quan nhất để thúc đẩy quyết định mua hàng.
**Phạm vi:** Homepage, Shop Page, Product Detail Page (PDP), Header Navigation.

### Feature / User Stories
- **EP-01-001: Product Listing** ✅ **COMPLETED**
  - **US-PROD-01: Hiển thị danh sách sản phẩm** ✅ (Story: `stories/story-001-product-listing.md`)
  - **Feature Spec:** `features/feature-001-product-listing-logic.md`
  - Component: `ProductList`, `ProductCard`
  - Page: `/` (Home), `/shop`
  - API: `GET /api/v1/products`

- **EP-01-002: Product Detail View** ✅ **COMPLETED**
  - **US-PROD-02: Xem chi tiết sản phẩm** ✅ (Story: `stories/story-002-product-detail.md`)
  - **Feature Spec:** `features/feature-002-product-detail-logic.md`
  - Component: `ProductDetailView`
  - Page: `/products/[slug]`
  - API: `GET /api/v1/products/{slug}`
  - Features:
    - Image gallery với main image và thumbnails
    - Color selection (circles)
    - Size selection (buttons)
    - Quantity selector với +/- buttons
    - Add to Cart integration
    - Responsive design (Desktop 2-column, Mobile stack)

- **EP-01-003: Header Navigation** ✅ **COMPLETED**
  - **US-NAV-01: Header Navigation với Search và User Menu** ✅ (Story: `stories/story-003-header-navigation.md`)
  - **Feature Spec:** `features/feature-003-header-logic.md`
  - Component: `HomeHeader`, `UserAvatar`
  - Used in: Home, Shop, About, Contact, Product Detail, Cart
  - Features:
    - Logo linking to home
    - Product search input
    - Navigation links (Shop, About, Contact)
    - Cart icon với badge showing item count
    - User avatar dropdown (when logged in) hoặc Login button (when not logged in)
    - User avatar dropdown: email, full name, Logout, Logout All

- **EP-01-004: Homepage Sections** ✅ **COMPLETED**
  - **US-HOME-01: Homepage Sections (Banner, Features, Testimonials)** ✅ (Story: `stories/story-004-homepage-sections.md`)
  - **Feature Spec:** `features/feature-004-homepage-sections-logic.md`
  - Components: `Banner`, `Features`, `Testimonials`
  - Page: `/` (Home)
  - Layout: Header → Banner → Features → Product List → Testimonials → Footer

- **EP-01-005: Smart Search** ✅ **COMPLETED**
  - **US-SEARCH-01: Tìm kiếm sản phẩm thông minh** ✅ (Story: `stories/story-006-smart-search.md`)
  - **Feature Spec:** `features/feature-006-smart-search-logic.md`
  - Component: `SearchSuggestions`, `SearchPageClient`
  - Hook: `useSearchHistory`
  - Page: `/search?q={keyword}`
  - API: `GET /api/v1/products?search={keyword}`
  - Features:
    - Search input trong header với suggestions dropdown
    - Search page với results display
    - Search suggestions: Recent, Popular, Trending
    - Search history với localStorage (max 5 items)
    - Debounce input (300ms)
    - Backend search API (case-insensitive trong name, description, slug)
    - Auto-save search queries to history

---

## EP-02: Shopping Cart & Checkout (Giỏ hàng & Thanh toán)
**Mục tiêu:** Tối ưu hóa tỷ lệ chuyển đổi (Conversion Rate) qua quy trình thanh toán mượt mà, hỗ trợ nhiều phương thức.
**Phạm vi:** Cart Page, Cart Management, Checkout Process.

### Feature / User Stories
- **EP-02-001: Cart Management** ✅ **COMPLETED**
  - **US-CART-01: Quản lý giỏ hàng** ✅ (Story: `stories/story-005-cart-management.md`)
  - **Feature Spec:** `features/feature-005-cart-management-logic.md`
  - Component: `CartView`
  - Page: `/cart`
  - Store: `cart-store.ts` (Zustand với persistence)
  - API Endpoints:
    - `GET /api/v1/cart` - Get full cart with all items ✅
    - `POST /api/v1/cart/items` - Add item to cart ✅
    - `PATCH /api/v1/cart/items/{itemId}` - Update quantity
    - `DELETE /api/v1/cart/items/{itemId}` - Remove item
  - Features:
    - View cart với danh sách items, quantity, price
    - Update quantity với +/- buttons
    - Remove item từ cart
    - Cart total calculation
    - Guest cart support (session_id)
    - User cart support (user_id)
    - Auto-merge items cùng SKU
    - Real-time cart badge update trên header

- **EP-02-002: Checkout Process** ⏳ **PENDING**
  - **US-CHECKOUT-01: Quy trình thanh toán** ⏳ (Story: `stories/story-007-checkout-process.md`)
  - **Feature Spec:** `features/feature-007-checkout-process-logic.md`
  - Nhập địa chỉ, chọn shipping method, thanh toán, xác nhận đơn
  - Chưa implement

- **EP-02-003: Guest Checkout** ⏳ **PENDING**
  - **US-CHECKOUT-02: Thanh toán không cần đăng ký** ⏳ (Story: `stories/story-008-guest-checkout.md`)
  - **Feature Spec:** `features/feature-008-guest-checkout-logic.md`
  - Chưa implement (nhưng guest cart đã được hỗ trợ)

---

## EP-03: User Account & Authentication (Tài khoản)
**Mục tiêu:** Quản lý định danh người dùng, bảo mật thông tin và cá nhân hóa trải nghiệm.
**Phạm vi:** Login, Register, Profile Management, Token Management.

### Feature / User Stories
- **EP-03-001: Authentication** ✅ **COMPLETED**
  - Login với Username/Password
  - Component: `LoginForm`
  - Page: `/login`
  - Store: `user-store.ts` (Zustand với persistence)
  - Server Actions: `auth-action.ts`, `logout-action.ts`, `refresh-action.ts`
  - API Endpoints:
    - `POST /api/v1/auth/login` - Login ✅
    - `POST /api/v1/auth/refresh` - Refresh access token ✅
    - `GET /api/v1/auth/me` - Get current user info ✅
    - `POST /api/v1/auth/logout` - Logout ✅
  - Features:
    - Login form với username/password fields
    - Password visibility toggle
    - Form validation
    - Error handling (invalid credentials, blocked account)
    - Token management (access_token, refresh_token trong HttpOnly cookies)
    - Auto-refresh token khi access_token hết hạn
    - User state management với Zustand
    - Logout với clear user state và cookies
    - Redirect sau login (về trang trước đó hoặc home)

- **EP-03-002: Profile Management** ⏳ **PENDING**
  - Cập nhật thông tin, đổi mật khẩu, quản lý sổ địa chỉ
  - Chưa implement (nhưng user info đã được fetch và hiển thị trong header)

---

## EP-04: Order Management (Quản lý đơn hàng)
**Mục tiêu:** Cung cấp thông tin minh bạch về trạng thái đơn hàng cho khách hàng và công cụ xử lý cho Admin.
**Phạm vi:** Order History, Order Detail, Admin Order Dashboard.

### Feature / User Stories
- **EP-04-001: Order Tracking** ⏳ **PENDING**
  - Xem lịch sử đơn hàng, chi tiết trạng thái, tracking number
  - Chưa implement

- **EP-04-002: Order Cancellation/Return** ⏳ **PENDING**
  - Yêu cầu hủy/trả hàng
  - Chưa implement

---

## EP-05: Static Pages (Trang tĩnh)
**Mục tiêu:** Cung cấp thông tin về công ty, liên hệ, và các trang hỗ trợ khách hàng.
**Phạm vi:** About Page, Contact Page.

### Feature / User Stories
- **EP-05-001: About Page** ✅ **COMPLETED**
  - **US-STATIC-01: Trang giới thiệu** ✅ (Story: `stories/story-009-about-page.md`)
  - **Feature Spec:** `features/feature-009-about-page-logic.md`
  - Page: `/about`
  - Layout: Header → Banner → About Content → Footer

- **EP-05-002: Contact Page** ✅ **COMPLETED**
  - **US-STATIC-02: Trang liên hệ** ✅ (Story: `stories/story-010-contact-page.md`)
  - **Feature Spec:** `features/feature-010-contact-page-logic.md`
  - Component: `ContactForm`
  - Page: `/contact`
  - Layout: Header → Banner → Contact Info Cards → Contact Form → Footer
  - Features:
    - Contact information cards (Email, Phone, Hours, Address)
    - Contact form (Name, Email, Subject, Message)

---

## 📊 Implementation Summary

### ✅ Completed Features (9/14)
1. **Product Listing** - Homepage và Shop page
2. **Product Detail View** - Full implementation với variant selection
3. **Header Navigation** - Complete với user authentication integration
4. **Homepage Sections** - Banner, Features, Testimonials
5. **Smart Search** - Search page, suggestions, history
6. **Cart Management** - Full CRUD operations
7. **Authentication** - Login, Logout, Token Management, Auto-refresh
8. **About Page** - Static content page
9. **Contact Page** - With contact form

### ⏳ Pending Features (5/14)
1. **Checkout Process** - Chưa implement
2. **Guest Checkout** - Chưa implement (nhưng guest cart đã support)
3. **Profile Management** - Chưa implement
4. **Order Tracking** - Chưa implement
5. **Order Cancellation/Return** - Chưa implement

### 🛠️ Technical Stack
- **Frontend Framework:** Next.js 14+ (App Router)
- **UI Library:** React, TypeScript, Tailwind CSS, Shadcn UI
- **State Management:** Zustand với persistence
- **API Client:** Custom HttpClient với auto-refresh token
- **Authentication:** JWT tokens (access_token, refresh_token) trong HttpOnly cookies
- **Internationalization:** next-intl
- **Form Handling:** React Hook Form, Zod validation

### 📁 Key Components
- **Layout:** `HomeHeader`, `Banner`, `Footer`
- **Product:** `ProductList`, `ProductCard`, `ProductDetailView`
- **Search:** `SearchSuggestions`, `SearchPageClient`
- **Cart:** `CartView`
- **Auth:** `LoginForm`, `UserAvatar`
- **Hooks:** `useSearchHistory`
- **Pages:** Home, Shop, Product Detail, Cart, Search, About, Contact, Login

