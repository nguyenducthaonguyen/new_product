# 📄 Feature Specification: FE-CHECKOUT-001 - Checkout Process (Logic & UI)

**Parent Story:** [US-CHECKOUT-01: Quy trình thanh toán](../story-007-checkout-process.md)
**Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Checkout Page Layout (`/checkout`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Checkout Process                        │
│ ┌─────────────────────────────────────┐ │
│ │ Step 1: Shipping Information        │ │
│ │ [Form Fields]                       │ │
│ ├─────────────────────────────────────┤ │
│ │ Step 2: Shipping Method             │ │
│ │ [Radio Buttons]                     │ │
│ ├─────────────────────────────────────┤ │
│ │ Step 3: Payment Method              │ │
│ │ [Radio Buttons]                     │ │
│ ├─────────────────────────────────────┤ │
│ │ Step 4: Order Review                 │ │
│ │ [Cart Items]                        │ │
│ │ [Totals]                            │ │
│ ├─────────────────────────────────────┤ │
│ │ [Place Order Button]                │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

**Alternative: Multi-step Wizard Layout:**
```
┌─────────────────────────────────────────┐
│ [1] Shipping → [2] Payment → [3] Review  │
├─────────────────────────────────────────┤
│ Current Step Content                     │
│ [Form/Selection/Review]                  │
├─────────────────────────────────────────┤
│ [Back] [Next/Place Order]                │
└─────────────────────────────────────────┘
```

### 1.2. Shipping Information Form

**Form Fields:**
```
┌─────────────────────────────────────────┐
│ Shipping Information                    │
├─────────────────────────────────────────┤
│ Full Name *                             │
│ [Input]                                 │
│                                         │
│ Email *                                 │
│ [Input]                                 │
│                                         │
│ Phone *                                 │
│ [Input]                                 │
│                                         │
│ Address *                               │
│ [Textarea]                              │
│                                         │
│ City *                                  │
│ [Input]                                 │
│                                         │
│ Postal Code *                           │
│ [Input]                                 │
│                                         │
│ Country *                               │
│ [Select Dropdown]                       │
└─────────────────────────────────────────┘
```

**Validation:**
- All fields required (marked with *)
- Email format validation
- Phone format validation (optional)
- Postal code format validation (optional)

### 1.3. Shipping Method Selection

**Shipping Options:**
```
┌─────────────────────────────────────────┐
│ Shipping Method                         │
├─────────────────────────────────────────┤
│ ○ Standard Shipping                    │
│   5-7 business days                     │
│   FREE                                  │
│                                         │
│ ○ Express Shipping                     │
│   2-3 business days                     │
│   $10.00                                │
│                                         │
│ ○ Overnight Shipping                   │
│   1 business day                        │
│   $25.00                                │
└─────────────────────────────────────────┘
```

**Display:**
- Radio buttons for selection
- Method name, delivery time, cost
- Selected method highlighted

### 1.4. Payment Method Selection

**Payment Options:**
```
┌─────────────────────────────────────────┐
│ Payment Method                          │
├─────────────────────────────────────────┤
│ ○ Credit Card                           │
│   [Card Form - Future]                  │
│                                         │
│ ○ PayPal                                │
│   [PayPal Button - Future]              │
│                                         │
│ ○ Bank Transfer                         │
│   [Bank Details - Future]               │
└─────────────────────────────────────────┘
```

**Note:** Payment form details chưa implement, chỉ selection.

### 1.5. Order Review

**Review Section:**
```
┌─────────────────────────────────────────┐
│ Order Review                            │
├─────────────────────────────────────────┤
│ Items:                                  │
│ • Product A x2        $199.98           │
│ • Product B x1        $99.99            │
├─────────────────────────────────────────┤
│ Subtotal:              $299.97          │
│ Shipping:               $10.00           │
│ Tax:                    $0.00           │
├─────────────────────────────────────────┤
│ Total:                 $309.97          │
└─────────────────────────────────────────┘
```

**Display:**
- List of cart items với quantity và price
- Subtotal (cart total)
- Shipping cost (based on selected method)
- Tax (if applicable)
- Total amount

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

#### Checkout Page Load
```
User clicks "Checkout" from Cart
  ↓
Navigate to /checkout
  ↓
Server Component (page.tsx)
  ↓
Check authentication (optional for guest checkout)
  ↓
Fetch current cart: getCart()
  ↓
If cart empty → Redirect to /cart
  ↓
Render Checkout Form
```

#### Place Order Flow
```
User fills all required fields
  ↓
User selects shipping method
  ↓
User selects payment method
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
  - Shipping information
  - Shipping method
  - Payment method
  - Cart items
  ↓
Response: Order (with orderId)
  ↓
Clear cart: clearCart()
  ↓
Redirect to /orders/{orderId}/confirmation
```

### 2.2. Component Hierarchy

```
Checkout Page (Server Component)
  ├── HomeHeader (Client Component)
  ├── CheckoutForm (Client Component)
  │   ├── Shipping Information Form
  │   ├── Shipping Method Selection
  │   ├── Payment Method Selection
  │   ├── Order Review
  │   └── Place Order Button
  └── Footer (Static Component)
```

### 2.3. Business Rules

1. **Authentication:**
   - Option 1: Require login (redirect to `/login` if not authenticated)
   - Option 2: Guest checkout (allow without login, require email)

2. **Cart Validation:**
   - Cart must not be empty
   - If empty, redirect to `/cart`
   - Validate cart items still in stock (backend)

3. **Shipping Information:**
   - All fields required
   - Email format validation
   - Phone format validation (optional)
   - Address must be complete

4. **Shipping Method:**
   - User must select one method
   - Shipping cost added to total
   - Free shipping for Standard method

5. **Payment Method:**
   - User must select one method
   - Payment form details (future implementation)
   - Payment processing (future implementation)

6. **Order Creation:**
   - Order created với status "pending"
   - Order includes all cart items
   - Order includes shipping và payment info
   - Cart cleared after successful order

7. **Order Confirmation:**
   - Redirect to `/orders/{orderId}/confirmation`
   - Display order details
   - Send confirmation email (backend)

### 2.4. Edge Cases

| Case | Behavior |
|------|----------|
| **Empty cart** | Redirect to `/cart` với message |
| **Cart item out of stock** | Backend validation, show error, allow update |
| **Invalid email format** | Show validation error |
| **Missing required fields** | Show validation errors, prevent submit |
| **Network error** | Show error toast, allow retry |
| **Order creation fails** | Show error message, keep cart, allow retry |
| **User not authenticated** | Redirect to login (if required) or allow guest checkout |

---

## 3. 🔌 API Requirements

### 3.1. Create Order

**Endpoint:** `POST /api/v1/orders`

**Request Headers:**
- `Authorization: Bearer {access_token}` (required if authenticated)
- `X-Session-ID: {session_id}` (required for guest)
- `Content-Type: application/json`

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
  "shipping_method": "standard", // "standard" | "express" | "overnight"
  "payment_method": "credit_card", // "credit_card" | "paypal" | "bank_transfer"
  "cart_id": "cart_123"
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
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Order Schema:**
```typescript
{
  order_id: string;
  order_number: string;
  status: string; // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  total_amount: number;
  shipping_cost: number;
  tax: number;
  created_at: string;
}
```

**Error Responses:**
- **400:** Bad Request (invalid data, missing fields)
- **401:** Unauthorized (if login required)
- **40001:** Cart item out of stock
- **40002:** Cart empty
- **500:** Internal server error

### 3.2. Get Shipping Methods (Future)

**Endpoint:** `GET /api/v1/shipping/methods`

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": "standard",
      "name": "Standard Shipping",
      "description": "5-7 business days",
      "cost": 0.00,
      "estimated_days": 5
    },
    {
      "id": "express",
      "name": "Express Shipping",
      "description": "2-3 business days",
      "cost": 10.00,
      "estimated_days": 2
    },
    {
      "id": "overnight",
      "name": "Overnight Shipping",
      "description": "1 business day",
      "cost": 25.00,
      "estimated_days": 1
    }
  ]
}
```

**Note:** Currently hardcoded in frontend, future API endpoint.

### 3.3. Get Payment Methods (Future)

**Endpoint:** `GET /api/v1/payment/methods`

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": "credit_card",
      "name": "Credit Card",
      "enabled": true
    },
    {
      "id": "paypal",
      "name": "PayPal",
      "enabled": true
    },
    {
      "id": "bank_transfer",
      "name": "Bank Transfer",
      "enabled": true
    }
  ]
}
```

