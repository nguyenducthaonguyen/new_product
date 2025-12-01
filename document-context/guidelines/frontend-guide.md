# HOW-TO-DO Template for Frontend Implementation Task (Next.js 15 + React 19)

## Context and Preparation

Trước khi bắt đầu, luôn đọc kỹ các tài liệu sau:
- **Business Understanding**: Nắm rõ nghiệp vụ liên quan
- **Epic Document**: Đọc Epic liên quan
- **Feature Logic**: Đọc `epics/stories/features/feature-*-logic.md` (Business Rules, API Flow)
- **Feature UI**: Đọc `epics/stories/features/feature-*-ui.md` (Visual Design, States)
- **User Story Detail**: Đọc user story chi tiết
- **Screen Flow**: Đọc tài liệu screen flow tổng thể
- **API Integration**: Đọc `api/backend-specs.md` (Endpoint, Schema)
- **Design System**: Tham khảo `src/styles/DESIGN_SYSTEM.md`
- **Project Guidelines**: Đọc `guidelines/tech-standards.md`

## Overview

[Đưa ra phần tóm tắt tổng quan về phương pháp thiết kế. Giải thích cách thiết kế này đáp ứng các yêu cầu và phù hợp với kiến trúc tổng thể của hệ thống.
**QUAN TRỌNG:** Phải giải thích rõ chiến lược **Server vs Client Component**:
- Component nào là Server Component (Fetch data)?
- Component nào là Client Component (Interactive)?
- State được quản lý ở đâu (URL, Server, hay Local)?]

## Screen Flow (nếu cần)
- Nếu cần chi tiết hóa flow cho screen/component này, hãy bổ sung vào tài liệu screen flow tổng thể (KHÔNG tạo file flow riêng lẻ cho từng component nhỏ).
- Nếu có nhiều flow con, đặt tên rõ ràng trong cùng một file screen flow của story/feature.

## File Structure and Changes (**PRIMARY FOCUS**)

- **BẮT BUỘC:** Phải có mục "Complete File Tree Structure" – liệt kê rõ toàn bộ cây thư mục/file sẽ tạo mới, cập nhật, xóa, hoặc xác minh (không chỉ liệt kê tên file rời rạc). Reviewer phải preview được toàn bộ tác động của task qua cây thư mục này.

```bash
hck-healthcheckup-user-web/
├── src/app/[locale]/your-feature/              # [NEW] App Router pages
│   ├── page.tsx                                # [NEW] Main page component
│   ├── loading.tsx                             # [NEW] Loading UI (nếu cần)
├── src/components/your-feature/                # [NEW] Feature components
│   ├── your-component.tsx                      # [NEW] Main component
│   ├── your-form.tsx                           # [NEW] Form component
│   └── your-list.tsx                           # [NEW] List component
├── src/actions/your-feature-action.ts          # [NEW] Server actions
├── src/entities/your-feature.ts                # [NEW] Domain models và Zod schemas
├── src/hooks/use-your-shared-hook.ts           # [NEW/UPDATED] Shared hooks
├── src/stores/your-feature-store.ts            # [NEW/UPDATED] State management (nếu cần)
├── public/locales/en/your-feature.json         # [NEW/UPDATED] i18n strings
├── public/locales/ja/your-feature.json         # [NEW/UPDATED] i18n strings
├── public/assets/images/                       # [NEW] Figma assets (nếu có)
│   └── hero-image.png                          # [NEW] Feature images
├── docs/components/your-component.mdx          # [NEW] Component documentation
└── ...                                         # [NEW/UPDATED] Các file khác nếu cần
```

## Components and Interfaces

### Component 1: [Component Name]

**Purpose**: [Chức năng của component này]

**Responsibilities**:
- [Nhiệm vụ 1]
- [Nhiệm vụ 2]
- [Nhiệm vụ 3]

**Interfaces**:
- **Input**: [Props, SearchParams]
- **Output**: [Events, Server Action Calls]
- **Dependencies**: [Hooks, Utils, External Libs]

**State Strategy**:
- [Component này có dùng `use client` không? Tại sao?]
- [State được lưu ở đâu (URL/Local/Server)?]

**Implementation Notes**:
- [Chi tiết triển khai chính 1]
- [Chi tiết triển khai chính 2]

### Component 2: [Component Name]

**Purpose**: [Chức năng của component này]

**Responsibilities**:
- [Nhiệm vụ 1]
- [Nhiệm vụ 2]

**Interfaces**:
- **Input**: [Những gì component này nhận vào]
- **Output**: [Những gì component này tạo ra hoặc trả về]
- **Dependencies**: [Những gì component này phụ thuộc vào]

**Implementation Notes**:
- [Chi tiết triển khai chính 1]
- [Chi tiết triển khai chính 2]

### Component 3: [Component Name]

**Purpose**: [Chức năng của component này]

**Responsibilities**:
- [Nhiệm vụ 1]
- [Nhiệm vụ 2]

**Interfaces**:
- **Input**: [Những gì component này nhận vào]
- **Output**: [Những gì component này tạo ra hoặc trả về]
- **Dependencies**: [Những gì component này phụ thuộc vào]

**Implementation Notes**:
- [Chi tiết triển khai chính 1]
- [Chi tiết triển khai chính 2]

## Data Models

### Entity 1: [Entity Name]

```typescript
interface EntityName extends BaseEntity {
  property1: string;
  property2: number;
  property3: boolean;
}
```

**Validation Rules**:
- [Validation rule 1]
- [Validation rule 2]

**Relationships**:
- [Mối quan hệ với các entity khác]

### Entity 2: [Entity Name]

```typescript
interface EntityName extends BaseEntity {
  property1: string;
  property2: number;
  property3: boolean;
}
```

**Validation Rules**:
- [Validation rule 1]
- [Validation rule 2]

**Relationships**:
- [Mối quan hệ với các entity khác]

## Implementation Details
- **Mocking Strategy:** Nếu API chưa sẵn sàng, hãy dùng `setTimeout` và trả về Mock Data trong Server Action.
- **Step-by-step procedures:**
    1. Define Zod Schema.
    2. Implement Server Action (Mock/Real).
    3. Build UI Components.
    4. Integrate & Verify.
- **Quality checkpoints:**
    - [ ] Pixel Perfect với Design.
    - [ ] Validation hoạt động đúng.
    - [ ] Loading/Error states được xử lý.
