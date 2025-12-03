# 📄 Feature Specification: FE-CHECKOUT-002 - Guest Checkout (Logic & UI)

**Parent Story:** [US-CHECKOUT-02: Thanh toán không cần đăng ký](../story-008-guest-checkout.md)
**Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Guest Checkout Option Screen

**Checkout Option Layout:**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Checkout Options                        │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │   Continue as Guest                 │ │
│ │   [Checkout as Guest Button]        │ │
│ │                                     │ │
│ │   OR                                │ │
│ │                                     │ │
│ │   Login to Checkout                 │ │
│ │   [Login to Checkout Button]       │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

**Alternative: Integrated in Checkout Page**
- Show option at top of checkout form
- "Continue as Guest" hoặc "Login to Checkout" buttons

### 1.2. Guest Checkout Form

**Form Layout:**
```
┌─────────────────────────────────────────┐
│ Guest Checkout                          │
├─────────────────────────────────────────┤
│ Email *                                 │
│ [Input]                                 │
│                                         │
│ Full Name *                             │
│ [Input]                                 │
│                                         │
│ Phone *                                 │
│ [Input]                                 │
│                                         │
│ Shipping Address *                      │
│ [Textarea]                              │
│                                         │
│ City *                                  │
│ [Input]                                 │
│                                         │
│ Postal Code *                           │
│ [Input]                                 │
│                                         │
│ Country *                               │
│ [Select]                                │
│                                         │
│ [Shipping Method Selection]             │
│ [Payment Method Selection]              │
│ [Order Review]                          │
│                                         │
│ [Place Order]                           │
└─────────────────────────────────────────┘
```

**Note:** Form structure tương tự regular checkout, nhưng không yêu cầu authentication.

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

#### Guest Checkout Option Flow
```
User clicks "Checkout" from Cart (not logged in)
  ↓
Check authentication status
  ↓
If not authenticated → Show checkout options
  ↓
Option 1: "Checkout as Guest" → Continue to guest checkout form
  ↓
Option 2: "Login to Checkout" → Redirect to /login?redirect=/checkout
```

#### Guest Order Creation Flow
```
User fills guest checkout form
  ↓
User selects shipping và payment methods
  ↓
User reviews order
  ↓
User clicks "Place Order"
  ↓
Validate all fields
  ↓
createOrder() Server Action
  ↓
POST /api/v1/orders
  ↓
Request Body:
  - shipping_info (with email)
  - shipping_method
  - payment_method
  - cart_id (from session_id)
  - user_id: null (guest order)
  ↓
Response: Order (with orderId)
  ↓
Send confirmation email to provided email
  ↓
Clear guest cart
  ↓
Redirect to /orders/{orderId}/confirmation
```

#### Guest Cart to User Cart Merge Flow
```
User completes guest checkout
  ↓
Order created với user_id = null, email = {provided_email}
  ↓
User registers account later với same email
  ↓
Backend matches email
  ↓
Link guest orders to user account
  ↓
Merge guest cart (if exists) to user cart
```

### 2.2. Business Rules

1. **Guest Checkout Access:**
   - Available khi user chưa đăng nhập
   - Show option khi click "Checkout" from cart
   - User có thể chọn "Checkout as Guest" hoặc "Login to Checkout"

2. **Guest Checkout Form:**
   - Email là bắt buộc (để gửi order confirmation)
   - All shipping fields required
   - Form validation tương tự regular checkout
   - No authentication required

3. **Guest Order Creation:**
   - Order created với `user_id = null`
   - Order includes email từ form
   - Order linked to `session_id` (guest cart)
   - Confirmation email sent to provided email

4. **Cart Identification:**
   - Guest cart identified by `session_id`
   - Session ID persist trong cookie (30 days)
   - Cart accessible across page reloads

5. **Order Linking:**
   - Guest orders linked by email
   - When user registers với same email, orders linked to account
   - Guest cart merged into user cart on login

6. **Email Confirmation:**
   - Email sent to provided email address
   - Email includes order details và tracking info
   - No account required to receive email

### 2.3. Edge Cases

| Case | Behavior |
|------|----------|
| **Guest cart empty** | Redirect to `/cart` với message |
| **Invalid email format** | Show validation error |
| **Email already registered** | Allow guest checkout, link order when user logs in |
| **Session ID expired** | Generate new session_id, create new cart |
| **Guest cart items out of stock** | Backend validation, show error |
| **Network error** | Show error toast, allow retry |
| **Order creation fails** | Show error message, keep cart |

---

## 3. 🔌 API Requirements

### 3.1. Create Guest Order

**Endpoint:** `POST /api/v1/orders`

**Request Headers:**
- `X-Session-ID: {session_id}` (required for guest)
- `Content-Type: application/json`

**Note:** No `Authorization` header (guest checkout)

**Request Body:**
```json
{
  "shipping_info": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "San Francisco",
    "postal_code": "94102",
    "country": "US"
  },
  "shipping_method": "standard",
  "payment_method": "credit_card",
  "cart_id": "cart_123",
  "user_id": null
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Order created successfully",
  "data": {
    "order_id": "order_123",
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total_amount": 309.97,
    "shipping_cost": 10.00,
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- **400:** Bad Request (invalid data, missing fields)
- **40001:** Cart item out of stock
- **40002:** Cart empty
- **500:** Internal server error

### 3.2. Link Guest Orders to User (Future)

**Endpoint:** `POST /api/v1/orders/link-guest-orders`

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Guest orders linked successfully",
  "data": {
    "linked_orders": 2,
    "merged_cart": true
  }
}
```

