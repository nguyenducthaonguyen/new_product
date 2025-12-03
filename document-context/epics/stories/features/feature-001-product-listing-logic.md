# 📄 Feature Specification: FE-PROD-001 - Product Listing (Logic & UI)

**Parent Story:** [US-PROD-01: Hiển thị danh sách sản phẩm](../story-001-product-listing.md)
**Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

#### Homepage (`/`)
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Banner Section                          │
├─────────────────────────────────────────┤
│ Features Section                         │
├─────────────────────────────────────────┤
│ Featured Products Section                │
│ ┌─────────────────────────────────────┐ │
│ │ <h1>Featured Products</h1>          │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │ │
│ │ │Card│ │Card│ │Card│ │Card│ ...     │ │
│ │ └────┘ └────┘ └────┘ └────┘         │ │
│ │ (Grid: 1/2/3/4 columns responsive)  │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Testimonials Section                    │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

#### Shop Page (`/shop`)
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Banner Section                          │
├─────────────────────────────────────────┤
│ Shop All Products Section               │
│ ┌─────────────────────────────────────┐ │
│ │ <h1>Shop All Products</h1>          │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │ │
│ │ │Card│ │Card│ │Card│ │Card│ ...     │ │
│ │ └────┘ └────┘ └────┘ └────┘         │ │
│ │ (Grid: 1/2/3/4 columns responsive)  │ │
│ │ (Max 50 items)                       │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### 1.2. Product Card Design

**Card Structure:**
```
┌─────────────────────┐
│                     │
│   Product Image     │
│   (Aspect Square)   │
│   (Hover: Scale)    │
│                     │
├─────────────────────┤
│ Product Name        │
│ (2 lines max)       │
│                     │
│ ⭐ 4.5 (123)        │
│                     │
├─────────────────────┤
│ $ 99.99             │
└─────────────────────┘
```

**Card States:**
- **Default:** Card với border, shadow-sm
- **Hover:** Shadow-lg, image scale 105%
- **Loading:** Skeleton loaders (image, text, price)
- **Empty:** "No products found" message

### 1.3. Responsive Grid Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile (< 640px) | 1 | 24px (gap-6) |
| Tablet (640px - 1024px) | 2 | 24px |
| Desktop (1024px - 1280px) | 3 | 24px |
| Large Desktop (≥ 1280px) | 4 | 24px |

**Grid Classes:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

```
Page Load
  ↓
Server Component (page.tsx)
  ↓
getProducts({ offset: 0, limit: 20/50 })
  ↓
Server Action (product-action.ts)
  ↓
httpClient.get('/api/v1/products', { params })
  ↓
Backend API (GET /api/v1/products)
  ↓
Response: ProductListItem[]
  ↓
Validate với ProductListItemSchema
  ↓
Pass to ProductList Component
  ↓
Render ProductCard for each product
```

### 2.2. Component Hierarchy

```
Page (Server Component)
  └── ProductList (Client Component)
      ├── Loading State → Skeleton Loaders (8 items)
      ├── Empty State → "No products found"
      └── Product Cards → ProductCard[] (map)
          └── ProductCard (Client Component)
              └── Link → /products/{slug}
```

### 2.3. Business Rules

1. **Pagination:**
   - Homepage: `offset=0, limit=20` (tối đa 20 items)
   - Shop Page: `offset=0, limit=50` (tối đa 50 items)

2. **Product Card Display:**
   - Image: First image từ `images` array, fallback to `/placeholder-product.jpg`
   - Name: Max 2 lines với `line-clamp-2`
   - Rating: Format `{rating}.{1 decimal}` (e.g., "4.5")
   - Review Count: Hiển thị trong parentheses (e.g., "(123)")
   - Price: Format `{currency} {price.toFixed(2)}` (e.g., "$ 99.99")

3. **Navigation:**
   - Click vào card → Navigate to `/products/{slug}`
   - Card toàn bộ clickable (Link wrapper)

4. **Image Optimization:**
   - Sử dụng Next.js `Image` component
   - `sizes` attribute: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
   - `fill` prop với `object-cover`
   - Hover effect: `scale-105` transition

5. **Loading State:**
   - Hiển thị 8 skeleton loaders
   - Skeleton structure: Image (aspect-square), Name (w-3/4), Price (w-1/2)

6. **Empty State:**
   - Message: "No products found."
   - Centered text với `text-muted-foreground`
   - Padding: `py-12`

### 2.4. Edge Cases

| Case | Behavior |
|------|----------|
| **No products** | Hiển thị "No products found" message |
| **API Error** | Return empty array, hiển thị empty state |
| **Missing image** | Fallback to `/placeholder-product.jpg` |
| **Missing rating** | Default to `0`, hiển thị "0.0" |
| **Missing review_count** | Default to `0`, hiển thị "(0)" |
| **Long product name** | Truncate với `line-clamp-2` |
| **Network timeout** | Show error, retry option (future) |

---

## 3. 🔌 API Requirements

### 3.1. Endpoint

**GET** `/api/v1/products`

### 3.2. Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Pagination offset |
| `limit` | number | No | 20 | Number of items per page |

**Example:**
```
GET /api/v1/products?offset=0&limit=20
GET /api/v1/products?offset=0&limit=50
```

### 3.3. Response Structure

