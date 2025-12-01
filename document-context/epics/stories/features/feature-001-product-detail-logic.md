# Feature Logic: Product Detail Page
**Feature ID:** FE-PROD-001
**Story:** US-PROD-02

---

## 1. 🧠 Business Logic & Flows

### 1.1. Fetch Data Flow
1.  **Input:** `slug` từ URL (VD: `/products/nike-air-max-90`).
2.  **Process:** Gọi API `GET /api/products/{slug}`.
3.  **Output:**
    *   Found: Render UI với data sản phẩm.
    *   Not Found: Redirect sang trang 404 hoặc hiển thị "Product not found".

### 1.2. Variant Selection Logic
*   **Logic:** Khi user chọn một Option (VD: Color = Red), hệ thống phải lọc ra các SKU thỏa mãn.
*   **Validation:**
    *   Nếu SKU đó hết hàng (`stock == 0`) -> Disable nút "Add to Cart".
    *   Nếu SKU đó không tồn tại (VD: Red + Size 45 không sản xuất) -> Disable Option Size 45.

### 1.3. Add to Cart Logic
1.  **Input:** `sku_id`, `quantity`.
2.  **Validation:**
    *   `quantity > 0`.
    *   `quantity <= current_stock`.
3.  **Process:** Gọi API `POST /api/cart/items`.
4.  **Response:**
    *   Success: Show Toast "Added to cart", update Cart Badge number.
    *   Error (Out of Stock): Show Alert "Sản phẩm vừa hết hàng".

---

## 2. 💾 Data Models (Zod Schema)

### 2.1. Product Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | UUID |
| `slug` | string | URL friendly ID |
| `name` | string | Product Name |
| `price` | number | Base Price |
| `variants` | Array | List of SKUs |

### 2.2. Variant (SKU) Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `sku` | string | Unique SKU Code |
| `attributes` | Record | e.g. `{ color: "Red", size: "42" }` |
| `stock` | number | Inventory count |

---

## 3. 🔌 API Integration Strategy
> **Tham khảo:** `api/backend-specs.md`

*   **Fetch Product:** Server Component (`page.tsx`) gọi trực tiếp API.
*   **Add to Cart:** Client Component (`AddToCartButton.tsx`) gọi Server Action `addToCartAction`.
