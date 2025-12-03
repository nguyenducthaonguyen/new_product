# 📄 Feature Specification: FE-HOME-001 - Homepage Sections (Logic & UI)

**Parent Story:** [US-HOME-01: Homepage Sections (Banner, Features, Testimonials)](../story-004-homepage-sections.md)
**Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)

---

## 1. 🖼️ Visual Design (UI/UX)

### 1.1. Layout Structure

**Homepage Layout (`/`):**
```
┌─────────────────────────────────────────┐
│ Header (HomeHeader)                     │
├─────────────────────────────────────────┤
│ Banner Section (Full-width)             │
│ ┌─────────────────────────────────────┐ │
│ │ Welcome to NEXUS                    │ │
│ │ Description text                    │ │
│ │ [Shop Now] [Learn More]            │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Features Section                        │
│ ┌─────────────────────────────────────┐ │
│ │ Why Choose NEXUS?                  │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ │
│ │ │Card│ │Card│ │Card│ │Card│       │ │
│ │ └────┘ └────┘ └────┘ └────┘       │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Featured Products Section               │
│ ┌─────────────────────────────────────┐ │
│ │ Featured Products                   │ │
│ │ [Product Grid]                      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Testimonials Section (Full-width bg)    │
│ ┌─────────────────────────────────────┐ │
│ │ What Our Customers Say              │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ │
│ │ │Card│ │Card│ │Card│ │Card│       │ │
│ │ └────┘ └────┘ └────┘ └────┘       │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### 1.2. Banner Section Design

**Layout:**
- Full-width section với gradient background
- Container: `container mx-auto px-4`
- Content: Centered, max-width `max-w-3xl mx-auto text-center`
- Padding: `py-16 md:py-24` (responsive)

**Background:**
- Gradient: `bg-gradient-to-r from-gray-900 to-gray-800`
- Text color: White (`text-white`)

**Content:**
- Heading: "Welcome to NEXUS"
  - Size: `text-4xl md:text-5xl`
  - Weight: `font-bold`
  - Margin: `mb-4`
- Description: "Discover amazing products at unbeatable prices"
  - Size: `text-lg md:text-xl`
  - Color: `text-gray-300`
  - Margin: `mb-8`

**CTA Buttons:**
- Layout: `flex flex-col sm:flex-row gap-4 justify-center`
- "Shop Now" button:
  - Style: `bg-white text-gray-900`
  - Hover: `hover:bg-gray-100`
  - Link: `/shop`
- "Learn More" button:
  - Style: `border-2 border-white text-white`
  - Hover: `hover:bg-white hover:text-gray-900`
  - Link: `/about`

### 1.3. Features Section Design

**Layout:**
- Section: `w-full py-16`
- Container: `container mx-auto px-4`
- Heading area: Centered text, `mb-12`

**Heading:**
- Title: "Why Choose NEXUS?"
  - Size: `text-3xl md:text-4xl`
  - Weight: `font-bold`
  - Margin: `mb-4`
- Subtitle: "We're committed to providing you with the best shopping experience"
  - Size: `text-lg`
  - Color: `text-gray-600`

**Feature Cards Grid:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Responsive:
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 4 columns

**Feature Card:**
- Component: Shadcn Card
- Layout: Centered text
- Hover: `hover:shadow-lg transition-shadow`
- Structure:
  - Icon: Centered, `h-8 w-8`, color `text-blue-600`
  - Title: `text-xl`, CardTitle component
  - Description: `text-base`, CardDescription component

**Features:**
1. **Free Shipping** (Truck icon)
   - Description: "Free shipping on orders over $50. Fast and reliable delivery to your doorstep."

2. **Secure Payment** (Shield icon)
   - Description: "Your payment information is safe and secure with our encrypted checkout system."

3. **24/7 Support** (Headphones icon)
   - Description: "Our customer support team is available around the clock to help you."

4. **Quality Guarantee** (Award icon)
   - Description: "We guarantee the quality of all our products. Not satisfied? Return it!"

### 1.4. Testimonials Section Design

**Layout:**
- Section: `w-full bg-gray-50 py-16`
- Background: Light gray (`bg-gray-50`)
- Container: `container mx-auto px-4`
- Heading area: Centered text, `mb-12`

**Heading:**
- Title: "What Our Customers Say"
  - Size: `text-3xl md:text-4xl`
  - Weight: `font-bold`
  - Margin: `mb-4`
- Subtitle: "Don't just take our word for it - hear from our satisfied customers"
  - Size: `text-lg`
  - Color: `text-gray-600`

**Testimonial Cards Grid:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Responsive:
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 4 columns

**Testimonial Card:**
- Component: Shadcn Card
- Height: `h-full` (equal height cards)
- Structure:
  - Rating: 5 stars (Star icons, `fill-yellow-400 text-yellow-400`)
  - Quote: Italic text, `text-gray-700`, `mb-4`
  - Author: Border top, `pt-4`
    - Name: `font-semibold text-gray-900`
    - Role: `text-sm text-gray-500`

**Testimonials:**
1. **Sarah Johnson** - Verified Customer
   - Rating: 5 stars
   - Quote: "Amazing shopping experience! The products are high quality and shipping was super fast. Will definitely shop here again."

2. **Michael Chen** - Verified Customer
   - Rating: 5 stars
   - Quote: "Great prices and excellent customer service. The website is easy to navigate and checkout was smooth. Highly recommended!"

3. **Emily Rodriguez** - Verified Customer
   - Rating: 5 stars
   - Quote: "I love shopping at NEXUS! The product selection is fantastic and the quality exceeds my expectations. Best online store!"

4. **David Kim** - Verified Customer
   - Rating: 5 stars
   - Quote: "Fast delivery, great packaging, and top-notch products. The return process was also hassle-free. 10/10 would recommend!"

---

## 2. 🧠 Business Logic & Rules

### 2.1. Data Flow

```
Page Load (/)
  ↓
