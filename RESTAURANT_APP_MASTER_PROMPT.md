# 🍽️ Master Prompt: Premium QR-Driven Restaurant Ordering Web App

---

## 📌 Project Overview

Build a **full-stack, mobile-first restaurant ordering web application** using **Next.js (App Router)**. The app serves two distinct audiences:

1. **Customers** —Can visit the website to know about the restaurant and can scan a QR code at their table, browse the menu, and place orders directly from their phone.
2. **Admins/Staff** — manage tables, generate QR codes, view and fulfill incoming orders in real time from a dashboard.

The product must look and feel **premium** — think fine dining meets modern tech. It should also be **fully generic and rebrandable**, making it usable as a pitch/demo product for any restaurant, café, or fast food business.

---

## 🎯 Core Goals

- Deliver a **production-grade, aesthetic web app** that impresses both restaurant owners and their customers.
- Mobile experience should feel like a **native app** (bottom nav, swipe gestures, safe area spacing, app-like transitions).
- Desktop experience should be **clean and professional**, suitable for admin use.
- The codebase and design should be **easily rebrandable** — swap logo, colors, font, and restaurant name with minimal effort.
- Serve as a **portfolio/demo piece** to pitch to restaurant clients across Cameroon (and beyond).

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + custom CSS variables for theming |
| UI Components | shadcn/ui (or custom components) |
| Database | PostgreSQL (Prisma Postgres)
| DBNAME | restaurants
| Auth (Admin) | NextAuth.js (credentials provider) |
| Real-time | Pusher |
| QR Codes | `qrcode` npm package |
| Image Hosting | Next.js local `/public` for demo |
| Deployment | Vercel |

---

## 🗂️ Application Structure

### Two Distinct Surfaces

#### 1. Customer-Facing App (`/menu/[tableId]`)
Accessible only via QR code scan. Mobile-first. No login required.

#### 2. Admin Dashboard (`/admin/*`)
Password-protected. Accessible on desktop and mobile. Full management interface.
#### 3. Customer 
Can visit the restaurants website to get to know more about this restaurant see reviews from others, see their menus, can contact them etc...

---

## 👤 Customer Flow (Frontend)

### Entry Point
- Customer scans QR code at table → lands on `/menu/[tableId]`
- Table ID is embedded in the QR and stored in session/context throughout the order

### Pages & Screens

#### `/menu/[tableId]` — Menu Home
- Hero section: restaurant logo, name, tagline
- Category tabs (e.g., Starters, Mains, Drinks, Desserts) — sticky horizontal scroll
- Menu item cards with:
  - High-quality food image
  - Dish name
  - Short description
  - Price (FCFA or configurable currency)
  - "Add to Cart" button with quantity control
- Floating cart button (bottom right) showing item count + total
- Smooth category filter animation

#### `/menu/[tableId]/cart` — Cart / Order Review
- List of selected items with quantity adjusters
- Order subtotal
- Special instructions text field (optional)
- "Place Order" CTA button
- Confirmation modal before submitting

#### `/menu/[tableId]/confirmation` — Order Confirmation
- Animated success state
- Summary of items ordered
- Message: "Your order has been sent to the kitchen. A staff member will serve Table [X] shortly."
- Option to view menu again or add more items

---

## 🔧 Admin Dashboard Flow (Backend)

### Authentication
- `/admin/login` — Simple email + password login
- Session-based auth via NextAuth

### Pages & Screens

#### `/admin` — Dashboard Home
- Live order feed (real-time updates)
- Summary cards: Active Orders, Tables Occupied, Orders Completed Today, Revenue Today
- Quick access to Tables and Menu management

#### `/admin/orders` — Order Management
- Live list of incoming orders sorted by time
- Each order card shows:
  - Table number
  - Items ordered
  - Time placed
  - Status: `Pending → In Progress → Served`
- Staff can update status with one tap/click
- Sound notification on new order (optional)
- Filter by status, table, or time

#### `/admin/tables` — Table Management
- Visual grid of all restaurant tables
- Each table shows: table number, capacity, current status (Free / Occupied / Awaiting Order)
- Add / Edit / Delete tables
- **Generate QR Code** button per table:
  - Generates a unique QR code embedding the URL `/menu/[tableId]`
  - Preview the QR in modal
  - Download as PNG (for printing and laminating)
  - Option to bulk-generate all QR codes

