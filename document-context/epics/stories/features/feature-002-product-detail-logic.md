# 📄 Feature Specification: FE-PROD-002 - Product Detail Page (Logic & UI)

**Parent Story:** [US-PROD-02: Xem chi tiết sản phẩm](../story-002-product-detail.md)
**Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Page Layout (`/products/{slug}`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Product Detail View                     │
│ ┌─────────────────────────────────────┐ │
│ │ ┌──────────┐  ┌──────────────────┐ │ │
│ │ │          │  │ Product Name     │ │ │
│ │ │          │  │ ⭐ 4.5 (123)     │ │ │
│ │ │  Main    │  │ $ 99.99          │ │ │
│ │ │  Image   │  │                  │ │ │
│ │ │          │  │ COLOR SELECTION  │ │ │
│ │ │          │  │ [●] [○] [○]     │ │ │
│ │ └──────────┘  │                  │ │ │
│ │ ┌──────────┐  │ SIZE SELECTOR    │ │ │
│ │ │ [T] [S]  │  │ [S] [M] [L] [XL] │ │ │
│ │ │ [M] [L]  │  │                  │ │ │
│ │ └──────────┘  │ Quantity: [-] 1 [+] │ │
│ │ Thumbnails    │                  │ │ │
│ │ (4 columns)   │ [Add to Cart]    │ │ │
│ │                │                  │ │ │
│ │                │ Description      │ │ │
│ │                │ ...              │ │ │
│ └────────────────┴──────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

**Responsive Layout:**
- **Desktop (≥ 1024px):** 2-column grid (60% image gallery, 40% product info)
- **Mobile (< 1024px):** Stack layout (image gallery on top, product info below)

### 1.2. Image Gallery Design

**Main Image:**
- Aspect ratio: Square (1:1)
- Size: Full width of gallery column
- Border: Rounded corners (`rounded-lg`)
- Hover: Scale 110% with transition
- Priority loading: `priority` prop for first image

**Thumbnails:**
- Grid: 4 columns
- Aspect ratio: Square (1:1)
- Border: 2px ring when selected (`ring-2 ring-black`)
- Hover: Border color change
- Click: Change main image

### 1.3. Variant Selection Design

**Color Selection:**
- Display: Circular buttons (swatches)
- Size: `w-10 h-10` (40px)
- Border: 2px, black when selected with ring offset
- Background: Color from variant (lowercase)
- Disabled: 50% opacity, cursor-not-allowed
- Layout: Flex wrap with gap

**Size Selection:**
- Display: Rectangular buttons
- Grid: 4 columns
- Border: 2px, black background when selected
- Text: Size label (S, M, L, XL, etc.)
- Disabled: 50% opacity, cursor-not-allowed (when out of stock or not available)

### 1.4. Quantity Selector Design

**Layout:**
```
[-]  1  [+]
```

- Minus button: Disabled when quantity = 1
- Plus button: Disabled when quantity = max (stock or 10, whichever is lower)
- Display: Centered number between buttons
- Size: `h-10 w-10` for buttons, `w-12` for number display

### 1.5. Add to Cart Button

**States:**
- **Default:** Black background, white text, "Add to Cart" with cart icon
- **Loading:** "Adding..." text, disabled
- **Out of Stock:** "Out of Stock" text, disabled
- **Size:** Large (`size="lg"`), full width, `h-12`

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

```
Page Load (/products/{slug})
  ↓
Server Component (page.tsx)
  ↓
getProductBySlug(slug)
  ↓
Server Action (product-action.ts)
  ↓
httpClient.get('/api/v1/products/{slug}')
  ↓
Backend API (GET /api/v1/products/{slug})
  ↓
Response: ProductDetail
  ↓
Validate với ProductDetailSchema
  ↓
Pass to ProductDetailView Component
  ↓
Initialize Variant Selection
  ↓
User Selects Variant & Quantity
  ↓
User Clicks "Add to Cart"
  ↓
addToCart({ sku, quantity })
  ↓
POST /api/v1/cart/items
  ↓
Fetch Full Cart (getCart())
  ↓
Update Cart Store (Zustand)
  ↓
Update Cart Badge on Header
```

### 2.2. Variant Selection Logic

**Color Selection:**
1. Extract unique colors from all variants
2. When color selected:
   - Filter variants by selected color
   - Update available sizes for selected color
   - If current size not available for new color → reset to first available size
   - If no size available → reset size to null

**Size Selection:**
1. Extract unique sizes from all variants
2. When size selected:
   - Filter variants by selected size
   - Update available colors for selected size
   - If current color not available for new size → reset to first available color
   - If no color available → reset color to null

**Variant Filtering:**
- Filter variants based on selected color AND size
- Find first variant with stock > 0
- If no variant with stock, use first variant (out of stock)

**Default Selection:**
- On mount: Select first available color and size
- If no color/size available, leave as null

### 2.3. Price Calculation

**Formula:**
```
finalPrice = basePrice + variantPriceModifier
```

**Display:**
- Format: `{currency} {finalPrice.toFixed(2)}`
- Example: "$ 99.99" or "€ 89.50"

### 2.4. Quantity Management

**Rules:**
- Minimum: 1
- Maximum: `Math.min(selectedVariant.stock, 10)`
- When variant changes: Reset quantity to 1
- When quantity exceeds stock: Auto-adjust to max available

**Validation:**
- Before add to cart: Check `selectedVariant.stock >= quantity`
- Show error toast if validation fails

### 2.5. Add to Cart Flow

**Steps:**
1. Validate variant selected
2. Validate stock availability
3. Set loading state (`isAdding = true`)
4. Call `addToCart({ sku: selectedVariant.sku, quantity })`
5. On success:
   - `addToCart` automatically fetches full cart
   - Update cart store with `setCart(result.data)`
   - Show success toast
6. On error:
   - Show error toast
7. Finally:
   - Set loading state (`isAdding = false`)

### 2.6. Business Rules

1. **Variant Selection:**
   - User must select both color and size (if available) to add to cart
   - Variants are filtered based on color AND size combination
   - Disable unavailable combinations (gray out)

2. **Stock Management:**
   - Show "Out of Stock" if selected variant has stock = 0
   - Disable "Add to Cart" button if out of stock
   - Quantity cannot exceed available stock

3. **Price Display:**
   - Base price + variant price_modifier
   - Display with currency symbol

4. **Image Gallery:**
   - First image is priority loaded
   - Click thumbnail to change main image
   - Smooth transition effect

5. **Hydration:**
   - Use `mounted` state to prevent hydration errors
   - Show skeleton loader until mounted

### 2.7. Edge Cases

| Case | Behavior |
|------|----------|
| **No variants** | Hide variant selectors, show base product only |
| **No color variants** | Hide color selector, show size selector only |
| **No size variants** | Hide size selector, show color selector only |
| **All variants out of stock** | Show "Out of Stock", disable Add to Cart |
| **Selected variant out of stock** | Show "Out of Stock", disable Add to Cart |
| **Quantity > stock** | Auto-adjust to max available, show error if user tries to add |
| **No images** | Fallback to `/placeholder-product.jpg` |
| **Single image** | Hide thumbnail grid |
| **API Error** | Show 404 page (notFound()) |
| **Network timeout** | Show error toast, allow retry |

---

## 3. 🔌 API Requirements

### 3.1. Get Product Detail

**Endpoint:** `GET /api/v1/products/{slug}`

**Request:**
- Path parameter: `slug` (string)

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": "1",
    "slug": "product-name",
    "name": "Product Name",
    "price": 99.99,
    "currency": "$",
    "description": "Product description...",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "variants": [
      {
        "sku": "PROD-001-RED-S",
        "color": "Red",
        "size": "S",
        "stock": 10,
        "price_modifier": 0.00
      },
      {
        "sku": "PROD-001-RED-M",
        "color": "Red",
        "size": "M",
        "stock": 5,
        "price_modifier": 5.00
      }
    ],
    "rating": 4.5,
    "review_count": 123
  }
}
```

**ProductDetail Schema:**
```typescript
{
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  review_count: number;
}