**Note:** This endpoint links guest orders (created with same email) to user account after registration/login.

---

## 4. 📝 Acceptance Criteria

### 4.1. Guest Checkout Option
- [ ] **AC-1.1:** When not logged in và click "Checkout", show checkout options
- [ ] **AC-1.2:** "Checkout as Guest" button available
- [ ] **AC-1.3:** "Login to Checkout" button available
- [ ] **AC-1.4:** Click "Checkout as Guest" → Continue to guest checkout form
- [ ] **AC-1.5:** Click "Login to Checkout" → Redirect to `/login?redirect=/checkout`

### 4.2. Guest Checkout Form
- [ ] **AC-2.1:** Form hiển thị all required fields (Email, Full Name, Phone, Address, City, Postal Code, Country)
- [ ] **AC-2.2:** Email field required và validated (format)
- [ ] **AC-2.3:** All shipping fields required
- [ ] **AC-2.4:** Shipping method selection available
- [ ] **AC-2.5:** Payment method selection available
- [ ] **AC-2.6:** Order review section hiển thị
- [ ] **AC-2.7:** Form validation prevents submit if fields invalid

### 4.3. Guest Order Creation
- [ ] **AC-3.1:** Order created với `user_id = null`
- [ ] **AC-3.2:** Order includes email từ form
- [ ] **AC-3.3:** Order linked to `session_id` (guest cart)
- [ ] **AC-3.4:** Confirmation email sent to provided email
- [ ] **AC-3.5:** Guest cart cleared after order creation
- [ ] **AC-3.6:** Redirect to order confirmation page

### 4.4. Guest Cart to User Cart Merge
- [ ] **AC-4.1:** When user registers với email matching guest order, orders linked
- [ ] **AC-4.2:** Guest cart merged into user cart on login
- [ ] **AC-4.3:** User can view guest orders in order history

---

## 5. 🛠️ Implementation Details

### 5.1. Components (To be created)

**GuestCheckoutOption Component:**
- **File:** `frontend/src/components/checkout/guest-checkout-option.tsx` (to be created)
- **Type:** Client Component
- **Features:**
  - Display 2 options: "Checkout as Guest" và "Login to Checkout"
  - Handle navigation based on selection

**GuestCheckoutForm Component:**
- **File:** `frontend/src/components/checkout/guest-checkout-form.tsx` (to be created)
- **Type:** Client Component
- **Features:**
  - Similar to regular checkout form
  - Email field required
  - No authentication required
  - Submit guest order creation

### 5.2. Server Actions (To be created)

**createGuestOrder Function:**
- **File:** `frontend/src/actions/order-action.ts` (to be created)
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `POST /api/v1/orders` without Authorization header
  - Include `X-Session-ID` header
  - Set `user_id: null` in request
  - Handle guest order creation

### 5.3. Pages (To be created)

**Checkout Page (Update):**
- **File:** `frontend/src/app/[locale]/checkout/page.tsx` (to be created)
- **Type:** Server Component
- **Features:**
  - Check authentication status
  - If not authenticated → Show guest checkout option
  - If authenticated → Show regular checkout form
  - Handle guest checkout flow

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Guest checkout option hiển thị when not logged in
- [ ] "Checkout as Guest" navigates to guest checkout form
- [ ] "Login to Checkout" redirects to login page
- [ ] Guest checkout form works correctly
- [ ] Guest order creation succeeds
- [ ] Confirmation email sent to provided email
- [ ] Guest cart cleared after order
- [ ] Guest orders linked to user account on registration

### 6.2. UI/UX Tests
- [ ] Checkout options UI clear và intuitive
- [ ] Guest checkout form layout correct
- [ ] Form validation works
- [ ] Error messages hiển thị correctly

### 6.3. Edge Case Tests
- [ ] Empty guest cart handling
- [ ] Invalid email format
- [ ] Email already registered
- [ ] Session ID expired
- [ ] Cart items out of stock
- [ ] Network error handling

---

## 7. 📚 Related Documentation

- **Story:** [US-CHECKOUT-02: Thanh toán không cần đăng ký](../story-008-guest-checkout.md)
- **Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)
- **Checkout Process:** [FE-CHECKOUT-001: Checkout Process](./feature-007-checkout-process-logic.md)
- **Cart Management:** [FE-CART-001: Cart Management](./feature-005-cart-management-logic.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

---

## 8. 🚧 Implementation Roadmap

### Phase 1: Guest Checkout Option (Priority: High)
1. Create GuestCheckoutOption component
2. Update checkout page to show options for unauthenticated users
3. Handle "Checkout as Guest" và "Login to Checkout" flows

### Phase 2: Guest Checkout Form (Priority: High)
1. Create GuestCheckoutForm component
2. Implement form với email requirement
3. Integrate với shipping và payment selection
4. Backend: Support `user_id = null` in order creation

### Phase 3: Guest Order Management (Priority: Medium)
1. Backend: Link guest orders by email
2. Frontend: Link orders when user registers/logs in
3. Order history shows guest orders after linking

### Phase 4: Email Confirmation (Priority: Medium)
1. Backend: Send confirmation email to guest email
2. Email includes order details và tracking

