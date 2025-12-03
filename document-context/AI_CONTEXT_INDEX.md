# 🧠 AI Context Loading Index & Workflow

File này đóng vai trò là **Master Guide** (Hướng dẫn chính) cho các AI Agent làm việc trong dự án **NEXUS E-commerce**.
Nó định nghĩa bản đồ tài liệu và **Quy trình 2 Bước** để sinh code.

## 📍 Documentation Map (Bản đồ tài liệu)

| Category | Path | Description |
| :--- | :--- | :--- |
| **1. Business Core** | `business/domain-overview.md` | **[MUST READ]** Mục tiêu dự án, vai trò user, thuật ngữ nghiệp vụ. |
| **2. Rules & Guidelines** | `guidelines/tech-standards.md` | **[MUST READ]** Tech stack, quy ước code, cấu trúc thư mục. |
| **3. API Specs** | `api/backend-specs.md` | **[MUST READ]** Backend contracts, endpoints, request/response formats. |
| **4. Epics & Stories** | `epics/` | **[MUST READ]** Phân rã yêu cầu (Requirements breakdown). Xem `epics/list.md` để biết implementation status. |
| **5. Templates** | `templates/` | Các mẫu chuẩn cho output của AI. |

---

## 🔄 AI Workflow: From Context to Code

Chúng ta tuân thủ nghiêm ngặt **Quy trình 2 Bước** để đảm bảo độ chính xác.

### 🔹 Phase 1: Planning ("How to do")
**Mục tiêu:** AI đọc context và sinh ra **Implementation Plan** chi tiết (Tài liệu "How to do").
**Input:** Business Context, Rules, Feature Spec cụ thể.
**Output:** Một file markdown dựa trên `templates/TASK_IMPLEMENTATION_TEMPLATE.md`.

**User Prompt to AI:**
> "Tôi cần làm task [Feature Name/ID].
> 1. Đọc `AI_CONTEXT_INDEX.md` để hiểu cấu trúc tài liệu.
> 2. Đọc Global Context (Business & Rules).
> 3. Đọc Feature Spec cụ thể tại `[Path to Feature File]`.
> 4. **GENERATE** tài liệu 'How to do' sử dụng `templates/TASK_IMPLEMENTATION_TEMPLATE.md`.
>    - Phân tích yêu cầu và map vào codebase.
>    - Điền chi tiết File Structure, Component Specs, và API Integration strategy.
>    - Lưu file vào `tasks/task-[ID]-implementation-plan.md`."

### 🔸 Phase 2: Execution (Code Generation)
**Mục tiêu:** AI sinh code thực tế dựa trên **Implementation Plan đã được Approve**.
**Input:** File `task-[ID]-implementation-plan.md` (đã được User duyệt).
**Output:** Source code files.

**User Prompt to AI:**
> "Implementation Plan tại `tasks/task-[ID]-implementation-plan.md` đã được **APPROVED**.
> 1. Đọc kỹ plan này.
> 2. **IMPLEMENT** các thay đổi được mô tả trong plan.
> 3. Tuân thủ nghiêm ngặt `guidelines/tech-standards.md`.
> 4. Verify code dựa trên Checklist trong plan."

---

## 📂 Folder Structure Convention

```text
document-context/
├── business/                     # Kiến thức nghiệp vụ
│   └── domain-overview.md        # (Includes Domain Dictionary)
├── guidelines/                   # Ràng buộc kỹ thuật & hướng dẫn
│   ├── tech-standards.md         # Coding conventions
│   └── frontend-guide.md         # Hướng dẫn implement FE
├── api/                          # Backend contracts
│   └── backend-specs.md
├── epics/                        # Phân rã yêu cầu
│   ├── list.md                   # Danh sách Epic (với implementation status)
│   └── stories/                  # User Stories (Cái "What")
│       ├── story-001-product-listing.md ✅ COMPLETED
│       ├── story-002-product-detail.md ✅ COMPLETED
│       ├── story-003-header-navigation.md ✅ COMPLETED
│       ├── story-004-homepage-sections.md ✅ COMPLETED
│       ├── story-005-cart-management.md ✅ COMPLETED
│       ├── story-006-smart-search.md ⏳ PENDING
│       ├── story-007-checkout-process.md ⏳ PENDING
│       ├── story-008-guest-checkout.md ⏳ PENDING
│       ├── story-009-about-page.md ✅ COMPLETED
│       ├── story-010-contact-page.md ✅ COMPLETED
│       └── features/             # Feature Specs (Cái "How")
│           ├── feature-001-product-listing-logic.md ✅
│           ├── feature-002-product-detail-logic.md ✅
│           ├── feature-003-header-logic.md ✅
│           ├── feature-004-homepage-sections-logic.md ✅
│           ├── feature-005-cart-management-logic.md ✅
│           ├── feature-006-smart-search-logic.md ⏳
│           ├── feature-007-checkout-process-logic.md ⏳
│           ├── feature-008-guest-checkout-logic.md ⏳
│           ├── feature-009-about-page-logic.md ✅
│           └── feature-010-contact-page-logic.md ✅
├── templates/                    # Các template chuẩn
│   ├── TASK_IMPLEMENTATION_TEMPLATE.md
│   └── FEATURE_SPEC_TEMPLATE.md
└── tasks/                        # [NEW] Nơi chứa các tài liệu "How to do" được sinh ra
    └── task-001-implementation-plan.md
```
