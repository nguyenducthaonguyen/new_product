# 📄 Feature Specification: FE-NAV-001 - Header Component (Logic & UI)

**Parent Story:** [US-NAV-01: Header Navigation với Search và User Menu](../story-003-header-navigation.md)
**Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Header Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [NEXUS]  [Search Input...]  [Shop] [About] [Contact]  [🛒] [👤] │
└─────────────────────────────────────────────────────────────────┘
```

**Component Structure:**
```
HomeHeader
├── Logo (Link to /)
├── Search Form (flex-1, max-w-lg)
│   └── Search Input + Search Icon
├── Navigation Links (hidden md:flex)
│   ├── Shop
│   ├── About
│   └── Contact
└── Right Side Actions
    ├── Cart Icon (with badge)
    └── User Avatar (if logged in) OR Login Button (if not logged in)
```

**Responsive Layout:**
- **Desktop (≥ 768px):** Full layout với navigation links visible
- **Mobile (< 768px):** Navigation links hidden, chỉ hiển thị logo, search, cart, avatar/login

### 1.2. Logo Design

**Display:**
- Text: "NEXUS"
- Size: `text-2xl` (24px)
- Weight: `font-bold`
- Color: `text-gray-900`
- Link: Navigate to `/` (home page)
- Position: Left side, `flex-shrink-0`

### 1.3. Search Input Design

**Layout:**
- Position: Center-left, `flex-1 max-w-lg mx-4`
- Input: Full width với padding left for icon
- Icon: Search icon (Lucide) absolute left, `h-4 w-4`
- Placeholder: "Search products..."
- Submit: Form submit on Enter key

**States:**
- **Default:** Border, focus ring
- **Focus:** Ring highlight
- **Submit:** Redirect to `/search?q={keyword}`

### 1.4. Navigation Links Design

**Layout:**
- Display: Horizontal flex, `gap-6`
- Visibility: Hidden on mobile (`hidden md:flex`)
- Links: Shop, About, Contact
- Style: `text-sm font-medium text-gray-600 hover:text-gray-900`
- Transition: Color transition on hover

### 1.5. Cart Icon Design

**Layout:**
- Icon: ShoppingCart (Lucide), `h-5 w-5`
- Container: `w-10 h-10 rounded-full hover:bg-gray-100`
- Position: Relative for badge positioning
- Link: Navigate to `/cart`

**Badge:**
- Display: Only when `cartItemCount > 0`
- Position: Absolute `-top-1 -right-1`
- Size: `h-5 w-5`
- Style: `rounded-full bg-gray-900 text-white text-xs font-medium`
- Content: `cartItemCount` (max 99, show "99+" if > 99)

### 1.6. User Avatar Design

**Avatar (Authenticated):**
- Size: `h-10 w-10`
- Image: User's avatar image (if available)
- Fallback: Initials from username (first 2 characters, uppercase)
- Border: Rounded full
- Click: Opens dropdown menu

**Dropdown Menu:**
- Position: Align end (right side)
- Width: `w-56`
- Content:
  - User full name (if available) - `text-sm font-semibold`
  - User email (if available) - `text-sm text-gray-600`
  - Separator
  - "Logout" option với LogOut icon
  - "Logout All" option với LogOut icon

### 1.7. Login Button Design

**Button (Unauthenticated):**
- Variant: `outline`
- Size: `sm`
- Text: "Login"
- Link: Navigate to `/login`

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

```
Page Load
  ↓
HomeHeader Component Mount
  ↓
Check Zustand User Store (cache)
  ↓
If user in store AND has access_token → Use cached user
  ↓
If user NOT in store AND has access_token → fetchCurrentUser()
  ↓
GET /api/v1/auth/me (with Authorization header)
  ↓
Save user to Zustand store
  ↓
Display Avatar with user info
  ↓
Cart Badge: Read from cart-store (Zustand)
  ↓
Real-time updates when cart changes
```

### 2.2. User State Management

**Caching Strategy:**
1. Check Zustand store first (localStorage persistence)
2. If user exists in store AND access_token exists → Use cached user
3. If user NOT in store BUT access_token exists → Fetch from API
4. Save fetched user to Zustand store for future use
5. Clear user from store if access_token is missing

**State Flow:**
```
Initial State: user = null
  ↓
