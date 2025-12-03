# User Story: Tìm kiếm sản phẩm thông minh
**Story ID:** US-SEARCH-01
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-SEARCH-001** | Smart Search (Logic & UI) | `features/feature-006-smart-search-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** tìm kiếm sản phẩm với gợi ý và lịch sử tìm kiếm,
**Để** nhanh chóng tìm được sản phẩm tôi cần.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Search Input (Current Implementation)
1.  **Given** người dùng đang ở header,
2.  **When** người dùng nhập từ khóa vào search input và nhấn Enter,
3.  **Then** hệ thống redirect đến `/search?q={keyword}` (search page chưa implement).

### 1.2. Search Page (Pending)
1.  **Given** người dùng truy cập `/search?q={keyword}`,
2.  **When** search page được tải,
3.  **Then** hệ thống:
    *   Gọi API `GET /api/v1/products?search={keyword}`
    *   Hiển thị kết quả tìm kiếm
    *   Hiển thị số lượng kết quả
    *   Hiển thị "No results found" nếu không có kết quả

### 1.3. Search Suggestions (Pending)
1.  **Given** người dùng đang nhập vào search input,
2.  **When** người dùng nhập ít nhất 2 ký tự,
3.  **Then** hiển thị dropdown với:
    *   Gợi ý sản phẩm phổ biến
    *   Lịch sử tìm kiếm (từ localStorage)
    *   Trending searches

### 1.4. Search History (Pending)
1.  **Given** người dùng đã tìm kiếm trước đó,
2.  **When** người dùng click vào search input,
3.  **Then** hiển thị lịch sử tìm kiếm gần đây (tối đa 5 items).

---

## 2. Business Rules
-   Search không phân biệt hoa thường.
-   Search có thể tìm theo tên sản phẩm, mô tả.
-   Lịch sử tìm kiếm được lưu trong localStorage (client-side).
-   Guest User có thể sử dụng search mà không cần đăng nhập.

---

## 3. Implementation Status

### ⏳ Pending Features
- **Search Page:** Chưa implement (`/search?q={keyword}`)
- **Search API Integration:** Backend API chưa có search endpoint
- **Search Suggestions:** Chưa implement
- **Search History:** Chưa implement

### ✅ Current Implementation
- **Search Input:** Đã có trong header, redirect đến `/search?q={keyword}` (nhưng search page chưa tồn tại)

### 📝 Technical Notes
- Component: Search input trong `components/home/home-header.tsx`
- Current behavior: Redirect đến `/search?q={keyword}` khi submit
- Pending: Search page component, search API endpoint, search suggestions, search history