ProductVariant {
  sku: string;
  color: string | null;
  size: string | null;
  stock: number;
  price_modifier: number;
}
```

**Error Responses:**
- **404:** Product not found → Show 404 page
- **500:** Internal server error → Show error toast

### 3.2. Add to Cart

**Endpoint:** `POST /api/v1/cart/items`

**Request:**
```json
{
  "sku": "PROD-001-RED-M",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Item added to cart",
  "data": {
    "cart_id": "cart_123",
    "total_items": 2,
    "total_price": 209.98
  }
}
```

**Note:** After `addToCart`, frontend automatically calls `getCart()` to fetch full cart with items array.

**Error Responses:**
- **400:** Invalid request (missing SKU, invalid quantity)
- **404:** Product/Variant not found
- **40001:** Insufficient stock
- **500:** Internal server error

---

## 4. 📝 Acceptance Criteria

### 4.1. Page Load & Display
- [x] **AC-1.1:** Khi truy cập `/products/{slug}`, hiển thị Header, Product Detail View, Footer
- [x] **AC-1.2:** Product Detail View hiển thị đầy đủ: name, price, rating, images, variants, description
- [x] **AC-1.3:** Layout responsive: 2-column (Desktop), stack (Mobile)
- [x] **AC-1.4:** Loading state hiển thị skeleton loader trước khi mounted

### 4.2. Image Gallery
- [x] **AC-2.1:** Main image hiển thị với aspect square, priority loading
- [x] **AC-2.2:** Thumbnails hiển thị grid 4 columns (nếu có > 1 image)
- [x] **AC-2.3:** Click thumbnail thay đổi main image với smooth transition
- [x] **AC-2.4:** Selected thumbnail có ring border (ring-2 ring-black)
- [x] **AC-2.5:** Fallback to placeholder nếu không có images

### 4.3. Variant Selection
- [x] **AC-3.1:** Color selection hiển thị circular swatches với color background
- [x] **AC-3.2:** Size selection hiển thị rectangular buttons grid (4 columns)
- [x] **AC-3.3:** Khi chọn color, filter available sizes cho color đó
- [x] **AC-3.4:** Khi chọn size, filter available colors cho size đó
- [x] **AC-3.5:** Disable unavailable combinations (opacity 50%, cursor-not-allowed)
- [x] **AC-3.6:** Auto-select first available color và size on mount
- [x] **AC-3.7:** Reset size khi color thay đổi và size không available
- [x] **AC-3.8:** Reset color khi size thay đổi và color không available

### 4.4. Price & Quantity
- [x] **AC-4.1:** Price hiển thị = basePrice + variantPriceModifier
- [x] **AC-4.2:** Price format: `{currency} {price.toFixed(2)}`
- [x] **AC-4.3:** Quantity selector hiển thị với +/- buttons
- [x] **AC-4.4:** Quantity min = 1, max = min(stock, 10)
- [x] **AC-4.5:** Quantity reset to 1 khi variant thay đổi
- [x] **AC-4.6:** Quantity auto-adjust nếu vượt quá stock

### 4.5. Add to Cart
- [x] **AC-5.1:** "Add to Cart" button enable khi variant selected và có stock
- [x] **AC-5.2:** "Add to Cart" button disable khi out of stock
- [x] **AC-5.3:** Click "Add to Cart" gọi API với SKU và quantity
- [x] **AC-5.4:** Loading state hiển thị "Adding..." text
- [x] **AC-5.5:** Success: Show toast, fetch full cart, update cart store, update cart badge
- [x] **AC-5.6:** Error: Show error toast với error message

### 4.6. Out of Stock
- [x] **AC-6.1:** Nếu selected variant stock = 0, hiển thị "Out of Stock"
- [x] **AC-6.2:** Disable "Add to Cart" button khi out of stock
- [x] **AC-6.3:** Disable size buttons nếu variant cho size đó out of stock

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**ProductDetailView Component:**
- **File:** `frontend/src/components/product/product-detail-view.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    product: ProductDetail;
  }
  ```
- **State:**
  - `mounted: boolean` - Prevent hydration errors
  - `selectedImageIndex: number` - Current main image index
  - `selectedColor: string | null` - Selected color
  - `selectedSize: string | null` - Selected size
  - `quantity: number` - Selected quantity
  - `isAdding: boolean` - Loading state for add to cart

- **Hooks:**
  - `useMemo` for variant filtering and calculations
  - `useEffect` for initialization and side effects
  - `useCartStore` for cart state management

**Key Functions:**
- `handleColorSelect(color)` - Select color, update available sizes
- `handleSizeSelect(size)` - Select size, update available colors
- `handleQuantityChange(delta)` - Increase/decrease quantity
- `handleAddToCart()` - Add item to cart

### 5.2. Server Actions

**getProductBySlug Function:**
- **File:** `frontend/src/actions/product-action.ts`
- **Type:** Server Action (`'use server'`)
- **Signature:**
  ```typescript
  async function getProductBySlug(slug: string): Promise<{
    success: boolean;
    data: ProductDetail | null;
    error?: string;
    errorCode?: string;
  }>
  ```
- **Features:**
  - Call `GET /api/v1/products/{slug}`
  - Validate response với `ProductDetailSchema`
  - Error handling và logging

**addToCart Function:**
- **File:** `frontend/src/actions/cart-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `POST /api/v1/cart/items` với SKU và quantity
  - Automatically fetch full cart after adding
  - Return full cart with items array

