# User Story: Trang liên hệ
**Story ID:** US-STATIC-02
**Epic:** EP-05 Static Pages

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-STATIC-002** | Contact Page (Logic & UI) | `features/feature-010-contact-page-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** liên hệ với công ty qua trang Contact,
**Để** đặt câu hỏi, phản hồi hoặc yêu cầu hỗ trợ.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Contact Information Cards
1.  **Given** người dùng truy cập trang Contact (`/contact`),
2.  **When** trang được tải,
3.  **Then** hiển thị grid 2 columns (Desktop) / 1 column (Mobile) với 4 cards:
    *   **Email Card:** Title "Email", Description "Send us an email", Content "support@nexus.com"
    *   **Phone Card:** Title "Phone", Description "Call us", Content "+1 (555) 123-4567"
    *   **Hours Card:** Title "Hours", Description "Business hours", Content "Monday - Friday: 9AM - 6PM, Saturday - Sunday: 10AM - 4PM"
    *   **Address Card:** Title "Address", Description "Visit us", Content "123 Commerce Street, San Francisco, CA 94102"

### 1.2. Contact Form
1.  **Given** người dùng scroll xuống contact form,
2.  **When** form được hiển thị,
3.  **Then** form có các fields:
    *   Name (required, text input)
    *   Email (required, email input)
    *   Subject (required, text input)
    *   Message (required, textarea, rows=6)
    *   "Send Message" button

### 1.3. Form Submission
1.  **Given** người dùng đã điền đầy đủ thông tin,
2.  **When** người dùng click "Send Message",
3.  **Then** hệ thống:
    *   Validate form (tất cả fields required)
    *   Hiển thị loading state
    *   Hiển thị toast message "Thank you for your message! We will get back to you soon."
    *   Clear form sau khi submit thành công

### 1.4. Layout Structure
1.  **Given** người dùng truy cập trang Contact,
2.  **When** trang được tải,
3.  **Then** layout hiển thị theo thứ tự:
    *   Header
    *   Banner
    *   Heading "Contact Us" và description
    *   Contact Information Cards (grid)
    *   Contact Form
    *   Footer

---

## 2. Business Rules
-   Contact page là static page, không cần authentication.
-   Contact form hiện tại chỉ hiển thị success message (chưa tích hợp backend API).
-   Form validation: Tất cả fields đều required.

---

## 3. Implementation Status

### ✅ Completed Features
- **Contact Page:** Implemented với contact info cards và contact form
- **Contact Form Component:** `ContactForm` với validation
- **Contact Info Cards:** Grid layout với 4 cards (Email, Phone, Hours, Address)
- **Layout:** Header → Banner → Contact Info → Contact Form → Footer
- **Form Handling:** Client-side form với toast notification

### 📝 Technical Notes
- Component: `ContactForm` trong `components/contact/contact-form.tsx`
- Page: `app/[locale]/contact/page.tsx`
- Layout: Sử dụng `HomeHeader`, `Banner`, `Footer` components
- Form: Client component với React state management
- Toast: Sử dụng `sonner` library
- Pending: Backend API integration cho contact form submission

