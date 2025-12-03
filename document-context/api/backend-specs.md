# API Documentation: NEXUS E-commerce

## 📚 Document Purpose
Tài liệu này định nghĩa các API Endpoint cho dự án NEXUS.

---

## 🛠️ Mocking Strategy (Khi Backend chưa sẵn sàng)
Trong trường hợp API chưa được implement, Frontend Developer (và AI) cần thực hiện Mocking để không bị block.

1.  **Mock Location:** Viết mock logic ngay trong `src/actions/[feature].ts` hoặc sử dụng MSW.
2.  **Simulation:**
    *   Sử dụng `await new Promise(resolve => setTimeout(resolve, 1000))` để giả lập network latency.
    *   Trả về dữ liệu đúng chuẩn `Response Body` bên dưới.
3.  **Flag:** Dùng `NEXT_PUBLIC_USE_MOCK=true`.

---

## 🔐 Authentication & Headers

### Request Headers
- **Authorization:** `Bearer {access_token}` (required for authenticated endpoints)
- **X-Session-ID:** `{session_id}` (required for guest cart operations)
- **Content-Type:** `application/json`

### Response Format
Backend sử dụng 2 response formats:

1. **Standard Format (Product APIs):**
```json
{
  "success": true,
  "data": {...}
}
```

2. **Status Code Format (Cart, Auth APIs):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {...}
}
```

### Error Response Format
```json
{
  "status_code": 400,
  "error": "Bad Request",
  "message": "Error message",
  "path": "/api/v1/...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Business Exception Format:**
```json
{
  "success": false,
  "error_code": "40001",
  "message": "Error message"
}
```

---

## 🗂️ API List Summary

### 1. Product APIs
- **GET** `/api/v1/products` - List products (Pagination) ✅ **IMPLEMENTED**
- **GET** `/api/v1/products/{slug}` - Get product detail ✅ **IMPLEMENTED**

### 2. Cart APIs
- **GET** `/api/v1/cart` - Get current cart with all items ✅ **IMPLEMENTED**
- **POST** `/api/v1/cart/items` - Add item to cart (returns SimpleCartResponse) ✅ **IMPLEMENTED**
- **PATCH** `/api/v1/cart/items/{itemId}` - Update quantity ⏳ **PENDING**
- **DELETE** `/api/v1/cart/items/{itemId}` - Remove item ⏳ **PENDING**

### 3. Authentication APIs
- **POST** `/api/v1/auth/login` - Login với username/password ✅ **IMPLEMENTED**
- **POST** `/api/v1/auth/refresh` - Refresh access token ✅ **IMPLEMENTED**
- **GET** `/api/v1/auth/me` - Get current user info ✅ **IMPLEMENTED**
- **POST** `/api/v1/auth/logout` - Logout (clear tokens) ✅ **IMPLEMENTED**
- **POST** `/api/v1/auth/logout/all` - Logout all devices ✅ **IMPLEMENTED**
- **POST** `/api/v1/auth/register` - Register new user ✅ **IMPLEMENTED**

### 4. User APIs
- **GET** `/api/v1/users/me` - Get current user profile ✅ **IMPLEMENTED**
- **PATCH** `/api/v1/users/me` - Update user profile ✅ **IMPLEMENTED**
- **PATCH** `/api/v1/users/me/avatar` - Update user avatar ✅ **IMPLEMENTED**

### 5. Upload APIs
- **GET** `/api/v1/upload/presigned-url` - Get S3 presigned URL for upload ✅ **IMPLEMENTED**

### 6. Order APIs
- **POST** `/api/v1/orders` - Create order ⏳ **PENDING**
- **GET** `/api/v1/orders/me` - Get user orders ⏳ **PENDING**

---

## 📋 Detailed API Endpoint Specifications

### 1. Product APIs

#### GET `/api/v1/products`
**Purpose:** Lấy danh sách sản phẩm với pagination.

**Query Parameters:**
- `offset` (int, optional): Pagination offset (default: 0)
- `limit` (int, optional): Number of items per page (default: 50)

**Request Headers:**
- None required (public endpoint)

**Response Body (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "nike-air-max-90",
      "name": "Nike Air Max 90",
      "price": "120.00",
      "currency": "USD",
      "description": "The Nike Air Max 90 stays true to its OG running roots...",
      "images": [
        "https://nexus.com/img/nike-1.jpg",
        "https://nexus.com/img/nike-2.jpg"
      ],
      "rating": 4.8,
      "review_count": 120
    }
  ]
}
```

**Note:** Response không bao gồm `variants` trong list view. Chỉ có trong detail view.

---

#### GET `/api/v1/products/{slug}`
**Purpose:** Lấy thông tin chi tiết sản phẩm để hiển thị trang Product Detail.

**Path Parameters:**
- `slug` (string, required): Product slug

**Request Headers:**
- None required (public endpoint)

**Response Body (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "nike-air-max-90",
    "name": "Nike Air Max 90",
    "price": "120.00",
    "currency": "USD",
    "description": "The Nike Air Max 90 stays true to its OG running roots...",
    "images": [
      "https://nexus.com/img/nike-1.jpg",
      "https://nexus.com/img/nike-2.jpg"
    ],
    "variants": [
      {
        "sku": "SKU-RED-42",
        "color": "Red",
        "size": "42",
        "stock": 10,
        "price_modifier": "0.00"
      },
      {
        "sku": "SKU-BLUE-42",
        "color": "Blue",
        "size": "42",
        "stock": 0,
        "price_modifier": "0.00"
      }
    ],
    "rating": 4.8,
    "review_count": 120
  }
}
```