#### `/admin/menu` — Menu Management
- List of all menu items grouped by category
- Add / Edit / Delete items
- Fields per item: name, description, price, category, image, availability toggle
- Add / Edit / Delete categories
- Toggle item availability in real-time (e.g., "sold out today")

#### `/admin/settings` — Restaurant Settings
- Restaurant name
- Logo upload
- Currency symbol
- Primary brand color (hex)
- Contact info
- Opening hours

---

## 📱 Mobile-First Design Requirements

### Customer Side
- Design breakpoint priority: **mobile → tablet → desktop**
- Bottom navigation bar (Home / Menu / Cart / Orders)
- Touch-friendly tap targets (min 44px)
- Swipeable category tabs
- iOS/Android safe area insets respected
- No horizontal scroll on mobile
- App-like page transitions (slide in/out)
- Full-screen food images
- Floating action button for cart

### Admin Side
- Mobile dashboard must be fully functional for waitstaff on phones
- Bottom navigation for mobile admin (Orders / Tables / Menu / Settings)
- Swipe-to-update order status on mobile
- Responsive grid that collapses to stacked cards on small screens
- Tap to expand order details

---

## 🎨 Design System & Aesthetic

### Overall Vibe
**Luxury Editorial** — dark, moody base with warm gold/cream accents. Think high-end restaurant menu meets a premium lifestyle app. Clean, not cold. Premium, not pretentious.

### Color Tokens (Default — Rebrandable)
```css
--color-bg:           #0E0C0A;   /* Deep warm black */
--color-surface:      #1A1714;   /* Card/panel surface */
--color-border:       #2E2A26;   /* Subtle border */
--color-primary:      #C9A96E;   /* Warm gold — main accent */
--color-primary-muted:#8A6F42;   /* Muted gold */
--color-text:         #F5F0E8;   /* Warm white */
--color-text-muted:   #9E9589;   /* Secondary text */
--color-success:      #4CAF7D;
--color-warning:      #E0A050;
--color-danger:       #D9534F;
```

### Typography
- **Display / Headings**: `Cormorant Garamond` — elegant serif, luxury editorial
- **Body / UI**: `DM Sans` — clean, modern, readable
- **Accents / Labels**: `Montserrat` — structured, premium feel

### Visual Details
- Grain texture overlay on hero and background sections
- Subtle glassmorphism on cards (dark glass on dark bg)
- Smooth micro-animations on buttons and transitions
- Soft drop shadows using the primary gold color
- Food photography should always have rounded corners and a slight warm tint overlay
- Dividers use a thin gold line

### Component Rules
- Buttons: rounded, bold label, no default browser styles, gold fill or outline variants
- Cards: dark surface, subtle border, rounded-xl, hover lift effect
- Category pills: horizontal scroll, active state with gold underline or fill
- Icons: Lucide React (consistent, clean)
- Loading states: skeleton loaders (not spinners)

---

## 🔁 Real-Time Order Flow (Technical)

```
Customer places order
        ↓
POST /api/orders — creates order in DB with tableId + items
        ↓
Pusher/Supabase emits event: "new_order"
        ↓
Admin dashboard receives event → order appears live
        ↓
Admin updates status (Pending → In Progress → Served)
        ↓
PATCH /api/orders/[id] — updates DB
        ↓
(Optional) Customer sees status update on their screen
```

---

## 🗃️ Database Schema (Prisma)

```prisma
model Restaurant {
  id          String   @id @default(cuid())
  name        String
  logo        String?
  currency    String   @default("FCFA")
  primaryColor String  @default("#C9A96E")
  tables      Table[]
  menuItems   MenuItem[]
  categories  Category[]
  orders      Order[]
}

model Table {
  id           String  @id @default(cuid())
  number       Int
  capacity     Int
  qrCodeUrl    String?
  status       TableStatus @default(FREE)
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  orders       Order[]
}

model Category {
  id           String     @id @default(cuid())
  name         String
  order        Int        @default(0)
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  items        MenuItem[]
}

model MenuItem {
  id           String   @id @default(cuid())
  name         String
  description  String?
  price        Float
  image        String?
  available    Boolean  @default(true)
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  orderItems   OrderItem[]
}

model Order {
  id           String      @id @default(cuid())
  tableId      String
  table        Table       @relation(fields: [tableId], references: [id])
  restaurantId String
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  status       OrderStatus @default(PENDING)
  note         String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  items        OrderItem[]
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int
  price      Float    // snapshot price at time of order
}

enum TableStatus { FREE OCCUPIED }
enum OrderStatus { PENDING IN_PROGRESS SERVED CANCELLED }
```

