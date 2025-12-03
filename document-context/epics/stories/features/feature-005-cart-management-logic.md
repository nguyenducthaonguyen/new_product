# 📄 Feature Specification: FE-CART-001 - Cart Management (Logic & UI)

**Parent Story:** [US-CART-01: Quản lý giỏ hàng](../story-005-cart-management.md)
**Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Cart Page Layout (`/cart`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Shopping Cart                           │
│ ┌─────────────────────────────────────┐ │
│ │ ┌──────────────┐  ┌──────────────┐ │ │
│ │ │ Cart Items   │  │ Order Summary│ │ │
│ │ │              │  │              │ │ │
│ │ │ [Item Card]  │  │ Subtotal     │ │ │
│ │ │ [Item Card]  │  │ Total        │ │ │
│ │ │ [Item Card]  │  │              │ │ │
│ │ │              │  │ [Checkout]   │ │ │
│ │ │              │  │ [Continue]   │ │ │
│ │ └──────────────┘  └──────────────┘ │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

**Responsive Layout:**
- **Desktop (≥ 1024px):** 2-column grid (2/3 items, 1/3 summary)
- **Mobile (< 1024px):** Stack layout (items on top, summary below)

### 1.2. Cart Item Card Design

**Item Card Structure:**
```
┌─────────────────────────────────────────┐
│ SKU: PROD-001-RED-M                     │
│ USD 99.99 each                          │
│                                          │
│ [-]  2  [+]    USD 199.98    [🗑️]      │
└─────────────────────────────────────────┘
```

**Item Display:**
- SKU: `font-semibold mb-1`
- Price per item: `text-muted-foreground` ("USD {price} each")
- Quantity selector: `[-] {quantity} [+]` với buttons
- Subtotal: `font-semibold` ("USD {price * quantity}")
- Remove button: Trash icon, `text-destructive`

**Item Card States:**
- **Default:** Card với border, padding
- **Updating:** Disabled buttons, loading state
- **Hover:** (Future enhancement)

### 1.3. Order Summary Design

**Summary Card:**
```
┌─────────────────────┐
│ Order Summary       │
├─────────────────────┤
│ Subtotal (2 items) │
│ USD 199.98          │
├─────────────────────┤
│ Total               │
│ USD 199.98          │
├─────────────────────┤
│ [Proceed to Checkout]│
│ [Continue Shopping] │
└─────────────────────┘
```

**Summary Elements:**
- Title: "Order Summary"
- Subtotal: "Subtotal ({total_items} items)" + price
- Total: Border top, larger font, bold
- Checkout button: Full width, large size, link to `/checkout`
- Continue Shopping button: Full width, outline variant, link to `/`

### 1.4. Empty Cart Design

**Empty State:**
```
┌─────────────────────┐
│ Shopping Cart       │
├─────────────────────┤
│                     │
│ Your cart is empty  │
│                     │
│ [Continue Shopping] │
│                     │
└─────────────────────┘
```

**Empty State Elements:**
- Heading: "Shopping Cart"
- Message: "Your cart is empty" (centered, `text-muted-foreground`)
- Button: "Continue Shopping" link to `/`

### 1.5. Loading State Design

**Loading State:**
- Skeleton loader: `h-96 w-full` khi cart chưa load
- Item updating: Disabled buttons với `isUpdating` state

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

#### View Cart Flow
```
Page Load (/cart)
  ↓
Server Component (page.tsx)
  ↓
getCart() Server Action
  ↓
getAuthHeaders() → Include Authorization (if logged in) + X-Session-ID
  ↓
GET /api/v1/cart
  ↓
Response: Cart (with items array)
  ↓
Validate với CartSchema
  ↓
Pass to CartView Component (initialCart prop)
  ↓
Update Zustand cart store
  ↓
Render Cart Items + Order Summary
```

#### Add to Cart Flow (from Product Detail)
```
User clicks "Add to Cart"
  ↓
ProductDetailView Component
  ↓
addToCart({ sku, quantity }) Server Action
  ↓
getAuthHeaders() → Include Authorization + X-Session-ID
  ↓
POST /api/v1/cart/items
  ↓
Response: SimpleCartResponse (cart_id, total_items, total_price)
  ↓
Fetch full cart: getCart()
  ↓
GET /api/v1/cart (returns full cart with items)
  ↓
Update Zustand cart store
  ↓
Update cart badge on header
  ↓
Show success toast
```

#### Update Quantity Flow
```
User clicks +/- button
  ↓
handleUpdateQuantity(itemId, newQuantity)
  ↓
Validate: newQuantity >= 1
  ↓
Set isUpdating(itemId) = true
  ↓
updateCartItem(itemId, { quantity }) Server Action
  ↓
PATCH /api/v1/cart/items/{itemId}
  ↓
Response: Cart (full cart with updated items)
  ↓
Update Zustand cart store
  ↓
Update cart badge on header
  ↓
Show success toast
  ↓
Set isUpdating(itemId) = null
```

#### Remove Item Flow
```
User clicks Remove (trash icon)
  ↓
handleRemoveItem(itemId)
  ↓
Set isUpdating(itemId) = true
  ↓
removeCartItem(itemId) Server Action
  ↓
DELETE /api/v1/cart/items/{itemId}
  ↓
Response: Cart (full cart without removed item)
  ↓
Update Zustand cart store
  ↓
Update cart badge on header
  ↓
Show success toast
  ↓
Set isUpdating(itemId) = null
```

### 2.2. Component Hierarchy

```
Cart Page (Server Component)
  ├── HomeHeader (Client Component)
  ├── CartView (Client Component)
  │   ├── Loading State → Skeleton
  │   ├── Empty State → Message + Continue Shopping
  │   └── Cart Items + Order Summary
  │       ├── Cart Item Cards (map)
  │       │   ├── SKU + Price
  │       │   ├── Quantity Selector
  │       │   ├── Subtotal
  │       │   └── Remove Button
  │       └── Order Summary Card
  │           ├── Subtotal
  │           ├── Total
  │           ├── Checkout Button
  │           └── Continue Shopping Button
  └── Footer (Static Component)
```

### 2.3. Business Rules

1. **Cart Identification:**
   - **Authenticated User:** Cart identified by `user_id` (from Authorization token)
   - **Guest User:** Cart identified by `session_id` (from cookie or X-Session-ID header)
   - **Session ID Generation:** Auto-generate UUID nếu không có, persist trong cookie (30 days)

2. **Add to Cart:**
   - Items cùng SKU được merge tự động (backend logic)
   - Quantity tăng lên nếu item đã tồn tại
   - After add: Always fetch full cart để get items array
   - Update cart store và cart badge

3. **Update Quantity:**
   - Minimum: 1
   - Maximum: Stock của variant (backend validation)
   - Disable buttons khi `isUpdating`
   - Disable minus button khi quantity = 1

4. **Remove Item:**
   - Remove item khỏi cart
   - Recalculate totals (backend)
   - Update cart store và cart badge

5. **Cart Totals:**
   - `total_items`: Sum of all item quantities
   - `total_price`: Sum of (item.price * item.quantity) for all items
   - Calculated by backend, frontend displays

6. **Empty Cart:**
   - Show empty state message
   - Hide order summary
   - Show "Continue Shopping" button

7. **Loading States:**
   - Initial load: Skeleton loader
   - Item update: Disable buttons for specific item (`isUpdating`)

8. **Error Handling:**
   - API errors: Show error toast
   - Network errors: Show error toast
   - Always return empty cart on error (graceful degradation)

### 2.4. Guest Cart Support

**Session ID Management:**
- Generate UUID nếu không có session_id
- Store in cookie: `session_id` (httpOnly, 30 days)
- Include in headers: `X-Session-ID` for all cart API calls
- Persist across page reloads

**Guest to User Cart Merge:**
- When user logs in, backend automatically merges guest cart into user cart
- Frontend doesn't need to handle merge explicitly

### 2.5. User Cart Support

**Authentication:**
- Include `Authorization: Bearer {access_token}` header
- Backend validates token và extracts `user_id`
- Cart identified by `user_id`

**Cart Persistence:**
- Cart persists across sessions (stored in database)
- Cart accessible from any device when logged in

### 2.6. Edge Cases

| Case | Behavior |
|------|----------|
| **Empty cart** | Show empty state message với Continue Shopping button |
| **Cart not found** | Return empty cart (graceful degradation) |
| **API error** | Show error toast, return empty cart |
| **Network timeout** | Show error toast, return empty cart |
| **Item out of stock** | Backend returns error (40001), show error toast |
| **Invalid quantity** | Backend validation, show error toast |
| **Item not found** | Backend returns 404, show error toast |
| **Guest cart expires** | Generate new session_id, create new cart |
| **User logs in with guest cart** | Backend merges carts automatically |
| **Multiple items same SKU** | Backend merges into single item với increased quantity |
| **Quantity exceeds stock** | Backend validation, show error toast |

---

## 3. 🔌 API Requirements

### 3.1. Get Cart

**Endpoint:** `GET /api/v1/cart`

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional, if logged in)
- `X-Session-ID: {session_id}` (required for guest carts)

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "cart_id": "cart_123",
    "total_items": 2,
    "total_price": 199.98,
    "items": [
      {
        "itemId": "item_1",
        "sku": "PROD-001-RED-M",
        "quantity": 2,
        "price": 99.99
      }
    ]
  }
}
```

**Cart Schema:**
```typescript
{
  cart_id: string;
  total_items: number;
  total_price: number;
  items: CartItem[];
}