Server Component (page.tsx)
  ↓
Render Homepage Layout
  ↓
Banner Component (Static)
  ↓
Features Component (Static)
  ↓
Fetch Products (getProducts)
  ↓
ProductList Component
  ↓
Testimonials Component (Static)
  ↓
Footer Component
```

### 2.2. Component Hierarchy

```
Homepage (Server Component)
  ├── HomeHeader (Client Component)
  ├── Banner (Static Component)
  ├── Features (Static Component)
  ├── Featured Products Section
  │   └── ProductList (Client Component)
  ├── Testimonials (Static Component)
  └── Footer (Static Component)
```

### 2.3. Business Rules

1. **Section Order:**
   - Header (top)
   - Banner (full-width)
   - Features (container)
   - Featured Products (container)
   - Testimonials (full-width background)
   - Footer (bottom)

2. **Banner Section:**
   - Full-width với gradient background
   - Centered content
   - CTA buttons link to `/shop` và `/about`
   - Responsive padding (16px mobile, 24px desktop)

3. **Features Section:**
   - 4 feature cards (hardcoded data)
   - Responsive grid (1/2/4 columns)
   - Icons từ Lucide React
   - Cards có hover effect

4. **Testimonials Section:**
   - 4 testimonial cards (hardcoded data)
   - Background light gray
   - Responsive grid (1/2/4 columns)
   - All testimonials have 5-star rating

5. **Responsive Design:**
   - All sections responsive
   - Grid layouts adapt to screen size
   - Text sizes responsive (md: breakpoints)

6. **Static Content:**
   - Banner, Features, Testimonials là static components
   - No API calls needed
   - Content hardcoded trong components

### 2.4. Edge Cases

| Case | Behavior |
|------|----------|
| **No edge cases** | All sections are static, no dynamic data |
| **Responsive breakpoints** | Grid layouts adapt correctly |
| **Long text in testimonials** | Text wraps naturally, cards maintain height |

---

## 3. 🔌 API Requirements

### 3.1. No API Required

**Note:** Homepage Sections (Banner, Features, Testimonials) are static components with hardcoded content. No API calls are required.

**Related API (for Featured Products):**
- `GET /api/v1/products?offset=0&limit=20` - Fetch featured products
- See [Feature-001: Product Listing](./feature-001-product-listing-logic.md) for details

---

## 4. 📝 Acceptance Criteria

### 4.1. Banner Section
- [x] **AC-1.1:** Banner hiển thị với gradient background (gray-900 to gray-800)
- [x] **AC-1.2:** Heading "Welcome to NEXUS" hiển thị với correct styling
- [x] **AC-1.3:** Description text hiển thị below heading
- [x] **AC-1.4:** "Shop Now" button link đến `/shop`
- [x] **AC-1.5:** "Learn More" button link đến `/about`
- [x] **AC-1.6:** Buttons responsive (stack on mobile, row on desktop)
- [x] **AC-1.7:** Banner full-width với centered content

### 4.2. Features Section
- [x] **AC-2.1:** Heading "Why Choose NEXUS?" hiển thị centered
- [x] **AC-2.2:** Subtitle text hiển thị below heading
- [x] **AC-2.3:** 4 feature cards hiển thị trong grid
- [x] **AC-2.4:** Grid responsive: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- [x] **AC-2.5:** Each card có icon, title, và description
- [x] **AC-2.6:** Cards có hover effect (shadow-lg)
- [x] **AC-2.7:** Icons hiển thị với correct colors (blue-600)

### 4.3. Testimonials Section
- [x] **AC-3.1:** Heading "What Our Customers Say" hiển thị centered
- [x] **AC-3.2:** Subtitle text hiển thị below heading
- [x] **AC-3.3:** 4 testimonial cards hiển thị trong grid
- [x] **AC-3.4:** Grid responsive: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- [x] **AC-3.5:** Each card có 5-star rating
- [x] **AC-3.6:** Each card có quote text (italic)
- [x] **AC-3.7:** Each card có author name và role
- [x] **AC-3.8:** Section có light gray background
- [x] **AC-3.9:** Cards maintain equal height (`h-full`)

### 4.4. Layout Structure
- [x] **AC-4.1:** Sections hiển thị theo thứ tự: Header → Banner → Features → Featured Products → Testimonials → Footer
- [x] **AC-4.2:** Banner và Testimonials có full-width backgrounds
- [x] **AC-4.3:** Features và Featured Products có container với padding
- [x] **AC-4.4:** All sections responsive

---

## 5. 🛠️ Implementation Details

### 5.1. Components

**Banner Component:**
- **File:** `frontend/src/components/layout/banner.tsx`
- **Type:** Static Component (Server Component compatible)
- **Props:** None
- **Features:**
  - Full-width section với gradient background
  - Centered content với heading, description, CTA buttons
  - Responsive padding và text sizes

**Features Component:**
- **File:** `frontend/src/components/home/features.tsx`
- **Type:** Static Component (Server Component compatible)
- **Props:** None
- **Features:**
  - Grid layout với 4 feature cards
  - Icons từ Lucide React (Truck, Shield, Headphones, Award)
  - Responsive grid (1/2/4 columns)
  - Hover effects on cards

**Testimonials Component:**
- **File:** `frontend/src/components/home/testimonials.tsx`
- **Type:** Static Component (Server Component compatible)
- **Props:** None
- **Features:**
  - Grid layout với 4 testimonial cards
  - Star ratings (5 stars each)
  - Author names và roles
  - Light gray background
  - Responsive grid (1/2/4 columns)

### 5.2. Pages

**Homepage:**
- **File:** `frontend/src/app/[locale]/page.tsx`
- **Type:** Server Component
- **Implementation:**
  ```typescript
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <Banner />
      <Features />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1>Featured Products</h1>
        <ProductList products={result.data || []} />
      </div>
      <Testimonials />
      <Footer />
    </div>
  );
  ```

### 5.3. Icons

**Lucide React Icons:**
- `Truck` - Free Shipping icon
- `Shield` - Secure Payment icon
- `Headphones` - 24/7 Support icon
- `Award` - Quality Guarantee icon
- `Star` - Testimonial rating stars

### 5.4. UI Components

**Shadcn UI Components:**
- `Card` - Feature và Testimonial cards
- `CardHeader` - Card header với title
- `CardTitle` - Card title styling
- `CardContent` - Card content area
- `CardDescription` - Card description text

---

## 6. ✅ Testing Checklist

### 6.1. Functional Tests
- [ ] Banner section hiển thị với correct content
- [ ] Banner CTA buttons link correctly
- [ ] Features section hiển thị 4 cards
- [ ] Testimonials section hiển thị 4 cards
- [ ] All sections hiển thị trong correct order
- [ ] Links navigate correctly

### 6.2. UI/UX Tests
- [ ] Banner gradient background hiển thị correctly
- [ ] Features grid responsive (1/2/4 columns)
- [ ] Testimonials grid responsive (1/2/4 columns)
- [ ] Feature cards hover effect works
- [ ] Testimonial cards equal height
- [ ] Icons hiển thị với correct colors
- [ ] Star ratings hiển thị correctly (5 stars)
- [ ] Text responsive sizes work

### 6.3. Responsive Tests
- [ ] Mobile layout (< 768px): 1 column grids
- [ ] Tablet layout (768px - 1024px): 2 column grids
- [ ] Desktop layout (≥ 1024px): 4 column grids
- [ ] Banner buttons stack on mobile, row on desktop
- [ ] Text sizes responsive (md: breakpoints)

### 6.4. Content Tests
- [ ] All feature titles và descriptions hiển thị
- [ ] All testimonial quotes, names, roles hiển thị
- [ ] All icons hiển thị correctly
- [ ] All links work correctly

### 6.5. Performance Tests
- [ ] Page load time < 2s
- [ ] No unnecessary re-renders
- [ ] Static components render efficiently

---

## 7. 📚 Related Documentation

- **Story:** [US-HOME-01: Homepage Sections (Banner, Features, Testimonials)](../story-004-homepage-sections.md)
- **Epic:** [EP-01: Product Discovery](../../list.md#ep-01-product-discovery-khám-phá-sản-phẩm)
- **Product Listing:** [FE-PROD-001: Product Listing](./feature-001-product-listing-logic.md)
- **Component Guide:** [Frontend Component Guidelines](../../../guidelines/frontend-guide.md)