### 5.3. Pages

**Product Detail Page:**
- **File:** `frontend/src/app/[locale]/products/[slug]/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const result = await getProductBySlug(slug);
  if (!result.success || !result.data) {
    notFound(); // Show 404
  }
  return (
    <div>
      <HomeHeader />
      <ProductDetailView product={result.data} />
      <Footer />
    </div>
  );
  ```

### 5.4. Entities

**ProductDetail Type:**
- **File:** `frontend/src/entities/product.ts`
- **Schema:** `ProductDetailSchema` (Zod)
- **Fields:**
  - `id: string`
  - `slug: string`
  - `name: string`
  - `price: number`
  - `currency: string`
  - `description: string | null`
  - `images: string[]`
  - `variants: ProductVariant[]`
  - `rating: number`
  - `review_count: number`

**ProductVariant Type:**
- **Fields:**
  - `sku: string`
  - `color: string | null`
  - `size: string | null`
  - `stock: number`
  - `price_modifier: number`

### 5.5. Stores

**Cart Store:**
- **File:** `frontend/src/stores/cart-store.ts`
- **Type:** Zustand store với persistence
- **Actions:**
  - `setCart(cart)` - Update cart state
  - Used to update cart after adding item

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Page loads với correct product data
- [ ] Image gallery hiển thị và switch images correctly
- [ ] Color selection filters sizes correctly
- [ ] Size selection filters colors correctly
- [ ] Quantity selector works (min/max validation)
- [ ] Add to cart succeeds và updates cart
- [ ] Out of stock variant shows correct state
- [ ] Price calculation correct (base + modifier)
- [ ] 404 page shows khi product not found