**Note:** Currently hardcoded in frontend, future API endpoint.

---

## 4. 📝 Acceptance Criteria

### 4.1. Checkout Page Access
- [ ] **AC-1.1:** Click "Checkout" từ cart page navigate đến `/checkout`
- [ ] **AC-1.2:** Checkout page hiển thị Header và Footer
- [ ] **AC-1.3:** If cart empty, redirect to `/cart` với message
- [ ] **AC-1.4:** If not authenticated và login required, redirect to `/login`

### 4.2. Shipping Information
- [ ] **AC-2.1:** Form hiển thị all required fields (Full Name, Email, Phone, Address, City, Postal Code, Country)
- [ ] **AC-2.2:** All fields marked as required (*)
- [ ] **AC-2.3:** Email format validation
- [ ] **AC-2.4:** Phone format validation (optional)
- [ ] **AC-2.5:** Form validation prevents submit if fields invalid
- [ ] **AC-2.6:** Error messages hiển thị for invalid fields

### 4.3. Shipping Method Selection
- [ ] **AC-3.1:** 3 shipping methods hiển thị (Standard, Express, Overnight)
- [ ] **AC-3.2:** Each method shows name, delivery time, và cost
- [ ] **AC-3.3:** Radio buttons for selection
- [ ] **AC-3.4:** User must select one method
- [ ] **AC-3.5:** Selected method highlighted
- [ ] **AC-3.6:** Shipping cost updates order total

