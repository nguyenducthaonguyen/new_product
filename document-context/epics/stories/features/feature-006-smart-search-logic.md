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

**Note:** Backend API chưa có search endpoint. Cần implement.

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

### 4.1. Search Input (Current)
- [x] **AC-1.1:** Search input hiển thị trong header với placeholder "Search products..."
- [x] **AC-1.2:** Search icon hiển thị bên trái input
- [x] **AC-1.3:** Submit form (Enter) redirect đến `/search?q={keyword}`
- [x] **AC-1.4:** Search query được encode với encodeURIComponent
- [x] **AC-1.5:** Empty search query không submit

### 4.2. Search Page (Pending)
- [ ] **AC-2.1:** Search page hiển thị tại `/search?q={keyword}`
- [ ] **AC-2.2:** Page hiển thị Header và Footer
- [ ] **AC-2.3:** Page hiển thị search query trong heading
- [ ] **AC-2.4:** API call `GET /api/v1/products?search={keyword}`
- [ ] **AC-2.5:** Search results hiển thị trong grid layout (giống Product List)
- [ ] **AC-2.6:** Show số lượng kết quả ("Found X results")
- [ ] **AC-2.7:** Show "No results found" nếu không có kết quả
- [ ] **AC-2.8:** Pagination support (future)

### 4.3. Search Suggestions (Pending)
- [ ] **AC-3.1:** Dropdown hiển thị khi user nhập ≥ 2 ký tự
- [ ] **AC-3.2:** Debounce input (300ms) để tránh quá nhiều requests
- [ ] **AC-3.3:** Show popular searches section
- [ ] **AC-3.4:** Show recent searches section (từ localStorage)
- [ ] **AC-3.5:** Show trending searches section
- [ ] **AC-3.6:** Click suggestion navigate đến `/search?q={suggestion}`

### 4.4. Search History (Pending)
- [ ] **AC-4.1:** Search history lưu trong localStorage
- [ ] **AC-4.2:** Tối đa 5 items gần đây
- [ ] **AC-4.3:** Hiển thị history khi user click vào search input
- [ ] **AC-4.4:** Click history item navigate đến search page
- [ ] **AC-4.5:** Clear history option (future)

---

## 5. 🛠️ Implementation Details

### 5.1. Current Implementation

**Search Input in Header:**
- **File:** `frontend/src/components/home/home-header.tsx`
- **Type:** Client Component (`'use client'`)
- **State:**
  - `searchQuery: string` - Search input value

- **Function:**
  - `handleSearch(e)` - Handle form submit, redirect to `/search?q={keyword}`

### 5.2. Future Implementation

**Search Page Component:**
- **File:** `frontend/src/app/[locale]/search/page.tsx` (to be created)
- **Type:** Server Component
- **Features:**
  - Extract `q` parameter from URL
  - Call `getProducts({ search: q })`
  - Render search results với ProductList component
  - Show "No results found" if empty

**Search Suggestions Component:**
- **File:** `frontend/src/components/search/search-suggestions.tsx` (to be created)
- **Type:** Client Component
- **Features:**
  - Debounce input
  - Fetch suggestions (API or static)
  - Display dropdown với suggestions
  - Handle click to navigate

**Search History Hook:**
- **File:** `frontend/src/hooks/use-search-history.ts` (to be created)
- **Type:** Custom Hook
- **Features:**
  - Save search to localStorage
  - Get recent searches (max 5)
  - Clear search history

### 5.3. Server Actions

**getProducts Function (Update):**
- **File:** `frontend/src/actions/product-action.ts`
- **Current:** Supports `offset` và `limit` parameters
- **Future:** Add `search` parameter
- **Signature:**
  ```typescript
  async function getProducts(params?: {
    offset?: number;
    limit?: number;
    search?: string; // NEW
  })
  ```

### 5.4. Pages

**Search Page (To be created):**
- **File:** `frontend/src/app/[locale]/search/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const result = await getProducts({ search: query });
  return (
    <div>
      <HomeHeader />
      <h1>Search: {query}</h1>
      <p>Found {result.data.length} results</p>
      <ProductList products={result.data} />
      <Footer />
    </div>
  );
  ```

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

