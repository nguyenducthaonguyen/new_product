# 🛠️ Task Implementation Document: [TASK_NAME]

**Status:** `Draft` | `Approved` | `Implemented`
**Assignee:** AI Agent
**Date:** YYYY-MM-DD

---

## 1. 🎯 Goal & Objective
*One sentence summary of what this task achieves.*
> Example: Implement the User Registration UI and integrate with the Registration API.

## 2. 📚 Context & Inputs (The "Knowledge Graph")
*The AI MUST read these files to understand the requirement.*

- **Feature Logic:** `epics/stories/features/feature-*-logic.md` (Business Rules, API Flow)
- **Feature UI:** `epics/stories/features/feature-*-ui.md` (Visual Design, States)
- **API Spec:** `api/backend-specs.md` (Endpoint, Schema)
- **Design Assets:** `[Link to Image/Figma]`
- **Standards:** `guidelines/frontend-guide.md` & `guidelines/tech-standards.md`

## 3. 🧠 Analysis & Strategy (The "Senior" Thought Process)

### 3.1. Architecture & State Strategy
*   **Server vs Client:**
    *   Page: Server Component (Fetch Data).
    *   Form: Client Component (Interactive).
*   **State Management:**
    *   URL: [e.g., ?step=2]
    *   Server: [e.g., Server Action revalidatePath]
    *   Local: [e.g., useForm]

### 3.2. Component Reusability
*   **Reuse:** `Button`, `Input`, `Card` (from `src/components/ui`).
*   **New:** `RegisterForm` (Composite).

### 3.3. Mocking Strategy (Crucial)
*   [ ] Backend API is ready.
*   [ ] Backend API is NOT ready -> Implement Mock in Server Action (using `setTimeout`).

## 4. 🏗️ Technical Implementation (The "Blueprint")

### 4.1. File Structure Changes
*List specific files to create or modify (Tree View).*

```bash
src/app/[locale]/(auth)/register/
├── page.tsx                # [Server] Main Page
└── register-form.tsx       # [Client] Form Logic & UI
src/actions/auth.ts         # [Server] Server Actions
src/entities/user.ts        # [Shared] Zod Schema
```

### 4.2. Component Specifications
*   **`RegisterForm`**:
    *   **Props**: None.
    *   **Logic**:
        1.  Init form with `useForm` and `UserSchema`.
        2.  On Submit -> Call `registerAction`.
        3.  On Success -> Show Toast -> Redirect.
        4.  On Error -> Map API errors to Form Fields.

### 4.3. API Integration Details
*   **Endpoint**: `POST /api/auth/register`
*   **Payload**: Map from Zod Schema.
*   **Error Handling**: Map `409` to `email` field, `500` to Toast.

## 5. 📝 Step-by-Step Execution Plan (Atomic Steps)
*The AI (Phase 2) will follow these steps sequentially.*

1.  **[Scaffold]**: Create file structure (Page, Component, Action, Entity).
2.  **[Entity]**: Implement Zod Schema in `src/entities/`.
3.  **[Action]**: Implement Server Action (Mock or Real) in `src/actions/`.
4.  **[UI]**: Build UI Components (Tailwind) in `src/components/`.
5.  **[Logic]**: Connect Form -> Action -> Handle Response.
6.  **[Verify]**: Run manual verification against Checklist.

## 6. ✅ Verification Checklist
- [ ] UI matches Design (pixel-perfect).
- [ ] Form validation works (client-side & server-side).
- [ ] API integration works (success & error cases).
- [ ] Code follows `tech-standards.md`.