CartItem {
  itemId: string; // Format: "item_{id}"
  sku: string;
  quantity: number;
  price: number; // Decimal as number
}
```

**Error Responses:**
- **500:** Internal server error → Return empty cart
- **Network Error:** Return empty cart

### 3.2. Add to Cart

**Endpoint:** `POST /api/v1/cart/items`

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional)
- `X-Session-ID: {session_id}` (required for guest)
- `Content-Type: application/json`

**Request Body:**
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
    "total_price": 199.98
  }
}
```

**Note:** Response is `SimpleCartResponse` (no items array). Frontend must call `GET /api/v1/cart` to fetch full cart.

**Error Responses:**
- **400:** Bad Request (invalid SKU, quantity < 1)
- **404:** Product/Variant not found
- **40001:** Insufficient stock (BusinessException)
- **500:** Internal server error

### 3.3. Update Cart Item

**Endpoint:** `PATCH /api/v1/cart/items/{itemId}`

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional)
- `X-Session-ID: {session_id}` (required for guest)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Cart updated",
  "data": {
    "cart_id": "cart_123",
    "total_items": 3,
    "total_price": 299.97,
    "items": [
      {
        "itemId": "item_1",
        "sku": "PROD-001-RED-M",
        "quantity": 3,
        "price": 99.99
      }
    ]
  }
}
```

**Error Responses:**
- **400:** Bad Request (quantity < 1)
- **404:** Item not found
- **40001:** Insufficient stock
- **500:** Internal server error

### 3.4. Remove Cart Item

**Endpoint:** `DELETE /api/v1/cart/items/{itemId}`

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional)
- `X-Session-ID: {session_id}` (required for guest)

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Item removed from cart",
  "data": {
    "cart_id": "cart_123",
    "total_items": 1,
    "total_price": 99.99,
    "items": [
      {
        "itemId": "item_2",
        "sku": "PROD-002-BLUE-L",
        "quantity": 1,
        "price": 99.99
      }
    ]
  }
}
```