Check localStorage (Zustand persist)
  ↓
If user found → Use it
  ↓
If user NOT found → Check access_token
  ↓
If access_token exists → fetchCurrentUser()
  ↓
Save to Zustand store
  ↓
Display Avatar
```

### 2.3. Cart Badge Logic

**Data Source:**
- Zustand cart store (`cart-store.ts`)
- Read `cart?.total_items` from store
- Real-time updates when cart changes (store subscription)

**Display Rules:**
- Show badge only if `cartItemCount > 0`
- Badge content: `cartItemCount` (max 99, show "99+" if > 99)
- Badge updates automatically when cart store changes

### 2.4. Search Functionality

**Flow:**
1. User types in search input
2. User presses Enter or submits form
3. Validate: `searchQuery.trim()` must not be empty
4. Encode query: `encodeURIComponent(searchQuery.trim())`
5. Navigate: `router.push(/search?q={encodedQuery})`

**Note:** Search page (`/search`) chưa implement, chỉ redirect.

### 2.5. Navigation Links

**Links:**
- Shop → `/shop`
- About → `/about`
- Contact → `/contact`

**Behavior:**
- Standard Next.js Link navigation
- Hover effect: Color transition
- Active state: (Future enhancement)

### 2.6. Authentication State Display

**Authenticated:**
- Show UserAvatar component
- Avatar displays user's image or initials
- Click avatar → Show dropdown menu
- Dropdown shows: full_name, email, Logout, Logout All

**Unauthenticated:**
- Show Login button
- Click Login → Navigate to `/login`

**State Detection:**
- Check Zustand user store
- If `user` exists → Authenticated
- If `user` is null → Unauthenticated

### 2.7. Logout Flow

**UserAvatar Component:**
1. User clicks "Logout" or "Logout All"
2. Clear user from Zustand store (`clearUser()`)
3. Call `logout(allDevices)` server action
4. Server action clears cookies and redirects
5. `router.refresh()` to update page

**Error Handling:**
- If logout fails, ensure user is cleared from store
- Log error to console

### 2.8. Business Rules

1. **Header Visibility:**
   - Header hiển thị trên tất cả các trang (Home, Shop, About, Contact, Product Detail, Cart)
   - Header KHÔNG hiển thị trên Login page

2. **User State Caching:**
   - User state được cache trong Zustand store với localStorage persistence
   - Cache được check trước khi gọi API
   - Cache được clear khi logout hoặc access_token missing

3. **Cart Badge:**
   - Badge cập nhật real-time từ cart store
   - Badge chỉ hiển thị khi có items trong cart
   - Badge hiển thị tối đa "99+" nếu > 99 items

4. **Search:**
   - Search chỉ redirect, chưa implement search page
   - Search query được encode để tránh special characters

5. **Responsive:**
   - Navigation links ẩn trên mobile (< 768px)
   - Logo, search, cart, avatar/login luôn visible

### 2.9. Edge Cases

| Case | Behavior |
|------|----------|
| **User logged in but token expired** | Clear user from store, show Login button |
| **User in store but no access_token** | Clear user from store, show Login button |
| **Cart store empty/null** | Badge không hiển thị |
| **Cart item count > 99** | Badge hiển thị "99+" |
| **Search query empty** | Không redirect, không submit |
| **User has no avatar** | Show initials từ username |
| **User has no full_name** | Chỉ hiển thị email trong dropdown |
| **User has no email** | Chỉ hiển thị full_name trong dropdown |
| **Logout fails** | Clear user from store anyway, log error |

---

## 3. 🔌 API Requirements

### 3.1. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Request:**
- Headers:
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "avatar": "https://example.com/avatar.jpg",
    "role": "customer",
    "status": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**UserResponse Schema:**
```typescript
{
  id: number;
  username: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  role: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
```

**Error Responses:**
- **401:** Unauthorized → Clear user from store, show Login button
- **500:** Internal server error → Log error, show Login button

### 3.2. Logout

**Endpoint:** `POST /api/v1/auth/logout` (called from server action)

**Request:**
- Headers:
  - `Authorization: Bearer {access_token}` (optional)
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "all_devices": false // or true for "Logout All"
  }
  ```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Logout successful"
}
```

**Note:** Logout is handled by server action (`logout-action.ts`), which clears cookies and redirects.

---

## 4. 📝 Acceptance Criteria

### 4.1. Header Layout
- [x] **AC-1.1:** Header hiển thị trên cùng một hàng với logo, search, navigation, cart, avatar/login
- [x] **AC-1.2:** Logo "NEXUS" link về home page (`/`)
- [x] **AC-1.3:** Search input ở center-left với search icon
- [x] **AC-1.4:** Navigation links (Shop, About, Contact) hiển thị trên desktop, ẩn trên mobile
- [x] **AC-1.5:** Cart icon và avatar/login button ở góc phải

### 4.2. Search Functionality
- [x] **AC-2.1:** Search input có placeholder "Search products..."
- [x] **AC-2.2:** Submit form (Enter) redirect đến `/search?q={keyword}`
- [x] **AC-2.3:** Search query được encode để tránh special characters
- [x] **AC-2.4:** Empty search query không submit

### 4.3. Navigation Links
- [x] **AC-3.1:** Click "Shop" navigate đến `/shop`
- [x] **AC-3.2:** Click "About" navigate đến `/about`
- [x] **AC-3.3:** Click "Contact" navigate đến `/contact`
- [x] **AC-3.4:** Links có hover effect (color transition)

### 4.4. Cart Icon
- [x] **AC-4.1:** Cart icon hiển thị với ShoppingCart icon
- [x] **AC-4.2:** Badge hiển thị khi `cartItemCount > 0`
- [x] **AC-4.3:** Badge content: `cartItemCount` (max 99, show "99+" if > 99)
- [x] **AC-4.4:** Click cart icon navigate đến `/cart`
- [x] **AC-4.5:** Badge cập nhật real-time từ cart store

### 4.5. User Menu (Authenticated)
- [x] **AC-5.1:** Avatar hiển thị khi user đã đăng nhập
- [x] **AC-5.2:** Avatar hiển thị user's image hoặc initials
- [x] **AC-5.3:** Click avatar mở dropdown menu
- [x] **AC-5.4:** Dropdown hiển thị full_name (nếu có)
- [x] **AC-5.5:** Dropdown hiển thị email (nếu có)
- [x] **AC-5.6:** Dropdown có "Logout" option
- [x] **AC-5.7:** Dropdown có "Logout All" option

### 4.6. Login Button (Unauthenticated)
- [x] **AC-6.1:** Login button hiển thị khi user chưa đăng nhập
- [x] **AC-6.2:** Click Login navigate đến `/login`

### 4.7. User State Management
- [x] **AC-7.1:** Check Zustand store trước khi gọi API
- [x] **AC-7.2:** Fetch user từ API nếu không có trong store nhưng có access_token
- [x] **AC-7.3:** Save user vào Zustand store sau khi fetch
- [x] **AC-7.4:** Clear user từ store nếu access_token missing
- [x] **AC-7.5:** User state persist trong localStorage (Zustand persist)

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**HomeHeader Component:**
- **File:** `frontend/src/components/home/home-header.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    user?: UserResponse | null; // Optional, uses Zustand as primary source
  }
  ```
- **State:**
  - `mounted: boolean` - Component mounted state
  - `hasFetched: boolean` - Prevent multiple API calls
  - `searchQuery: string` - Search input value

- **Hooks:**
  - `useUserStore` - Get/set user from Zustand store
  - `useCartStore` - Get cart for badge count
  - `useRouter` - Navigation
  - `useEffect` - Fetch user on mount

- **Key Functions:**
  - `handleSearch(e)` - Handle search form submit
  - `fetchCurrentUser()` - Fetch user from API if needed

**UserAvatar Component:**
- **File:** `frontend/src/components/user/user-avatar.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:**
  ```typescript
  {
    user: UserResponse;
  }
  ```
