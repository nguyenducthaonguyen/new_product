# User Story: Homepage Sections (Banner, Features, Testimonials)
**Story ID:** US-HOME-01
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-HOME-001** | Homepage Sections (Logic & UI) | `features/feature-004-homepage-sections-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** xem các section trên Homepage (Banner, Features, Testimonials),
**Để** hiểu rõ hơn về thương hiệu và các tính năng nổi bật của website.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Banner Section
1.  **Given** người dùng truy cập trang Home (`/`),
2.  **When** trang được tải,
3.  **Then** hiển thị Banner section với:
    *   Background gradient (dark gray)
    *   Heading "Welcome to NEXUS"
    *   Description text về website
    *   "Shop Now" button (link to `/shop`)
    *   "Learn More" button (link to `/about`)

### 1.2. Features Section
1.  **Given** người dùng scroll xuống Features section,
2.  **When** section được hiển thị,
3.  **Then** hiển thị grid 4 columns (Desktop) / 2 columns (Tablet) / 1 column (Mobile) với:
    *   Heading "Why Choose NEXUS?"
    *   4 feature cards:
      - Free Shipping (Car icon)
      - Secure Payment (CreditCard icon)
      - 24/7 Support (Headset icon)
      - Quality Guarantee (ShieldCheck icon)
    *   Mỗi card có icon, title, và description

### 1.3. Testimonials Section
1.  **Given** người dùng scroll xuống Testimonials section,
2.  **When** section được hiển thị,
3.  **Then** hiển thị grid 4 columns (Desktop) / 2 columns (Tablet) / 1 column (Mobile) với:
    *   Heading "What Our Customers Say"
    *   4 testimonial cards:
      - 5-star rating
      - Quote text
      - Author name
      - Author role
    *   Background light gray

### 1.4. Layout Structure
1.  **Given** người dùng truy cập trang Home,
2.  **When** trang được tải,
3.  **Then** layout hiển thị theo thứ tự:
    *   Header
    *   Banner
    *   Features
    *   Featured Products (Product List)
    *   Testimonials
    *   Footer

---

## 2. Business Rules
-   Tất cả sections đều responsive (Desktop, Tablet, Mobile).
-   Banner section có full-width background.
-   Features và Testimonials sections có container với padding.

---

## 3. Implementation Status

### ✅ Completed Features
- **Banner Component:** Full-width banner với gradient background, heading, description, CTA buttons
- **Features Component:** Grid layout với 4 feature cards (Free Shipping, Secure Payment, 24/7 Support, Quality Guarantee)
- **Testimonials Component:** Grid layout với 4 testimonial cards (5-star ratings, quotes, authors)
- **Homepage Integration:** Tất cả sections được tích hợp vào Homepage
- **Responsive Design:** Desktop, Tablet, Mobile layouts

### 📝 Technical Notes
- Component: `Banner` trong `components/layout/banner.tsx`
- Component: `Features` trong `components/home/features.tsx`
- Component: `Testimonials` trong `components/home/testimonials.tsx`
- Page: `app/[locale]/page.tsx` (Home)
- Icons: Lucide React icons (Car, CreditCard, Headset, ShieldCheck, Star)