**Error Responses:**
- **404:** Product not found

---

### 2. Cart APIs

#### GET `/api/v1/cart`
**Purpose:** Lấy giỏ hàng hiện tại với tất cả items.

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional - for authenticated users)
- `X-Session-ID: {session_id}` (optional - for guest users)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "cart_id": "cart_123",
    "total_items": 3,
    "total_price": "360.00",
    "items": [
      {
        "itemId": "item_1",
        "sku": "SKU-RED-42",
        "quantity": 2,
        "price": "120.00"
      },
      {
        "itemId": "item_2",
        "sku": "SKU-BLUE-43",
        "quantity": 1,
        "price": "120.00"
      }
    ]
  }
}
```

**Note:** 
- Nếu cart rỗng, `items` sẽ là mảng rỗng `[]`
- `total_price` và `price` là strings (Decimal format)
- Guest users sử dụng `session_id` để track cart

---

#### POST `/api/v1/cart/items`
**Purpose:** Thêm sản phẩm vào giỏ hàng.

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional - for authenticated users)
- `X-Session-ID: {session_id}` (optional - for guest users)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "sku": "SKU-RED-42",
  "quantity": 1
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Item added to cart",
  "data": {
    "cart_id": "cart_123",
    "total_items": 3,
    "total_price": "360.00"
  }
}
```

**Note:** Response chỉ trả về `SimpleCartResponse` (không có `items` array). Frontend cần gọi `GET /api/v1/cart` để lấy full cart.

**Error Responses:**
- **400:** Bad Request (invalid request body)
- **40001** (OUT_OF_STOCK): Sản phẩm đã hết hàng
- **40002** (MAX_QUANTITY_REACHED): Vượt quá số lượng cho phép
- **40003** (INVALID_SKU): SKU không tồn tại
- **500:** Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "error_code": "40001",
  "message": "Product is out of stock"
}
```

---

#### PATCH `/api/v1/cart/items/{itemId}`
**Purpose:** Cập nhật số lượng item trong giỏ hàng.

**Path Parameters:**
- `itemId` (string, required): Item ID (format: `item_{id}`)

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional)
- `X-Session-ID: {session_id}` (optional)

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Cart updated",
  "data": {
    "cart_id": "cart_123",
    "total_items": 3,
    "total_price": "360.00",
    "items": [...]
  }
}
```

**Error Responses:**
- **404:** Item not found
- **40001:** Out of stock
- **40002:** Max quantity reached

---

#### DELETE `/api/v1/cart/items/{itemId}`
**Purpose:** Xóa item khỏi giỏ hàng.

**Path Parameters:**
- `itemId` (string, required): Item ID (format: `item_{id}`)

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional)
- `X-Session-ID: {session_id}` (optional)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Item removed from cart",
  "data": {
    "cart_id": "cart_123",
    "total_items": 2,
    "total_price": "240.00",
    "items": [...]
  }
}
```

**Error Responses:**
- **404:** Item not found

---

### 3. Authentication APIs

#### POST `/api/v1/auth/login`
**Purpose:** Đăng nhập với username và password.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "token_type": "bearer",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "refresh_expires_in": 604800,
    "id": 1,
    "username": "john_doe",
    "role": "customer"
  }
}
```

**Note:** 
- Backend tự động set `access_token` và `refresh_token` vào HttpOnly cookies
- Response body cũng trả về tokens để frontend có thể sử dụng

**Error Responses:**
- **401:** Invalid credentials
- **401:** User blocked

---

#### POST `/api/v1/auth/refresh`
**Purpose:** Refresh access token sử dụng refresh token.

**Request Headers:**
- `Content-Type: application/json`
- Cookie: `refresh_token` (HttpOnly cookie)

**Request Body:**
```json
{}
```

**Note:** Refresh token được đọc từ cookie, không cần gửi trong body.

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}
```

**Note:** Backend tự động set `access_token` mới vào HttpOnly cookie.

**Error Responses:**
- **401:** Invalid or expired refresh token
- **500:** Internal Server Error (duplicate token - retry logic)

---

#### GET `/api/v1/auth/me`
**Purpose:** Lấy thông tin user hiện tại.

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "avatar": "https://s3.amazonaws.com/...",
    "role": "customer",
    "status": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- **401:** Unauthorized (invalid or expired token)

---

#### POST `/api/v1/auth/logout`
**Purpose:** Đăng xuất (clear tokens cho current device).

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)
- Cookie: `access_token`, `refresh_token`

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Logged out successfully"
}
```