### 4.4. Payment Method Selection
- [ ] **AC-4.1:** 3 payment methods hiển thị (Credit Card, PayPal, Bank Transfer)
- [ ] **AC-4.2:** Radio buttons for selection
- [ ] **AC-4.3:** User must select one method
- [ ] **AC-4.4:** Selected method highlighted
- [ ] **AC-4.5:** Payment form details (future implementation)

### 4.5. Order Review
- [ ] **AC-5.1:** Order review hiển thị all cart items
- [ ] **AC-5.2:** Each item shows name, quantity, price, subtotal
- [ ] **AC-5.3:** Subtotal calculated (cart total)
- [ ] **AC-5.4:** Shipping cost hiển thị (based on selected method)
- [ ] **AC-5.5:** Tax hiển thị (if applicable)
- [ ] **AC-5.6:** Total amount calculated correctly

### 4.6. Place Order
- [ ] **AC-6.1:** "Place Order" button disabled until all fields filled
- [ ] **AC-6.2:** Validate all fields before submit
- [ ] **AC-6.3:** API call `POST /api/v1/orders` với all data
- [ ] **AC-6.4:** Loading state hiển thị during order creation
- [ ] **AC-6.5:** On success: Clear cart, redirect to `/orders/{orderId}/confirmation`
- [ ] **AC-6.6:** On error: Show error message, keep cart, allow retry

---

## 5. 🛠️ Implementation Details

### 5.1. Components (To be created)

**CheckoutForm Component:**
- **File:** `frontend/src/components/checkout/checkout-form.tsx` (to be created)
- **Type:** Client Component (`'use client'`)
- **State:**
  - `shippingInfo: ShippingInfo` - Shipping form data
  - `shippingMethod: string` - Selected shipping method
  - `paymentMethod: string` - Selected payment method
  - `isSubmitting: boolean` - Loading state
  - `errors: FormErrors` - Validation errors

- **Features:**
  - Multi-step form hoặc single-page form
  - Form validation với Zod
  - Submit order creation
  - Error handling

**ShippingForm Component:**
- **File:** `frontend/src/components/checkout/shipping-form.tsx` (to be created)
- **Type:** Client Component
- **Features:**
  - Shipping information fields
  - Form validation
  - Error messages

**OrderReview Component:**
- **File:** `frontend/src/components/checkout/order-review.tsx` (to be created)
- **Type:** Client Component
- **Features:**
  - Display cart items
  - Calculate và display totals
  - Show shipping cost
  - Show tax (if applicable)

### 5.2. Server Actions (To be created)