---

## 📁 Folder Structure (Next.js App Router)

```
/app
  /menu
    /[tableId]
      page.tsx              ← Menu home (customer)
      /cart
        page.tsx            ← Cart review
      /confirmation
        page.tsx            ← Order success
  /admin
    /login
      page.tsx
    layout.tsx              ← Admin layout + auth guard
    page.tsx                ← Dashboard home
    /orders
      page.tsx
    /tables
      page.tsx
    /menu
      page.tsx
    /settings
      page.tsx

/api
  /orders
    route.ts                ← GET, POST
    /[id]
      route.ts              ← PATCH (status update)
  /tables
    route.ts
    /[id]
      /qrcode
        route.ts            ← Generate QR
  /menu
    route.ts
  /categories
    route.ts
  /auth
    /[...nextauth]
      route.ts

/components
  /customer
    MenuItemCard.tsx
    CategoryTabs.tsx
    CartDrawer.tsx
    OrderConfirmation.tsx
  /admin
    OrderCard.tsx
    TableGrid.tsx
    MenuItemForm.tsx
    QRCodeModal.tsx
    StatsCard.tsx
  /shared
    Button.tsx
    Badge.tsx
    Skeleton.tsx
    Modal.tsx
    BottomNav.tsx

/lib
  prisma.ts
  auth.ts
  pusher.ts
  qrcode.ts

/styles
  globals.css               ← CSS variables, base styles

/prisma
  schema.prisma
```

---

## 🚀 Development Phases

### Phase 1 — Foundation
- [ ] Next.js project setup with Tailwind, Prisma, shadcn/ui
- [ ] Database schema + migrations
- [ ] Design system (CSS variables, fonts, base components)
- [ ] Admin auth (NextAuth credentials)

### Phase 2 — Customer Side
- [ ] Menu page with category filter
- [ ] Cart logic (React context or Zustand)
- [ ] Order placement API + confirmation screen
- [ ] Mobile layout + app-like feel

### Phase 3 — Admin Dashboard
- [ ] Orders live feed (real-time with Pusher/Supabase)
- [ ] Table management + QR generation + download
- [ ] Menu & category CRUD
- [ ] Restaurant settings

### Phase 4 — Polish
- [ ] Animations and transitions
- [ ] Empty states, loading skeletons, error boundaries
- [ ] PWA manifest (so it can be "installed" on phone)
- [ ] SEO + Open Graph meta for the menu pages
- [ ] Demo seed data (sample restaurant, 20+ menu items)

### Phase 5 — Pitch Ready
- [ ] Deploy to Vercel
- [ ] Custom demo domain (e.g., `demo.tableflow.app`)
- [ ] One-click rebrand via environment variables
- [ ] PDF pitch deck or live demo script for client meetings

---

## ⚙️ Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

CLOUDINARY_URL=           # optional, for image uploads
NEXT_PUBLIC_APP_URL=      # base URL for QR code generation
```

---

## 🔑 Key UX Rules

1. **Zero friction for customers** — no login, no app download, no account. Scan → order. Done.
2. **One-tap updates for staff** — order status should change with a single tap on mobile.
3. **Instant feedback** — every action (add to cart, place order, update status) has an immediate visual response.
4. **Offline resilience** — cart state persists in localStorage so a brief signal loss doesn't lose the order.
5. **Accessible** — color contrast meets WCAG AA, touch targets minimum 44px, readable at all font sizes.

---

## 🏷️ Rebrandability Checklist

To adapt this app for a new restaurant client, only the following should need changing:

- [ ] Restaurant name (env or DB settings)
- [ ] Logo image
- [ ] Primary brand color (single CSS variable)
- [ ] Font pairing (2 Google Fonts)
- [ ] Currency symbol
- [ ] Menu items (via admin dashboard)
- [ ] Hero/banner image

Everything else — layout, logic, QR flow, order management — works out of the box.

---
