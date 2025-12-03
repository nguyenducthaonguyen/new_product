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

**Endpoint:** `POST /api/v1/orders/checkout`

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional, for authenticated users)
- `Content-Type: application/json`
- Session ID handled via cookies (for guest checkout)

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

**Response (201):**
```json
{
  "status_code": 200,
  "message": "Order created successfully",
  "data": {
    "order_id": "order_123",
    "order_number": "ORD-000123",
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
  order_id: string; // Format: "order_{id}"
  order_number: string; // Format: "ORD-{id:06d}"
  status: string; // "pending" | "paid" | "shipped" | "completed" | "cancelled"
  total_amount: number; // total_product + cost_ship
  shipping_cost: number; // Based on shipping_method
  created_at: string; // ISO 8601 datetime
}
```

**Backend Implementation:**
- **Endpoint:** `POST /api/v1/orders/checkout`
- **Service:** `OrderService.create_checkout_order()`
- **Repository:** `OrderRepository.create_order_with_items()`
- **Database:**
  - `orders` table: `total_product`, `cost_ship` columns
  - `order_items` table: `product_variant_id`, `sku` columns
- **Features:**
  - Validates cart items và stock availability
  - Calculates `total_product` (sum of cart items)
  - Calculates `cost_ship` based on `shipping_method`
  - Creates order với `product_variant_id` và `sku` from cart
  - Clears cart after successful order creation
  - Supports both authenticated và guest checkout

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
- [x] **AC-1.1:** Click "Checkout" từ cart page navigate đến `/checkout` ✅
- [x] **AC-1.2:** Checkout page hiển thị Header và Footer ✅
- [x] **AC-1.3:** If cart empty, redirect to `/cart` với message ✅
- [x] **AC-1.4:** Guest checkout supported (không require login) ✅

### 4.2. Shipping Information
- [x] **AC-2.1:** Form hiển thị all required fields (Full Name, Email, Phone, Address, City, Postal Code, Country) ✅
- [x] **AC-2.2:** All fields marked as required (*) ✅
- [x] **AC-2.3:** Email format validation ✅
- [x] **AC-2.4:** Phone format validation (optional) ✅
- [x] **AC-2.5:** Form validation prevents submit if fields invalid ✅
- [x] **AC-2.6:** Error messages hiển thị for invalid fields ✅

### 4.3. Shipping Method Selection
- [x] **AC-3.1:** 3 shipping methods hiển thị (Standard, Express, Overnight) ✅
- [x] **AC-3.2:** Each method shows name, delivery time, và cost ✅
- [x] **AC-3.3:** Radio buttons for selection ✅
- [x] **AC-3.4:** User must select one method ✅
- [x] **AC-3.5:** Selected method highlighted ✅
- [x] **AC-3.6:** Shipping cost updates order total ✅

### 4.4. Payment Method Selection
- [x] **AC-4.1:** 3 payment methods hiển thị (Credit Card, PayPal, Bank Transfer) ✅
- [x] **AC-4.2:** Radio buttons for selection ✅
- [x] **AC-4.3:** User must select one method ✅
- [x] **AC-4.4:** Selected method highlighted ✅
- [ ] **AC-4.5:** Payment form details (future implementation) ⏳

### 4.5. Order Review
- [x] **AC-5.1:** Order review hiển thị all cart items ✅
- [x] **AC-5.2:** Each item shows name, quantity, price, subtotal ✅
- [x] **AC-5.3:** Subtotal calculated (cart total) ✅
- [x] **AC-5.4:** Shipping cost hiển thị (based on selected method) ✅
- [x] **AC-5.5:** Tax hiển thị (currently $0, if applicable) ✅
- [x] **AC-5.6:** Total amount calculated correctly ✅

### 4.6. Place Order
- [x] **AC-6.1:** "Place Order" button disabled until all fields filled ✅
- [x] **AC-6.2:** Validate all fields before submit ✅
- [x] **AC-6.3:** API call `POST /api/v1/orders/checkout` với all data ✅
- [x] **AC-6.4:** Loading state hiển thị during order creation ✅
- [x] **AC-6.5:** On success: Clear cart, redirect to `/orders/{orderId}/confirmation` ✅
- [x] **AC-6.6:** On error: Show error message, keep cart, allow retry ✅

---

## 5. 🛠️ Implementation Details

### 5.1. Components ✅ **COMPLETED**

**CheckoutForm Component:**
- **File:** `frontend/src/components/checkout/checkout-form.tsx` ✅
- **Type:** Client Component (`'use client'`)
- **State:**
  - Uses `react-hook-form` với `useForm` hook
  - `isPending` state từ `useTransition` for loading
  - Form validation với `zodResolver` và `CreateOrderRequestSchema`

- **Features:**
  - Single-page form layout (all sections visible)
  - Form validation với Zod
  - Submit order creation via `createOrder()` server action
  - Error handling với toast notifications
  - Cart clearing after successful order
  - Redirect to confirmation page

**ShippingForm Component:**
- **File:** `frontend/src/components/checkout/shipping-form.tsx` ✅
- **Type:** Client Component
- **Features:**
  - All shipping information fields (Full Name, Email, Phone, Address, City, Postal Code, Country)
  - Form validation với `react-hook-form`
  - Error messages với `FormMessage`
  - Uses Shadcn UI components (`Input`, `Textarea`, `Select`)

**ShippingMethodSelection Component:**
- **File:** `frontend/src/components/checkout/shipping-method-selection.tsx` ✅
- **Type:** Client Component
- **Features:**
  - Radio group với 3 options (Standard, Express, Overnight)
  - Shows delivery time và cost for each method
  - Uses Shadcn UI `RadioGroup` component