**createOrder Function:**
- **File:** `frontend/src/actions/order-action.ts` (to be created)
- **Type:** Server Action (`'use server'`)
- **Signature:**
  ```typescript
  async function createOrder(request: CreateOrderRequest): Promise<{
    success: boolean;
    data: Order | null;
    error?: string;
    errorCode?: string;
  }>
  ```
- **Features:**
  - Call `POST /api/v1/orders`
  - Validate request data
  - Handle errors
  - Clear cart on success

### 5.3. Pages (To be created)

**Checkout Page:**
- **File:** `frontend/src/app/[locale]/checkout/page.tsx` (to be created)
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const cart = await getCart();
  if (!cart.data || cart.data.items.length === 0) {
    redirect('/cart');
  }
  return (
    <div>
      <HomeHeader />
      <CheckoutForm initialCart={cart.data} />
      <Footer />
    </div>
  );
  ```

**Order Confirmation Page:**
- **File:** `frontend/src/app/[locale]/orders/[orderId]/confirmation/page.tsx` (to be created)
- **Type:** Server Component
- **Features:**
  - Display order details
  - Show order number
  - Show order status
  - Show total amount

### 5.4. Entities (To be created)

**Order Types:**
- **File:** `frontend/src/entities/order.ts` (to be created)
- **Schemas:**
  - `ShippingInfoSchema` - Shipping information
  - `CreateOrderRequestSchema` - Order creation request
  - `OrderSchema` - Order response

**ShippingInfo Type:**
```typescript
{
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}
```

**CreateOrderRequest Type:**
```typescript
{
  shipping_info: ShippingInfo;
  shipping_method: "standard" | "express" | "overnight";
  payment_method: "credit_card" | "paypal" | "bank_transfer";
  cart_id: string;
}
```

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Checkout page loads correctly
- [ ] Empty cart redirects to /cart
- [ ] Shipping form validation works
- [ ] Shipping method selection works
- [ ] Payment method selection works
- [ ] Order review displays correctly
- [ ] Order creation succeeds
- [ ] Cart cleared after order creation
- [ ] Redirect to confirmation page

### 6.2. UI/UX Tests
- [ ] Form layout responsive
- [ ] Form validation errors hiển thị correctly
- [ ] Shipping method selection UI works
- [ ] Payment method selection UI works
- [ ] Order review totals calculated correctly
- [ ] Loading states work
- [ ] Error messages hiển thị correctly

### 6.3. Validation Tests
- [ ] Required fields validation
- [ ] Email format validation
- [ ] Phone format validation
- [ ] All fields must be filled before submit
- [ ] Shipping method must be selected
- [ ] Payment method must be selected

### 6.4. Edge Case Tests
- [ ] Empty cart handling
- [ ] Cart item out of stock
- [ ] Invalid email format
- [ ] Missing required fields
- [ ] Network error handling
- [ ] Order creation failure
- [ ] User not authenticated (if required)

---

## 7. 📚 Related Documentation

- **Story:** [US-CHECKOUT-01: Quy trình than h toán](../story-007-checkout-process.md)
- **Epic:** [EP-02: Shopping Cart & Checkout](../../list.md#ep-02-shopping-cart--checkout-giỏ-hàng--thanh-toán)
- **Cart Management:** [FE-CART-001: Cart Management](./feature-005-cart-management-logic.md)
- **Guest Checkout:** [US-CHECKOUT-02: Thanh toán không cần đăng ký](../story-008-guest-checkout.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

---

## 8. 🚧 Implementation Roadmap

### Phase 1: Basic Checkout Page (Priority: High)
1. Create checkout page component (`/checkout`)
2. Create shipping information form
3. Create shipping method selection
4. Create payment method selection
5. Create order review section
6. Backend: Implement `POST /api/v1/orders` endpoint
7. Create order confirmation page

### Phase 2: Form Validation & Error Handling (Priority: High)
1. Implement form validation với Zod
2. Add error messages
3. Handle API errors
4. Handle network errors

### Phase 3: Payment Integration (Priority: Medium)
1. Credit card form integration
2. PayPal integration
3. Bank transfer details
4. Payment processing

### Phase 4: Order Management (Priority: Medium)
1. Order history page
2. Order detail page
3. Order tracking
4. Order cancellation

