# 🧠 AI Context Loading Index & Workflow

File này đóng vai trò là **Master Guide** (Hướng dẫn chính) cho các AI Agent làm việc trong dự án **NEXUS E-commerce**.
Nó định nghĩa bản đồ tài liệu và **Quy trình 2 Bước** để sinh code.

## 📍 Documentation Map (Bản đồ tài liệu)

| Category | Path | Description |
| :--- | :--- | :--- |
| **1. Business Core** | `business/domain-overview.md` | **[MUST READ]** Mục tiêu dự án, vai trò user, thuật ngữ nghiệp vụ. |
| **2. Rules & Guidelines** | `guidelines/tech-standards.md` | **[MUST READ]** Tech stack, quy ước code, cấu trúc thư mục. |
| **3. API Specs** | `api/backend-specs.md` | Backend contracts, endpoints. |
| **4. Epics & Stories** | `epics/` | Phân rã yêu cầu (Requirements breakdown). |
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
│       ├── story-001-product-detail.md ✅ COMPLETED
│       ├── story-002-auth-login.md ✅ COMPLETED
│       ├── story-003-header.md ✅ COMPLETED
│       ├── story-004-cart-management.md ✅ COMPLETED
│       └── features/             # Feature Specs (Cái "How")
│           ├── feature-001-product-detail-logic.md  # Business Logic & Data
│           ├── feature-001-product-detail-ui.md     # UI/UX Specs
│           ├── feature-002-auth-login-logic.md     # Login Logic
│           ├── feature-002-auth-login-ui.md         # Login UI
│           ├── feature-003-header-logic.md          # Header Logic
│           └── feature-003-header-ui.md             # Header UI
├── templates/                    # Các template chuẩn
│   ├── TASK_IMPLEMENTATION_TEMPLATE.md
│   └── FEATURE_SPEC_TEMPLATE.md
└── tasks/                        # [NEW] Nơi chứa các tài liệu "How to do" được sinh ra
    └── task-001-implementation-plan.md
```