**Error Responses:**
- **404:** Item not found
- **500:** Internal server error

---

## 4. 📝 Acceptance Criteria

### 4.1. View Cart
- [x] **AC-1.1:** Cart page hiển thị Header và Footer
- [x] **AC-1.2:** Cart page hiển thị "Shopping Cart" heading
- [x] **AC-1.3:** Cart items hiển thị trong grid layout (2/3 width desktop, full width mobile)
- [x] **AC-1.4:** Each item hiển thị: SKU, price per item, quantity, subtotal, remove button
- [x] **AC-1.5:** Order Summary hiển thị: subtotal, total, checkout button, continue shopping button
- [x] **AC-1.6:** Totals calculated correctly (total_items, total_price)

### 4.2. Add to Cart
- [x] **AC-2.1:** Add to cart từ product detail page
- [x] **AC-2.2:** API call `POST /api/v1/cart/items` với SKU và quantity
- [x] **AC-2.3:** Backend merges items cùng SKU (auto-increase quantity)
- [x] **AC-2.4:** After add, fetch full cart từ `GET /api/v1/cart`
- [x] **AC-2.5:** Update cart store (Zustand)
- [x] **AC-2.6:** Show success toast "Item added to cart"
- [x] **AC-2.7:** Update cart badge trên header

### 4.3. Update Quantity
- [x] **AC-3.1:** Quantity selector với +/- buttons
- [x] **AC-3.2:** Minus button disabled khi quantity = 1
- [x] **AC-3.3:** Plus button disabled khi updating
- [x] **AC-3.4:** Validate quantity (>= 1, <= stock)
- [x] **AC-3.5:** API call `PATCH /api/v1/cart/items/{itemId}` với new quantity
- [x] **AC-3.6:** Update cart store sau khi success
- [x] **AC-3.7:** Recalculate totals (backend)
- [x] **AC-3.8:** Update cart badge trên header
- [x] **AC-3.9:** Show success toast "Cart updated"
- [x] **AC-3.10:** Loading state cho item đang update