- **Features:**
  - Avatar với image hoặc initials fallback
  - Dropdown menu với user info và logout options
  - Logout handling với store clearing

### 5.2. Client Utilities

**fetchCurrentUser Function:**
- **File:** `frontend/src/lib/client-auth.ts`
- **Type:** Client-side utility (`'use client'`)
- **Features:**
  - Check Zustand store first (cache)
  - Fetch from API if not in store
  - Save to Zustand store after fetch
  - Handle 401 errors (clear store)
  - Return user data or error

### 5.3. Stores

**User Store:**
- **File:** `frontend/src/stores/user-store.ts`
- **Type:** Zustand store với persistence
- **State:**
  ```typescript
  {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: UserResponse | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearUser: () => void;
  }
  ```
- **Persistence:** localStorage key `'user-storage'`

**Cart Store:**
- **File:** `frontend/src/stores/cart-store.ts`
- **Type:** Zustand store với persistence
- **Usage:** Read `cart?.total_items` for badge count

### 5.4. Server Actions

**logout Function:**
- **File:** `frontend/src/actions/logout-action.ts`
- **Type:** Server Action (`'use server'`)
- **Features:**
  - Call `POST /api/v1/auth/logout`
  - Clear authentication cookies
  - Redirect to home page

### 5.5. Pages Using Header