**PaymentMethodSelection Component:**
- **File:** `frontend/src/components/checkout/payment-method-selection.tsx` ✅
- **Type:** Client Component
- **Features:**
  - Radio group với 3 options (Credit Card, PayPal, Bank Transfer)
  - Shows description for each method
  - Uses Shadcn UI `RadioGroup` component

**OrderReview Component:**
- **File:** `frontend/src/components/checkout/order-review.tsx` ✅
- **Type:** Client Component
- **Features:**
  - Displays cart items với image, name, quantity, price
  - Shows subtotal, shipping cost, total
  - Real-time calculation based on selected shipping method

### 5.2. Server Actions ✅ **COMPLETED**

**createOrder Function:**
- **File:** `frontend/src/actions/order-action.ts` ✅
- **Type:** Server Action (`'use server'`)
- **Signature:**
  ```typescript
  async function createOrder(request: CreateOrderRequest): Promise<{
    success: boolean;
    data: OrderResponse['data'] | null;
    error?: string;
    errorCode?: string;
  }>
  ```
- **Features:**
  - Call `POST /api/v1/orders/checkout`
  - Validate request data với `OrderResponseSchema`
  - Handle errors với detailed error messages
  - Returns order data với `order_id`, `order_number`, `status`, `total_amount`, `shipping_cost`, `created_at`

**getOrder Function:**
- **File:** `frontend/src/actions/order-action.ts` ✅
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `GET /api/v1/orders/{orderId}`
  - Validate response với `OrderSchema`
  - Handle type conversions (datetime, Decimal)

### 5.3. Pages ✅ **COMPLETED**

**Checkout Page:**
- **File:** `frontend/src/app/[locale]/checkout/page.tsx` ✅
- **Type:** Server Component
- **Implementation:**
  ```typescript
  const result = await getCart();
  if (!result.success || !result.data || result.data.items.length === 0) {
    redirect('/cart');
  }
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-1">
        <CheckoutForm initialCart={result.data} />
      </main>
      <Footer />
    </div>
  );
  ```

**Order Confirmation Page:**
- **File:** `frontend/src/app/[locale]/orders/[orderId]/confirmation/page.tsx` ✅
- **Type:** Server Component
- **Features:**
  - Display order details với order number, status, created date
  - Show shipping information
  - Show order items với product name, quantity, price
  - Show totals (subtotal, shipping, total)
  - "Continue Shopping" button

### 5.4. Entities ✅ **COMPLETED**

**Order Types:**
- **File:** `frontend/src/entities/order.ts` ✅
- **Schemas:**
  - `ShippingInfoSchema` - Shipping information với validation ✅
  - `CreateOrderRequestSchema` - Order creation request ✅
  - `OrderSchema` - Order response ✅
  - `OrderItemSchema` - Order item với `product_variant_id` và `sku` ✅
  - `OrderResponseSchema` - Order creation response ✅

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

**OrderItem Type:**
```typescript
{
  id: number;
  product_variant_id: number;
  sku: string;
  product_name: string | null;
  quantity: number;
  price: number;
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

## 8. ✅ Implementation Status

### Phase 1: Basic Checkout Page ✅ **COMPLETED**
1. ✅ Create checkout page component (`/checkout`)
2. ✅ Create shipping information form
3. ✅ Create shipping method selection
4. ✅ Create payment method selection
5. ✅ Create order review section
6. ✅ Backend: Implement `POST /api/v1/orders/checkout` endpoint
7. ✅ Create order confirmation page

### Phase 2: Form Validation & Error Handling ✅ **COMPLETED**
1. ✅ Implement form validation với Zod
2. ✅ Add error messages
3. ✅ Handle API errors
4. ✅ Handle network errors

### Phase 3: Payment Integration ⏳ **PENDING**
1. ⏳ Credit card form integration
2. ⏳ PayPal integration
3. ⏳ Bank transfer details
4. ⏳ Payment processing

### Phase 4: Order Management ⏳ **PENDING**
1. ⏳ Order history page
2. ⏳ Order detail page
3. ⏳ Order tracking
4. ⏳ Order cancellation

---

## 9. 📊 Implementation Summary

### ✅ Completed Implementation
- **Frontend Components:** All checkout components implemented
  - `CheckoutForm`: Main form orchestrator với react-hook-form
  - `ShippingForm`: Shipping information fields với validation
  - `ShippingMethodSelection`: Radio group for shipping options
  - `PaymentMethodSelection`: Radio group for payment options
  - `OrderReview`: Order summary với cart items và totals
- **Backend API:** Order creation endpoint với full validation
  - `POST /api/v1/orders/checkout`: Create order from cart
  - `GET /api/v1/orders/{orderId}`: Get order details
  - `OrderService.create_checkout_order()`: Business logic
  - `OrderRepository.create_order_with_items()`: Database operations
- **Database Schema:** Updated với improved design
  - `orders` table: `total_product`, `cost_ship` columns
  - `order_items` table: `product_variant_id`, `sku` columns (removed `product_id`)
- **Form Validation:** Complete với Zod schemas
  - `ShippingInfoSchema`: Shipping information validation
  - `CreateOrderRequestSchema`: Order request validation
  - `OrderSchema`: Order response validation
- **Error Handling:** Comprehensive error handling với user-friendly messages
- **Cart Integration:** Seamless integration với cart management
- **Order Confirmation:** Full order details display với shipping info và totals

### ⏳ Future Enhancements
- Payment processing integration (Credit Card, PayPal, Bank Transfer)
- Order history và tracking
- Order cancellation/return functionality
- Email notifications (backend ready, frontend display)

