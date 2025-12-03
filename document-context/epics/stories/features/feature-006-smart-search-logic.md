# 📄 Feature Specification: FE-SEARCH-001 - Smart Search (Logic & UI)

**Parent Story:** [US-SEARCH-01: Tìm kiếm sản phẩm thông minh](../story-006-smart-search.md)
**Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Current Implementation (Search Input in Header)

**Search Input Location:**
- Position: Center-left trong header
- Layout: `flex-1 max-w-lg mx-4`
- Input: Full width với padding left for icon
- Icon: Search icon (Lucide) absolute left, `h-4 w-4`
- Placeholder: "Search products..."

**Search Input States:**
- **Default:** Border, focus ring
- **Focus:** Ring highlight
- **Submit:** Redirect to `/search?q={keyword}`

### 1.2. Future Implementation (Search Page)

**Search Page Layout (`/search?q={keyword}`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Search Results                          │
│ ┌─────────────────────────────────────┐ │
│ │ Search: "keyword"                  │ │
│ │ Found 15 results                   │ │
│ │                                     │ │
│ │ [Product Grid]                      │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ │
│ │ │Card│ │Card│ │Card│ │Card│       │ │
│ │ └────┘ └────┘ └────┘ └────┘       │ │
│ │                                     │ │
│ │ [Pagination]                        │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### 1.3. Future Implementation (Search Suggestions)

**Search Suggestions Dropdown:**
```
┌─────────────────────────────────────────┐
│ [Search Input...]                       │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Popular Searches                 │ │
│ │   • Product A                       │ │
│ │   • Product B                       │ │
│ ├─────────────────────────────────────┤ │
│ │ 📜 Recent Searches                 │ │
│ │   • keyword 1                       │ │
│ │   • keyword 2                       │ │
│ ├─────────────────────────────────────┤ │
│ │ 🔥 Trending                         │ │
│ │   • trending 1                      │ │
│ │   • trending 2                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 2. 🧠 Business Logic & Rules

### 2.1. Current Data Flow

```
User types in search input
  ↓
User presses Enter or submits form
  ↓
Validate: searchQuery.trim() must not be empty
  ↓
Encode query: encodeURIComponent(searchQuery.trim())
  ↓
Navigate: router.push(/search?q={encodedQuery})
  ↓
Search page (NOT IMPLEMENTED YET)
```

### 2.2. Future Data Flow (Search Page)

```
Page Load (/search?q={keyword})
  ↓
Server Component (page.tsx)
  ↓
Extract query parameter: q
  ↓
getProducts({ search: keyword }) Server Action
  ↓
GET /api/v1/products?search={keyword}
  ↓
Response: ProductListItem[]
  ↓
Validate với ProductListItemSchema
  ↓
Pass to ProductList Component
  ↓
Render search results
```

### 2.3. Future Data Flow (Search Suggestions)

```
User types in search input (≥ 2 characters)
  ↓
Debounce input (300ms)
  ↓
Check localStorage for search history
  ↓
Fetch popular/trending searches (API or static)
  ↓
Display dropdown với suggestions
  ↓
User clicks suggestion
  ↓
Navigate to /search?q={suggestion}
```

### 2.4. Business Rules

1. **Current Implementation:**
   - Search input trong header
   - Submit redirect đến `/search?q={keyword}`
   - Search page chưa implement

2. **Future Implementation:**
   - Search không phân biệt hoa thường
   - Search tìm theo tên sản phẩm và mô tả
   - Search results hiển thị trong grid layout (giống Product List)
   - Show "No results found" nếu không có kết quả

3. **Search Suggestions:**
   - Hiển thị khi user nhập ≥ 2 ký tự
   - Debounce 300ms để tránh quá nhiều requests
   - Show popular searches, recent searches, trending searches
   - Click suggestion → Navigate to search page

4. **Search History:**
   - Lưu trong localStorage (client-side)
   - Tối đa 5 items gần đây
   - Hiển thị khi user click vào search input
   - Clear history option (future)

5. **Guest User:**
   - Có thể sử dụng search mà không cần đăng nhập
   - Search history lưu trong localStorage (per browser)

### 2.5. Edge Cases

| Case | Behavior |
|------|----------|
| **Empty search query** | Không submit, không redirect |
| **Search page not found** | Show 404 hoặc redirect to home |
| **No search results** | Show "No results found" message |
| **Special characters in query** | Encode với encodeURIComponent |
| **Very long search query** | Truncate hoặc validate max length |
| **Search API error** | Show error message, allow retry |

---

## 3. 🔌 API Requirements

### 3.1. Search Products (Future)

**Endpoint:** `GET /api/v1/products?search={keyword}`

**Request Parameters:**
- `search`: string (required) - Search keyword
- `offset`: number (optional) - Pagination offset
- `limit`: number (optional) - Number of results per page

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": "1",
      "name": "Product Name",
      "slug": "product-name",
      "price": 99.99,
      "currency": "$",
      "images": ["https://example.com/image.jpg"],
      "rating": 4.5,
      "review_count": 123
    }
  ]
}
```

**Note:** 
- ✅ Backend API đã có search endpoint
- ✅ `GET /api/v1/products?search={keyword}` hỗ trợ `search`, `offset`, và `limit` parameters
- ✅ `ProductRepository.get_all(offset, limit, search)` có search filter
- ✅ `ProductService.list_products(offset, limit, search)` có search parameter
- ✅ Search logic: Case-insensitive search trong `name`, `description`, và `slug` fields
- ✅ Uses SQLAlchemy `func.lower()` và `like()` với wildcard `%search_term%`

### 3.2. Search Suggestions (Future)

**Endpoint:** `GET /api/v1/products/suggestions?q={keyword}` (Future)

**Request Parameters:**
- `q`: string (required) - Partial search keyword (≥ 2 characters)

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "popular": ["Product A", "Product B"],
    "trending": ["Trending 1", "Trending 2"],
    "recent": ["Recent 1", "Recent 2"]
  }
}
```

**Note:** API chưa implement. Có thể sử dụng static data hoặc localStorage cho suggestions.

---

## 4. 📝 Acceptance Criteria

### 4.1. Search Input (Current - ✅ Completed)
- [x] **AC-1.1:** Search input hiển thị trong header với placeholder "Search products..."
- [x] **AC-1.2:** Search icon hiển thị bên trái input
- [x] **AC-1.3:** Submit form (Enter) redirect đến `/search?q={keyword}`
- [x] **AC-1.4:** Search query được encode với encodeURIComponent
- [x] **AC-1.5:** Empty search query không submit
- [x] **AC-1.6:** Search input responsive: Ẩn trên mobile (`hidden sm:flex`), hiển thị search icon button
- [x] **AC-1.7:** Search icon button trên mobile redirect đến `/search` page

### 4.2. Search Page (✅ Completed)
- [x] **AC-2.1:** Search page hiển thị tại `/search?q={keyword}`
- [x] **AC-2.2:** Page hiển thị Header và Footer
- [x] **AC-2.3:** Page hiển thị search query trong heading
- [x] **AC-2.4:** API call `GET /api/v1/products?search={keyword}`
- [x] **AC-2.5:** Search results hiển thị trong grid layout (giống Product List)
- [x] **AC-2.6:** Show số lượng kết quả ("Found X results")
- [x] **AC-2.7:** Show "No results found" nếu không có kết quả
- [x] **AC-2.8:** Auto-save search query vào history
- [ ] **AC-2.9:** Pagination support (future)

### 4.3. Search Suggestions (✅ Completed)
- [x] **AC-3.1:** Dropdown hiển thị khi user click vào search input (ngay lập tức)
- [x] **AC-3.2:** Dropdown hiển thị khi user nhập ≥ 2 ký tự (filter suggestions)
- [x] **AC-3.3:** Debounce input (300ms) để tránh quá nhiều requests
- [x] **AC-3.4:** Show popular searches section
- [x] **AC-3.5:** Show recent searches section (từ localStorage)
- [x] **AC-3.6:** Show trending searches section
- [x] **AC-3.7:** Filter suggestions theo query khi có input
- [x] **AC-3.8:** Click suggestion navigate đến `/search?q={suggestion}`
- [x] **AC-3.9:** Auto-close khi click outside hoặc nhấn Escape
- [x] **AC-3.10:** Auto-save suggestion vào history khi click

### 4.4. Search History (✅ Completed)
- [x] **AC-4.1:** Search history lưu trong localStorage
- [x] **AC-4.2:** Tối đa 5 items gần đây
- [x] **AC-4.3:** Hiển thị history khi user click vào search input
- [x] **AC-4.4:** Click history item navigate đến search page
- [x] **AC-4.5:** Tự động loại bỏ duplicate trong history
- [x] **AC-4.6:** Auto-save khi search từ header hoặc search page
- [ ] **AC-4.7:** Clear history option (future)

---

## 5. 🛠️ Implementation Details

### 5.1. Search Input in Header (✅ Completed)

**Component:**
- **File:** `frontend/src/components/home/home-header.tsx`
- **Type:** Client Component (`'use client'`)
- **State:**
  - `searchQuery: string` - Search input value
  - `showSuggestions: boolean` - Control suggestions dropdown visibility
  - `debouncedQuery: string` - Debounced search query (300ms delay)

- **Functions:**
  - `handleSearch(e)` - Handle form submit, redirect to `/search?q={keyword}`, save to history
  - `handleSuggestionSelect(query)` - Handle suggestion click, navigate and save to history
  - `handleInputFocus()` - Show suggestions when input is focused
  - `handleInputBlur()` - Hide suggestions when input loses focus (with delay)
  
- **Integration:**
  - Uses `SearchSuggestions` component
  - Uses `useSearchHistory` hook
  - Debounce: 300ms delay
  
- **Responsive Behavior:**
  - Desktop/Tablet: Search input hiển thị (`hidden sm:flex`) với suggestions dropdown
  - Mobile: Search input ẩn, hiển thị search icon button (`sm:hidden`)
  - Search icon button: Click redirect đến `/search` page

- **Implementation Status:**
  - ✅ Search input trong header
  - ✅ Form submit với Enter key
  - ✅ Query encoding
  - ✅ Empty query validation
  - ✅ Responsive design
  - ✅ Search suggestions integration
  - ✅ Search history integration

### 5.2. Search Page Component (✅ Completed)

**Component:**
- **File:** `frontend/src/app/[locale]/search/page.tsx`
- **Type:** Server Component
- **Status:** ✅ Implemented
- **Features:**
  - ✅ Extract `q` parameter from URL `searchParams`
  - ✅ Call `getProducts({ search: q, offset: 0, limit: 50 })`
  - ✅ Render search results với `ProductList` component
  - ✅ Show "No results found" if empty
  - ✅ Hiển thị Header và Footer
  - ✅ Hiển thị search query trong heading
  - ✅ Hiển thị số lượng kết quả ("Found X results")
  - ✅ Dynamic metadata cho SEO
  - ✅ Client component `SearchPageClient` để auto-save history

**Search Suggestions Component:**
- **File:** `frontend/src/components/search/search-suggestions.tsx`
- **Type:** Client Component
- **Status:** ✅ Implemented
- **Props:**
  - `query: string` - Search query
  - `isOpen: boolean` - Control dropdown visibility
  - `onClose: () => void` - Close handler
  - `onSelect: (query: string) => void` - Selection handler
- **Features:**
  - ✅ Display dropdown với suggestions
  - ✅ Show popular searches (static data)
  - ✅ Show recent searches (từ localStorage via `useSearchHistory`)
  - ✅ Show trending searches (static data)
  - ✅ Filter suggestions theo query khi có input
  - ✅ Show all suggestions khi không có query (click vào input)
  - ✅ Handle click to navigate và save to history
  - ✅ Click outside và Escape key để đóng
  - ✅ Uses `useSearchHistory` hook

**Search History Hook:**
- **File:** `frontend/src/hooks/use-search-history.ts`
- **Type:** Custom Hook
- **Status:** ✅ Implemented
- **Features:**
  - ✅ Save search to localStorage (key: `'search-history'`)
  - ✅ Get recent searches (max 5 items)
  - ✅ Auto-remove duplicates
  - ✅ Memoized với `useCallback` để tránh infinite loops
  - ✅ Load history from localStorage on mount
  - ✅ Functions: `addToHistory()`, `clearHistory()`
  - ✅ Return: `{ history, addToHistory, clearHistory }`

**Search Page Client Component:**
- **File:** `frontend/src/components/search/search-page-client.tsx`
- **Type:** Client Component (`'use client'`)
- **Status:** ✅ Implemented
- **Features:**
  - ✅ Auto-save search query to history when page loads
  - ✅ Use `useRef` to prevent duplicate saves
  - ✅ Only save once per unique query

### 5.3. Server Actions

**getProducts Function (✅ Updated):**
- **File:** `frontend/src/actions/product-action.ts`
- **Status:** ✅ Updated to support `search` parameter
- **Signature:**
  ```typescript
  async function getProducts(params?: {
    offset?: number;
    limit?: number;
    search?: string; // ✅ Added
  })
  ```
- **Backend API:** ✅ `GET /api/v1/products?search={keyword}` endpoint implemented

### 5.4. Backend Implementation

**ProductRepository:**
- **File:** `backend/functions/product_manager/app/repositories/product_repository.py`
- **Method:** `get_all(offset, limit, search)`
- **Search Logic:**
  - Case-insensitive search với `func.lower()`
  - Search trong `name`, `description`, và `slug` fields
  - Uses SQLAlchemy `like()` với wildcard `%search_term%`

**ProductService:**
- **File:** `backend/functions/product_manager/app/services/product_service.py`
- **Method:** `list_products(offset, limit, search)`
- **Features:**
  - Accept optional `search` parameter
  - Pass to repository
  - Return `List[ProductDetail]`

**API Endpoint:**
- **File:** `backend/functions/product_manager/app/api/v1/product.py`
- **Endpoint:** `GET /api/v1/products?search={keyword}&offset=0&limit=50`
- **Parameters:**
  - `search: Optional[str]` - Search keyword (optional)
  - `offset: int = 0` - Pagination offset
  - `limit: int = 50` - Number of results
- **Response:** `{ "success": true, "data": ProductDetail[] }`

---

## 6. ✅ Testing Checklist

### 6.1. Current Implementation Tests
- [x] Search input hiển thị trong header
- [x] Submit form redirect đến `/search?q={keyword}`
- [x] Empty query không submit
- [x] Query được encode correctly

### 6.2. Future Implementation Tests
- [ ] Search page loads với correct query parameter
- [ ] Search API call với correct parameters
- [ ] Search results hiển thị correctly
- [ ] "No results found" hiển thị khi empty
- [ ] Search suggestions dropdown works
- [ ] Search history saves và loads correctly
- [ ] Debounce works correctly (300ms)

### 6.3. Edge Case Tests
- [ ] Special characters in search query
- [ ] Very long search query
- [ ] Empty search results
- [ ] Search API error
- [ ] Network timeout

---

## 7. 📚 Related Documentation

- **Story:** [US-SEARCH-01: Tìm kiếm sản phẩm thông minh](../story-006-smart-search.md)
- **Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)
- **Product Listing:** [FE-PROD-001: Product Listing](./feature-001-product-listing-logic.md)
- **Header:** [FE-NAV-001: Header Component](./feature-003-header-logic.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

---

## 8. 🚧 Implementation Roadmap

### Phase 1: Basic Search Page (Priority: High)
1. Create search page component (`/search?q={keyword}`)
2. Update `getProducts` to support `search` parameter
3. Backend: Implement search endpoint `GET /api/v1/products?search={keyword}`
4. Display search results với ProductList component
5. Handle empty results state

### Phase 2: Search Suggestions (Priority: Medium)
1. Create SearchSuggestions component
2. Implement debounce logic
3. Fetch popular/trending searches (API or static)
4. Display dropdown với suggestions
5. Handle click to navigate

### Phase 3: Search History (Priority: Low)
1. Create `useSearchHistory` hook
2. Save searches to localStorage
3. Display recent searches in dropdown
4. Clear history option