### 6.2. UI/UX Tests
- [ ] Layout responsive (2-column Desktop, stack Mobile)
- [ ] Image gallery hover effects work
- [ ] Variant selection visual feedback (selected state)
- [ ] Disabled states hiển thị correctly (opacity, cursor)
- [ ] Loading states hiển thị correctly
- [ ] Toast notifications show correctly
- [ ] Skeleton loader hiển thị before mount

### 6.3. Edge Case Tests
- [ ] Product với no variants
- [ ] Product với no color variants
- [ ] Product với no size variants
- [ ] Product với all variants out of stock
- [ ] Product với single image (no thumbnails)
- [ ] Product với no images (fallback)
- [ ] Quantity exceeds stock (auto-adjust)
- [ ] Network error handling

### 6.4. Performance Tests
- [ ] Page load time < 2s
- [ ] Image lazy loading works
- [ ] No unnecessary re-renders
- [ ] Variant filtering performance (large variant lists)

---

## 7. 📚 Related Documentation

- **Story:** [US-PROD-02: Xem chi tiết sản phẩm](../story-002-product-detail.md)
- **Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)
- **API Spec:** [Backend API Specifications](../../../api/backend-specs.md#products)
- **Cart Feature:** [US-CART-01: Quản lý giỏ hàng](../story-005-cart-management.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