**Note:** Backend tự động clear `access_token` và `refresh_token` cookies.

---

#### POST `/api/v1/auth/logout/all`
**Purpose:** Đăng xuất tất cả devices (clear all tokens).

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)
- Cookie: `access_token`, `refresh_token`

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Logged out from all devices successfully"
}
```

---

#### POST `/api/v1/auth/register`
**Purpose:** Đăng ký tài khoản mới.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "User registered successfully",
  "data": {
    "token_type": "bearer",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "refresh_expires_in": 604800,
    "id": 1,
    "username": "john_doe",
    "role": "customer"
  }
}
```

**Error Responses:**
- **400:** Bad Request (validation error)
- **409:** Conflict (username or email already exists)

---

### 4. User APIs

#### GET `/api/v1/users/me`
**Purpose:** Lấy thông tin profile của user hiện tại.

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "avatar": "https://s3.amazonaws.com/...",
    "role": "customer",
    "status": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH `/api/v1/users/me`
**Purpose:** Cập nhật thông tin profile của user.

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "+1234567890",
  "address": "456 New St"
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe Updated",
    "phone": "+1234567890",
    "address": "456 New St",
    "avatar": "https://s3.amazonaws.com/...",
    "role": "customer",
    "status": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH `/api/v1/users/me/avatar`
**Purpose:** Cập nhật avatar của user (S3 URL).

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "avatar": "https://s3.amazonaws.com/bucket/path/to/image.jpg"
}
```

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Avatar updated successfully",
  "data": {
    "id": 1,
    "avatar": "https://s3.amazonaws.com/bucket/path/to/image.jpg"
  }
}
```

---

### 5. Upload APIs

#### GET `/api/v1/upload/presigned-url`
**Purpose:** Lấy S3 presigned URL để upload file.

**Query Parameters:**
- `filename` (string, required): Tên file (e.g., "image.jpg")
- `expiration` (int, optional): Thời gian hết hạn (seconds, default: 3600, max: 604800)

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "url": "https://s3.amazonaws.com/bucket/path/to/file?X-Amz-Algorithm=...",
    "fields": {
      "key": "path/to/file",
      "bucket": "bucket-name"
    }
  }
}
```

---

### 6. Order APIs

#### POST `/api/v1/orders`
**Purpose:** Tạo đơn hàng mới.

**Request Headers:**
- `Authorization: Bearer {access_token}` (optional - for authenticated users)
- `X-Session-ID: {session_id}` (optional - for guest users)
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
  "shipping_method": "standard",
  "payment_method": "credit_card",
  "cart_id": "cart_123"
}
```

**Response Body (Success - 201):**
```json
{
  "status_code": 201,
  "message": "Order created successfully",
  "data": {
    "order_id": "order_123",
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total_amount": "309.97",
    "shipping_cost": "10.00",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- **400:** Bad Request (invalid data, missing fields)
- **40001:** Cart item out of stock
- **40002:** Cart empty
- **401:** Unauthorized (if login required)
- **500:** Internal Server Error

---

#### GET `/api/v1/orders/me`
**Purpose:** Lấy danh sách đơn hàng của user hiện tại.

**Request Headers:**
- `Authorization: Bearer {access_token}` (required)

**Query Parameters:**
- `offset` (int, optional): Pagination offset (default: 0)
- `limit` (int, optional): Number of items per page (default: 100, max: 100)

**Response Body (Success - 200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "order_id": "order_123",
      "order_number": "ORD-2024-001",
      "status": "pending",
      "total_amount": "309.97",
      "shipping_cost": "10.00",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 📝 Notes

### Response Format Inconsistency
- **Product APIs** sử dụng format: `{"success": true, "data": {...}}`
- **Cart, Auth, User APIs** sử dụng format: `{"status_code": 200, "message": "...", "data": {...}}`

Frontend cần handle cả 2 formats:
- Check `response.success === true` hoặc `response.status_code === 200`
- Data luôn nằm trong `response.data`

### Decimal Fields
Các field `price`, `total_price`, `price_modifier` được trả về dưới dạng **string** (Decimal format) để tránh precision loss:
- `"120.00"` thay vì `120.00`
- Frontend cần parse sang number khi sử dụng

### Guest Cart Support
- Guest users sử dụng `session_id` (từ cookie hoặc header `X-Session-ID`)
- Authenticated users sử dụng `user_id` (từ `Authorization` header)
- Backend tự động merge guest cart vào user cart khi user login

### Token Management
- `access_token`: HttpOnly cookie, expires in 15 minutes
- `refresh_token`: HttpOnly cookie, expires in 7 days
- Backend tự động set/clear cookies, frontend không cần handle manually

### Error Codes
- `40001`: OUT_OF_STOCK
- `40002`: MAX_QUANTITY_REACHED
- `40003`: INVALID_SKU
- `40004`: CART_EMPTY
