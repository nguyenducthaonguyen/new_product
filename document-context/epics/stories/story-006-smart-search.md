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

### 1.2. Search Page (✅ Completed)
1.  **Given** người dùng truy cập `/search?q={keyword}`,
2.  **When** search page được tải,
3.  **Then** hệ thống:
    *   ✅ Gọi API `GET /api/v1/products?search={keyword}`
    *   ✅ Hiển thị kết quả tìm kiếm với ProductList component
    *   ✅ Hiển thị số lượng kết quả ("Found X results")
    *   ✅ Hiển thị "No results found" nếu không có kết quả
    *   ✅ Hiển thị Header và Footer
    *   ✅ Tự động lưu search query vào history

### 1.3. Search Suggestions (✅ Completed)
1.  **Given** người dùng click vào search input,
2.  **When** input được focus,
3.  **Then** hiển thị ngay dropdown với:
    *   ✅ Lịch sử tìm kiếm gần đây (từ localStorage, tối đa 5 items)
    *   ✅ Gợi ý sản phẩm phổ biến (Popular Searches)
    *   ✅ Trending searches
4.  **And** khi người dùng nhập ít nhất 2 ký tự,
5.  **Then** filter suggestions theo query
6.  **And** click suggestion navigate đến `/search?q={suggestion}`

### 1.4. Search History (✅ Completed)
1.  **Given** người dùng đã tìm kiếm trước đó,
2.  **When** người dùng click vào search input,
3.  **Then** hiển thị lịch sử tìm kiếm gần đây (tối đa 5 items) trong dropdown.
4.  **And** khi người dùng search (từ header hoặc search page),
5.  **Then** search query tự động được lưu vào localStorage.

---

## 2. Business Rules
-   Search không phân biệt hoa thường.
-   Search có thể tìm theo tên sản phẩm, mô tả.
-   Lịch sử tìm kiếm được lưu trong localStorage (client-side).
-   Guest User có thể sử dụng search mà không cần đăng nhập.

---

## 3. Implementation Status

### ✅ Completed Features

#### 3.1. Search Input trong Header
- **Component:** `components/home/home-header.tsx`
- **Features:**
  - Search input với placeholder "Search products..."
  - Submit form (Enter) redirect đến `/search?q={keyword}`
  - Search query được encode với `encodeURIComponent`
  - Empty query không submit
  - Responsive: Ẩn trên mobile (`hidden sm:flex`), hiển thị search icon button thay thế
  - Search icon button trên mobile redirect đến `/search` page

#### 3.2. Search Page
- **Component:** `app/[locale]/search/page.tsx` (Server Component)
- **Features:**
  - Hiển thị tại `/search?q={keyword}`
  - Extract search query từ URL `searchParams`
  - Gọi API `GET /api/v1/products?search={keyword}`
  - Hiển thị search results với `ProductList` component
  - Hiển thị số lượng kết quả ("Found X results")
  - Handle "No results found" state với message
  - Hiển thị Header và Footer
  - Dynamic metadata cho SEO
  - Auto-save search query vào history

#### 3.3. Backend Search API
- **Endpoint:** `GET /api/v1/products?search={keyword}&offset=0&limit=50`
- **Implementation:**
  - `ProductRepository.get_all()` hỗ trợ `search` parameter
  - Search không phân biệt hoa thường trong `name`, `description`, và `slug`
  - `ProductService.list_products()` accept `search` parameter
  - API endpoint accept `search` query parameter (optional)

#### 3.4. Search Suggestions
- **Component:** `components/search/search-suggestions.tsx`
- **Features:**
  - Dropdown hiển thị khi click vào search input (ngay lập tức)
  - Hiển thị khi nhập ≥ 2 ký tự (filter suggestions)
  - Debounce input (300ms) để tránh quá nhiều requests
  - 3 sections:
    - **Recent Searches:** Từ localStorage (tối đa 5 items)
    - **Popular Searches:** Static data (Laptop, Smartphone, Headphones, Camera, Tablet)
    - **Trending Searches:** Static data (Wireless Earbuds, Gaming Mouse, Smart Watch)
  - Filter suggestions theo query khi có input
  - Click suggestion navigate đến `/search?q={suggestion}`
  - Auto-close khi click outside hoặc nhấn Escape
  - Tự động lưu suggestion vào history khi click

#### 3.5. Search History
- **Hook:** `hooks/use-search-history.ts`
- **Features:**
  - Lưu search history trong localStorage
  - Tối đa 5 items gần đây
  - Tự động loại bỏ duplicate
  - Hiển thị history trong suggestions dropdown
  - Click history item navigate đến search page
  - Memoized với `useCallback` để tránh infinite loops
  - Auto-save khi search từ header hoặc search page

### 📝 Technical Notes

#### Frontend Components:
- **Search Input:** `components/home/home-header.tsx`
  - State: `searchQuery`, `showSuggestions`, `debouncedQuery`
  - Functions: `handleSearch()`, `handleSuggestionSelect()`, `handleInputFocus()`, `handleInputBlur()`
  - Debounce: 300ms delay
  - Integration: `SearchSuggestions` component

- **Search Page:** `app/[locale]/search/page.tsx`
  - Server Component
  - Extract `q` từ `searchParams`
  - Call `getProducts({ search: query })`
  - Render với `ProductList` component
  - Client component: `SearchPageClient` để auto-save history

- **Search Suggestions:** `components/search/search-suggestions.tsx`
  - Client Component
  - Props: `query`, `isOpen`, `onClose`, `onSelect`
  - Uses `useSearchHistory` hook
  - Click outside và Escape key handling

- **Search History Hook:** `hooks/use-search-history.ts`
  - Custom hook với `useCallback` memoization
  - localStorage key: `'search-history'`
  - Functions: `addToHistory()`, `clearHistory()`

#### Backend Implementation:
- **ProductRepository:** `repositories/product_repository.py`
  - `get_all(offset, limit, search)` method
  - SQLAlchemy `func.lower()` và `like()` với wildcard `%search_term%`
  - Search trong `name`, `description`, và `slug` fields

- **ProductService:** `services/product_service.py`
  - `list_products(offset, limit, search)` method
  - Pass search parameter to repository

- **API Endpoint:** `api/v1/product.py`
  - `GET /api/v1/products?search={keyword}&offset=0&limit=50`
  - Optional `search` query parameter
  - Returns `ProductDetail[]` với search results

#### Server Actions:
- **getProducts:** `actions/product-action.ts`
  - Updated to support `search?: string` parameter
  - Type-safe với TypeScript