### 4.4. Remove Item
- [x] **AC-4.1:** Remove button (trash icon) cho mỗi item
- [x] **AC-4.2:** API call `DELETE /api/v1/cart/items/{itemId}`
- [x] **AC-4.3:** Remove item khỏi cart
- [x] **AC-4.4:** Update cart store sau khi success
- [x] **AC-4.5:** Recalculate totals (backend)
- [x] **AC-4.6:** Update cart badge trên header
- [x] **AC-4.7:** Show success toast "Item removed from cart"
- [x] **AC-4.8:** Loading state cho item đang remove

### 4.5. Empty Cart
- [x] **AC-5.1:** Empty state hiển thị "Your cart is empty" message
- [x] **AC-5.2:** Empty state có "Continue Shopping" button link to `/`
- [x] **AC-5.3:** Order Summary không hiển thị khi cart empty

### 4.6. Loading State
- [x] **AC-6.1:** Skeleton loader khi cart chưa load
- [x] **AC-6.2:** Disabled buttons khi item đang update (`isUpdating` state)
- [x] **AC-6.3:** Loading state per item (not global)

### 4.7. Guest Cart Support
- [x] **AC-7.1:** Guest user có thể add items to cart
- [x] **AC-7.2:** Session ID auto-generated nếu không có
- [x] **AC-7.3:** Session ID persist trong cookie (30 days)
- [x] **AC-7.4:** Session ID included in all cart API calls

### 4.8. User Cart Support
- [x] **AC-8.1:** Authenticated user cart identified by user_id
- [x] **AC-8.2:** Authorization header included in cart API calls
- [x] **AC-8.3:** Cart persists across sessions (database)

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**CartView Component:**
- **File:** `frontend/src/components/cart/cart-view.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    initialCart: Cart | null;
  }
  ```
- **State:**
  - `isUpdating: string | null` - Item ID đang được update

- **Hooks:**
  - `useCartStore` - Get/set cart from Zustand store
  - `useEffect` - Initialize cart from prop or fetch
  - `useState` - Track updating items

- **Key Functions:**
  - `handleUpdateQuantity(itemId, newQuantity)` - Update item quantity
  - `handleRemoveItem(itemId)` - Remove item from cart

### 5.2. Server Actions

**getCart Function:**
- **File:** `frontend/src/actions/cart-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Get auth headers (Authorization + X-Session-ID)
  - Call `GET /api/v1/cart`
  - Validate response với `CartSchema`
  - Return empty cart on error (graceful degradation)

**addToCart Function:**
- **File:** `frontend/src/actions/cart-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `POST /api/v1/cart/items` với SKU và quantity
  - Response is `SimpleCartResponse` (no items)
  - Automatically fetch full cart after add
  - Return full cart with items array

**updateCartItem Function:**
- **File:** `frontend/src/actions/cart-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `PATCH /api/v1/cart/items/{itemId}` với new quantity
  - Return full cart with updated items

**removeCartItem Function:**
- **File:** `frontend/src/actions/cart-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `DELETE /api/v1/cart/items/{itemId}`
  - Return full cart without removed item