**Success Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "price": 99.99,
      "currency": "$",
      "images": ["https://example.com/image1.jpg"],
      "rating": 4.5,
      "review_count": 123
    }
  ]
}
```

**ProductListItem Schema:**
```typescript
{
  id: string; // Product ID as string
  name: string;
  slug: string;
  price: number; // Decimal as number
  currency: string;
  images: string[]; // Array of image URLs
  rating: number; // 0-5
  review_count: number;
}
```

### 3.4. Error Responses

| Status Code | Error Code | Message | Behavior |
|-------------|------------|---------|----------|
| 400 | - | Bad Request | Return empty array, log error |
| 500 | - | Internal Server Error | Return empty array, log error |
| Network Error | - | Network error | Return empty array, log error |

### 3.5. Validation

- **Frontend:** Validate response với `ProductListItemSchema` (Zod)
- **Backend:** Return validated data theo schema

---

## 4. 📝 Acceptance Criteria

### 4.1. Homepage Product Listing
- [x] **AC-1.1:** Khi truy cập `/`, hiển thị "Featured Products" section với tối đa 20 products
- [x] **AC-1.2:** Products hiển thị trong grid layout responsive (1/2/3/4 columns)
- [x] **AC-1.3:** Mỗi product card hiển thị image, name, price, rating, review count
- [x] **AC-1.4:** Click vào card navigate đến `/products/{slug}`
- [x] **AC-1.5:** Loading state hiển thị skeleton loaders (8 items)
- [x] **AC-1.6:** Empty state hiển thị "No products found" message

### 4.2. Shop Page Product Listing
- [x] **AC-2.1:** Khi truy cập `/shop`, hiển thị "Shop All Products" section với tối đa 50 products
- [x] **AC-2.2:** Products hiển thị trong grid layout responsive (1/2/3/4 columns)
- [x] **AC-2.3:** Tất cả acceptance criteria từ Homepage (AC-1.3 đến AC-1.6) áp dụng

### 4.3. Product Card Display
- [x] **AC-3.1:** Image hiển thị first image từ `images` array, fallback to placeholder
- [x] **AC-3.2:** Name hiển thị với max 2 lines, truncate với ellipsis
- [x] **AC-3.3:** Price hiển thị format `{currency} {price.toFixed(2)}`
- [x] **AC-3.4:** Rating hiển thị star icon + `{rating.toFixed(1)}`
- [x] **AC-3.5:** Review count hiển thị trong parentheses `({review_count})`
- [x] **AC-3.6:** Card có hover effect (shadow-lg, image scale)

### 4.4. Loading & Empty States
- [x] **AC-4.1:** Loading state hiển thị 8 skeleton loaders với structure (image, name, price)
- [x] **AC-4.2:** Empty state hiển thị centered message "No products found"
- [x] **AC-4.3:** Error state return empty array và hiển thị empty state

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**ProductList Component:**
- **File:** `frontend/src/components/product/product-list.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    products: ProductListItem[];
    isLoading?: boolean;
  }
  ```
- **Features:**
  - Grid layout với responsive columns
  - Loading state với skeleton loaders
  - Empty state message
  - Map products to ProductCard components

**ProductCard Component:**
- **File:** `frontend/src/components/product/product-card.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    product: ProductListItem;
  }
  ```
- **Features:**
  - Next.js Image component với optimization
  - Link wrapper to product detail page
  - Hover effects (shadow, scale)
  - Rating display với star icon
  - Price formatting

### 5.2. Server Actions

**getProducts Function:**
- **File:** `frontend/src/actions/product-action.ts`
- **Type:** Server Action (`'use server'`)
- **Signature:**
  ```typescript
  async function getProducts(params?: {
    offset?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: ProductListItem[];
    error?: string;
    errorCode?: string;
  }>
  ```
- **Features:**
  - Call `GET /api/v1/products` với query params
  - Validate response với `ProductListItemSchema`
  - Error handling và logging

### 5.3. Pages

**Homepage:**
- **File:** `frontend/src/app/[locale]/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const result = await getProducts({ offset: 0, limit: 20 });
  <ProductList products={result.data || []} isLoading={false} />
  ```

**Shop Page:**
- **File:** `frontend/src/app/[locale]/shop/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const result = await getProducts({ offset: 0, limit: 50 });
  <ProductList products={result.data || []} isLoading={false} />
  ```

### 5.4. Entities

**ProductListItem Type:**
- **File:** `frontend/src/entities/product.ts`
- **Schema:** `ProductListItemSchema` (Zod)
- **Fields:**
  - `id: number`
  - `name: string`
  - `slug: string`
  - `price: number`
  - `currency: string`
  - `images: string[]`
  - `rating: number`
  - `review_count: number`

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Homepage hiển thị tối đa 20 products
- [ ] Shop page hiển thị tối đa 50 products
- [ ] Product cards hiển thị đầy đủ thông tin (image, name, price, rating)
- [ ] Click vào card navigate đến product detail page
- [ ] Loading state hiển thị skeleton loaders
- [ ] Empty state hiển thị khi không có products
- [ ] Error handling khi API fail

### 6.2. UI/UX Tests
- [ ] Grid layout responsive (1/2/3/4 columns)
- [ ] Product card hover effects hoạt động
- [ ] Image optimization với Next.js Image
- [ ] Long product name truncate đúng
- [ ] Rating và review count hiển thị đúng format

### 6.3. Performance Tests
- [ ] Page load time < 2s
- [ ] Image lazy loading hoạt động
- [ ] API call chỉ 1 lần khi page load
- [ ] No unnecessary re-renders

---

## 7. 📚 Related Documentation

- **Story:** [US-PROD-01: Hiển thị danh sách sản phẩm](../story-001-product-listing.md)
- **Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)
- **API Spec:** [Backend API Specifications](../../../api/backend-specs.md#products)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

