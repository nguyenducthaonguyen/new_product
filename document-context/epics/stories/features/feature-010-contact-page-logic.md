# 📄 Feature Specification: FE-STATIC-002 - Contact Page (Logic & UI)

**Parent Story:** [US-STATIC-02: Trang liên hệ](../story-010-contact-page.md)
**Epic:** [EP-05: Static Pages](../../list.md#ep-05-static-pages-trang-tĩnh)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Contact Page Layout (`/contact`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Banner Section (Full-width)             │
├─────────────────────────────────────────┤
│ Contact Page Content                    │
│ ┌─────────────────────────────────────┐ │
│ │ Contact Us                           │ │
│ │ Description text                    │ │
│ │                                     │ │
│ │ Contact Info Cards (Grid)           │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ │
│ │ │Card│ │Card│ │Card│ │Card│       │ │
│ │ └────┘ └────┘ └────┘ └────┘       │ │
│ │                                     │ │
│ │ Contact Form                        │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Name *                           │ │ │
│ │ │ Email *                          │ │ │
│ │ │ Subject *                        │ │ │
│ │ │ Message *                        │ │ │
│ │ │ [Send Message]                   │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

**Responsive Layout:**
- **Desktop (≥ 768px):** Contact info cards grid 2 columns
- **Mobile (< 768px):** Contact info cards stack (1 column)

### 1.2. Contact Information Cards

**Card Grid Layout:**
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- 4 cards: Email, Phone, Hours, Address

**Card Structure:**
```
┌─────────────────────┐
│ Title (Icon)        │
│ Description         │
│ Content             │
└─────────────────────┘
```

**Cards:**
1. **Email Card:**
   - Title: "Email"
   - Description: "Send us an email"
   - Content: "support@nexus.com"

2. **Phone Card:**
   - Title: "Phone"
   - Description: "Call us"
   - Content: "+1 (555) 123-4567"

3. **Hours Card:**
   - Title: "Hours"
   - Description: "Business hours"
   - Content: "Monday - Friday: 9AM - 6PM\nSaturday - Sunday: 10AM - 4PM"

4. **Address Card:**
   - Title: "Address"
   - Description: "Visit us"
   - Content: "123 Commerce Street, San Francisco, CA 94102"

### 1.3. Contact Form Design

**Form Layout:**
```
┌─────────────────────────────────────────┐
│ Send us a Message                       │
│ Description text                        │
├─────────────────────────────────────────┤
│ Name *                                  │
│ [Input]                                 │
│                                         │
│ Email *                                 │
│ [Input]                                 │
│                                         │
│ Subject *                               │
│ [Input]                                 │
│                                         │
│ Message *                               │
│ [Textarea, rows=6]                      │
│                                         │
│ [Send Message Button]                   │
└─────────────────────────────────────────┘
```

**Form States:**
- **Default:** All fields empty
- **Focused:** Field highlight
- **Error:** Red border, error message below field
- **Submitting:** Button disabled, "Sending..." text
- **Success:** Toast notification, form cleared

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

```
Page Load (/contact)
  ↓
Server Component (page.tsx)
  ↓
Render Contact Page Layout
  ↓
Static Content (Contact Info Cards)
  ↓
ContactForm Component (Client Component)
  ↓
User fills form
  ↓
User clicks "Send Message"
  ↓
Validate form (all fields required)
  ↓
Show loading state
  ↓
Simulate submission (current: client-side only)
  ↓
Show success toast
  ↓
Clear form
```

### 2.2. Component Hierarchy

```
Contact Page (Server Component)
  ├── HomeHeader (Client Component)
  ├── Banner (Static Component)
  ├── Contact Content
  │   ├── Heading "Contact Us"
  │   ├── Description
  │   ├── Contact Info Cards (Grid)
  │   │   ├── Email Card
  │   │   ├── Phone Card
  │   │   ├── Hours Card
  │   │   └── Address Card
  │   └── ContactForm (Client Component)
  │       ├── Name Input
  │       ├── Email Input
  │       ├── Subject Input
  │       ├── Message Textarea
  │       └── Submit Button
  └── Footer (Static Component)
```

### 2.3. Business Rules

1. **Static Content:**
   - Contact info cards hardcoded
   - No API calls for contact info

2. **Contact Form:**
   - All fields required
   - Email format validation
   - Client-side validation
   - Current: Simulated submission (no backend API)
   - Future: Backend API integration

3. **Form Submission:**
   - Current: Show success toast, clear form
   - Future: Send to backend API, store in database, send email notification

4. **Accessibility:**
   - Page accessible to all users (no authentication required)
   - Form accessible với proper labels
   - Error messages accessible

5. **Layout:**
   - Header và Footer consistent với other pages
   - Banner section full-width
   - Content section với container và padding
   - Responsive design

### 2.4. Edge Cases

| Case | Behavior |
|------|----------|
| **Empty form submission** | Show validation errors |
| **Invalid email format** | Show validation error |
| **Form submission error** | Show error toast (future) |
| **Network error** | Show error toast, allow retry (future) |

---

## 3. 🔌 API Requirements

### 3.1. Current Implementation

**No API Required:**
- Contact form currently simulated (client-side only)
- No backend API call

### 3.2. Future Implementation

**Submit Contact Form (Future):**
**Endpoint:** `POST /api/v1/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about product",
  "message": "I have a question about..."
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "message": "Thank you for your message! We will get back to you soon."
}
```

**Note:** Backend API chưa implement. Current implementation chỉ shows success toast.

---

## 4. 📝 Acceptance Criteria

### 4.1. Contact Information Cards
- [x] **AC-1.1:** 4 contact info cards hiển thị trong grid
- [x] **AC-1.2:** Grid responsive: 2 columns (Desktop), 1 column (Mobile)
- [x] **AC-1.3:** Email card hiển thị với title, description, content
- [x] **AC-1.4:** Phone card hiển thị với title, description, content
- [x] **AC-1.5:** Hours card hiển thị với title, description, content
- [x] **AC-1.6:** Address card hiển thị với title, description, content

### 4.2. Contact Form
- [x] **AC-2.1:** Form hiển thị với heading "Send us a Message"
- [x] **AC-2.2:** Form có description text
- [x] **AC-2.3:** Name field (required, text input)
- [x] **AC-2.4:** Email field (required, email input)
- [x] **AC-2.5:** Subject field (required, text input)
- [x] **AC-2.6:** Message field (required, textarea, rows=6)
- [x] **AC-2.7:** "Send Message" button
- [x] **AC-2.8:** All fields marked as required

### 4.3. Form Submission
- [x] **AC-3.1:** Form validation (all fields required)
- [x] **AC-3.2:** Email format validation
- [x] **AC-3.3:** Loading state hiển thị during submission
- [x] **AC-3.4:** Success toast hiển thị "Thank you for your message! We will get back to you soon."
- [x] **AC-3.5:** Form cleared sau khi submit thành công
- [ ] **AC-3.6:** Backend API integration (future)

### 4.4. Layout Structure
- [x] **AC-4.1:** Layout hiển thị theo thứ tự: Header → Banner → Heading → Contact Info Cards → Contact Form → Footer
- [x] **AC-4.2:** Banner section full-width
- [x] **AC-4.3:** Content section với container và padding
- [x] **AC-4.4:** Page responsive

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**ContactForm Component:**
- **File:** `frontend/src/components/contact/contact-form.tsx`
- **Type:** Client Component (`'use client'`)
- **State:**
  ```typescript
  {
    name: string;
    email: string;
    subject: string;
    message: string;
    isSubmitting: boolean;
  }
  ```
- **Features:**
  - Form với React state management
  - Client-side validation
  - Toast notifications (sonner)
  - Form clearing after submission

**Key Functions:**
- `handleSubmit(e)` - Handle form submission
- `handleChange(e)` - Handle input changes

### 5.2. Pages

**Contact Page:**
- **File:** `frontend/src/app/[locale]/contact/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <Banner />
      <div className="container mx-auto px-4 py-12">
        <h1>Contact Us</h1>
        <p>Description text</p>
        {/* Contact Info Cards Grid */}
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
  ```

### 5.3. Contact Info Cards

**Card Structure:**
- Component: Shadcn Card
- Layout: Centered content
- Icons: (Future: Add icons for each card type)

**Cards Data:**
```typescript
const contactInfo = [
  {
    title: "Email",
    description: "Send us an email",
    content: "support@nexus.com"
  },
  {
    title: "Phone",
    description: "Call us",
    content: "+1 (555) 123-4567"
  },
  {
    title: "Hours",
    description: "Business hours",
    content: "Monday - Friday: 9AM - 6PM\nSaturday - Sunday: 10AM - 4PM"
  },
  {
    title: "Address",
    description: "Visit us",
    content: "123 Commerce Street, San Francisco, CA 94102"
  }
];
```

### 5.4. UI Components

**Shadcn UI Components:**
- `Card` - Contact info cards
- `CardContent` - Card content area
- `Input` - Form input fields
- `Textarea` - Message textarea
- `Button` - Submit button
- `Label` - Form labels
- `toast` (sonner) - Success/error notifications

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [x] Page loads correctly
- [x] Contact info cards hiển thị correctly
- [x] Contact form hiển thị correctly
- [x] Form validation works
- [x] Form submission shows success toast
- [x] Form clears after submission
- [ ] Backend API integration (future)

### 6.2. UI/UX Tests
- [x] Layout responsive
- [x] Contact info cards grid responsive
- [x] Form layout correct
- [x] Form validation errors hiển thị
- [x] Loading state works
- [x] Toast notifications work

### 6.3. Validation Tests
- [x] Required fields validation
- [x] Email format validation
- [x] Form prevents submit if invalid
- [x] Error messages hiển thị correctly

### 6.4. Content Tests
- [x] All contact info cards present
- [x] All form fields present
- [x] Content readable và correct

---

## 7. 📚 Related Documentation

- **Story:** [US-STATIC-02: Trang liên hệ](../story-010-contact-page.md)
- **Epic:** [EP-05: Static Pages](../../list.md#ep-05-static-pages-trang-tĩnh)
- **About Page:** [FE-STATIC-001: About Page](./feature-009-about-page-logic.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

---

## 8. 🚧 Future Enhancements

### Phase 1: Backend API Integration (Priority: Medium)
1. Create `POST /api/v1/contact` endpoint
2. Store contact messages in database
3. Send email notification to admin
4. Update ContactForm to call API

### Phase 2: Contact Message Management (Priority: Low)
1. Admin dashboard to view messages
2. Mark messages as read/replied
3. Reply to messages from dashboard