**Helper Functions:**
- `getSessionId()` - Get or generate session_id, persist in cookie
- `getAuthHeaders()` - Build headers với Authorization và X-Session-ID

### 5.3. Pages

**Cart Page:**
- **File:** `frontend/src/app/[locale]/cart/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const result = await getCart();
  return (
    <div>
      <HomeHeader />
      <CartView initialCart={result.data} />
      <Footer />
    </div>
  );
  ```

### 5.4. Stores

**Cart Store:**
- **File:** `frontend/src/stores/cart-store.ts`
- **Type:** Zustand store với persistence
- **State:**
  ```typescript
  {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;
    setCart: (cart: Cart | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearCart: () => void;
  }
  ```
- **Persistence:** localStorage key `'cart-storage'`
- **Usage:**
  - Store cart state across page reloads
  - Update cart badge on header (read `cart?.total_items`)
  - Sync cart between components

### 5.5. Entities

**Cart Types:**
- **File:** `frontend/src/entities/cart.ts`
- **Schemas:**
  - `CartItemSchema` - Individual cart item
  - `CartSchema` - Full cart với items array
  - `SimpleCartSchema` - Cart without items (for POST response)
  - `AddToCartRequestSchema` - Request to add item
  - `UpdateCartItemRequestSchema` - Request to update quantity

**CartItem Type:**
```typescript
{
  itemId: string; // Format: "item_{id}"
  sku: string;
  quantity: number;
  price: number;
}
```

**Cart Type:**
```typescript
{
  cart_id: string;
  total_items: number;
  total_price: number;
  items: CartItem[];
}
```

### 5.6. Authentication Integration

**Guest Cart:**
- Session ID generated và stored in cookie
- Session ID included in `X-Session-ID` header
- Cart persists for 30 days (cookie maxAge)

**User Cart:**
- Authorization token included in `Authorization` header
- Backend extracts `user_id` from token
- Cart stored in database, accessible across devices

**Cart Merge:**
- When user logs in, backend automatically merges guest cart into user cart
- Frontend doesn't need to handle merge explicitly

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] View cart hiển thị correct items
- [ ] Add to cart từ product detail page
- [ ] Items cùng SKU merge correctly
- [ ] Update quantity works (increase/decrease)
- [ ] Remove item works
- [ ] Empty cart shows empty state
- [ ] Cart totals calculated correctly
- [ ] Cart badge updates correctly

### 6.2. UI/UX Tests
- [ ] Cart layout responsive (2-column desktop, stack mobile)
- [ ] Item cards hiển thị correctly
- [ ] Quantity selector works
- [ ] Remove button works
- [ ] Order summary hiển thị correctly
- [ ] Loading states work (skeleton, item updating)
- [ ] Toast notifications show correctly

### 6.3. Guest Cart Tests
- [ ] Guest can add items to cart
- [ ] Session ID generated automatically
- [ ] Session ID persists in cookie
- [ ] Guest cart persists across page reloads
- [ ] Guest cart accessible from same browser

### 6.4. User Cart Tests
- [ ] Authenticated user cart works
- [ ] Cart persists across sessions
- [ ] Cart accessible from different devices (when logged in)
- [ ] Guest cart merges into user cart on login

### 6.5. Edge Case Tests
- [ ] Empty cart handling
- [ ] API error handling
- [ ] Network timeout handling
- [ ] Invalid quantity handling
- [ ] Item out of stock handling
- [ ] Item not found handling
- [ ] Multiple items same SKU merge
- [ ] Quantity exceeds stock

### 6.6. Performance Tests
- [ ] Cart page load time < 2s
- [ ] Update quantity response time < 500ms
- [ ] Remove item response time < 500ms
- [ ] No unnecessary re-renders
- [ ] Cart store updates efficiently

---

## 7. 📚 Related Documentation

- **Story:** [US-CART-01: Quản lý giỏ hàng](../story-005-cart-management.md)
- **Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)
- **API Spec:** [Backend API Specifications](../../../api/backend-specs.md#cart)
- **Product Detail:** [FE-PROD-002: Product Detail Page](./feature-002-product-detail-logic.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

