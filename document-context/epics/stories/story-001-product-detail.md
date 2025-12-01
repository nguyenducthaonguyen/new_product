# User Story: Xem chi tiết sản phẩm
**Story ID:** US-PROD-02
**Epic:** EP-01 Product Discovery

---

## 0. Child Features (Implementation Specs)
*Các tính năng chi tiết thuộc Story này:*

| Feature ID | Feature Name | Spec File |
| :--- | :--- | :--- |
| **FE-PROD-001** | Product Detail Page (Logic & UI) | `features/feature-001-product-detail-logic.md` |

---

**Là** một khách hàng (Customer/Guest),
**Tôi muốn** xem thông tin chi tiết của một sản phẩm (giá, ảnh, mô tả, biến thể),
**Để** quyết định có mua sản phẩm đó hay không.

---

## 1. Acceptance Criteria (Tiêu chí Chấp nhận)

### 1.1. Happy Path
1.  **Given** người dùng click vào một sản phẩm từ trang Home hoặc Search,
2.  **When** trang chi tiết tải xong,
3.  **Then** hệ thống hiển thị đầy đủ:
    *   Tên sản phẩm, Giá tiền.
    *   Gallery ảnh (Slide ảnh).
    *   Bộ chọn biến thể (Màu sắc, Kích thước).
    *   Nút "Add to Cart" (Enable nếu còn hàng).
    *   Mô tả chi tiết và thông số kỹ thuật.

### 1.2. Variant Selection (Chọn biến thể)
1.  **Given** người dùng đang xem sản phẩm có nhiều màu/size,
2.  **When** người dùng chọn "Màu Đỏ",
3.  **Then** hệ thống cập nhật lại danh sách Size khả dụng cho màu Đỏ.
4.  **And** cập nhật lại ảnh sản phẩm tương ứng với màu Đỏ.

### 1.3. Out of Stock (Hết hàng)
1.  **Given** một biến thể (SKU) đã hết hàng (Stock = 0),
2.  **When** người dùng chọn biến thể đó,
3.  **Then** nút "Add to Cart" bị disable và hiển thị nhãn "Out of Stock".

---

## 2. Business Rules
-   Giá sản phẩm hiển thị theo đơn vị tiền tệ của User (mặc định USD).
-   Guest User vẫn xem được full thông tin và thêm vào giỏ hàng.
-   Review chỉ hiển thị nếu đã được duyệt (Approved).