**Pages với HomeHeader:**
- `app/[locale]/page.tsx` (Home)
- `app/[locale]/shop/page.tsx` (Shop)
- `app/[locale]/about/page.tsx` (About)
- `app/[locale]/contact/page.tsx` (Contact)
- `app/[locale]/products/[slug]/page.tsx` (Product Detail)
- `app/[locale]/cart/page.tsx` (Cart)

**Pages KHÔNG có HomeHeader:**
- `app/[locale]/login/page.tsx` (Login)

### 5.6. Entities

**UserResponse Type:**
- **File:** `frontend/src/entities/user.ts`
- **Schema:** `UserResponseSchema` (Zod)
- **Fields:**
  - `id: number`
  - `username: string`
  - `email: string | null`
  - `full_name: string | null`
  - `phone: string | null`
  - `address: string | null`
  - `avatar: string | null`
  - `role: string`
  - `status: boolean`
  - `created_at: string`
  - `updated_at: string`

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Header hiển thị trên tất cả pages (trừ Login)
- [ ] Logo link về home page
- [ ] Search submit redirect đến `/search?q={keyword}`
- [ ] Navigation links navigate correctly
- [ ] Cart badge hiển thị correct count
- [ ] Cart badge updates real-time
- [ ] User avatar hiển thị khi logged in
- [ ] Login button hiển thị khi not logged in
- [ ] User dropdown menu opens và displays correctly
- [ ] Logout clears user và redirects

### 6.2. UI/UX Tests
- [ ] Header layout responsive (navigation links ẩn on mobile)
- [ ] Search input focus state works
- [ ] Cart icon hover effect works
- [ ] Avatar dropdown positioning correct
- [ ] Badge hiển thị "99+" khi > 99 items
- [ ] Avatar fallback to initials works
- [ ] Navigation links hover effect works

### 6.3. State Management Tests
- [ ] User state cached trong Zustand store
- [ ] User state persist trong localStorage
- [ ] User fetched from API when not in store
- [ ] User cleared when access_token missing
- [ ] Cart badge updates from cart store
- [ ] Multiple API calls prevented (hasFetched flag)

### 6.4. Edge Case Tests
- [ ] User logged in but token expired
- [ ] User in store but no access_token
- [ ] Cart store empty/null
- [ ] Cart item count > 99
- [ ] Search query empty
- [ ] User has no avatar (initials fallback)
- [ ] User has no full_name (only email)
- [ ] User has no email (only full_name)
- [ ] Logout fails (user still cleared)

### 6.5. Performance Tests
- [ ] Header render time < 100ms
- [ ] User fetch chỉ 1 lần per session
- [ ] No unnecessary re-renders
- [ ] Cart badge updates không cause re-render issues

---

## 7. 📚 Related Documentation

- **Story:** [US-NAV-01: Header Navigation với Search và User Menu](../story-003-header-navigation.md)
- **Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)
- **API Spec:** [Backend API Specifications](../../../api/backend-specs.md#auth)
- **Auth Feature:** [US-AUTH-01: Login với Username/Password](../story-002-auth-login.md) (if exists)
- **Cart Feature:** [US-CART-01: Quản lý giỏ hàng](../story-005-cart-management.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

