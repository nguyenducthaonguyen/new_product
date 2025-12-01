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

## 🗂️ API List Summary

### 1. Product APIs
- **GET** `/api/v1/products` - List products (Filter/Sort)
- **GET** `/api/v1/products/{slug}` - Get product detail

### 2. Cart APIs
- **GET** `/api/v1/cart` - Get current cart
- **POST** `/api/v1/cart/items` - Add item to cart
- **PATCH** `/api/v1/cart/items/{itemId}` - Update quantity
- **DELETE** `/api/v1/cart/items/{itemId}` - Remove item

---

## 📋 Detailed API Endpoint Specifications

### 1. Product APIs

#### GET `/api/v1/products`
**Purpose:** Lấy thông tin chi tiết sản phẩm để hiển thị trang Product Detail.

**Response Body (Success):**
```json
{
  "success": true,
  "data": [{
    "id": "prod_123",
    "slug": "nike-air-max-90",
    "name": "Nike Air Max 90",
    "price": 120.00,
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
        "price_modifier": 0
      },
      {
        "sku": "SKU-BLUE-42",
        "color": "Blue",
        "size": "42",
        "stock": 0,
        "price_modifier": 0
      }
    ],
    "rating": 4.8,
    "review_count": 120
  }]
}
```

---

### 2. Product APIs

#### GET `/api/v1/products/{slug}`
**Purpose:** Lấy thông tin chi tiết sản phẩm để hiển thị trang Product Detail.

**Response Body (Success):**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "slug": "nike-air-max-90",
    "name": "Nike Air Max 90",
    "price": 120.00,
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
        "price_modifier": 0
      },
      {
        "sku": "SKU-BLUE-42",
        "color": "Blue",
        "size": "42",
        "stock": 0,
        "price_modifier": 0
      }
    ],
    "rating": 4.8,
    "review_count": 120
  }
}
```

---

### 2. Cart APIs

#### POST `/api/v1/cart/items`
**Purpose:** Thêm sản phẩm vào giỏ hàng.

**Request Body:**
```json
{
  "sku": "SKU-RED-42",
  "quantity": 1
}
```

**Response Body (Success):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart_id": "cart_abc",
    "total_items": 3,
    "total_price": 360.00
  }
}
```

**Error Codes:**
- `40001` (OUT_OF_STOCK): Sản phẩm đã hết hàng.
- `40002` (MAX_QUANTITY_REACHED): Vượt quá số lượng cho phép.
