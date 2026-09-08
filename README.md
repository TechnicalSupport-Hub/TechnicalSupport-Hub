# AutoTicket — Technical Support Hub

A modern, responsive Technical Support Hub and Ticket Management application built with **React**, **React Router**, and **Tailwind CSS**. The application provides an integrated user experience featuring a self-service knowledge base, a ticket submission pipeline, and an administrative control desk with real-time status updates and audit history.

---

## Table of Contents
1. [Overview & Tech Stack](#overview--tech-stack)
2. [Quick Start & Installation](#quick-start--installation)
3. [Hardcoded Mock Authentication](#hardcoded-mock-authentication)
4. [Routing & Application Flows](#routing--application-flows)
   - [User Flow](#user-flow)
   - [Admin Flow](#admin-flow)
5. [Admin Features & Functionality](#admin-features--functionality)
6. [Design System & Theme Specifications](#design-system--theme-specifications)
7. [Code Quality & Standards](#code-quality--standards)

---

## Overview & Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: `react-router-dom` (v7)
- **Styling**: Tailwind CSS (Strict `rem`-based utility classes, no inline styles, no hardcoded arbitrary pixel brackets)
- **Icons**: Lucide React
- **State Management**: Simple React Context (`AppContext`) with standard React hooks (`useState`, `useMemo`, `useContext`)

---

## Quick Start & Installation

### 1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at the URL shown in your terminal (typically `http://localhost:5173/`).

### 4. Run Linting & Production Build
```bash
# Check code quality and zero-unused-imports
npm run lint

# Build production bundle
npm run build
```

---

## Hardcoded Mock Authentication

The application uses an integrated mock authentication state managed by `AppContext`. No backend or external authentication service is required.

### How the Role Toggle Works

On the Landing Page (`/`), the Sign-In card includes an **Account Role** segmented control:

```
+-----------------------------------------------------------+
|                      Welcome back                         |
|         Sign in to manage your support tickets.           |
|                                                           |
|       [   User Portal   ]    [   Admin Portal   ]         |
+-----------------------------------------------------------+
```

1. **User Portal Toggle**:
   - Pre-fills email with `user@autoticket.com`.
   - On submission, authenticates the session with the `user` role and navigates to the **User Flow** (`/faq`).

2. **Admin Portal Toggle**:
   - Pre-fills email with `admin@autoticket.com`.
   - On submission, authenticates the session with the `admin` role and navigates to the **Admin Flow** (`/admin`).

3. **Smart Email Detection**:
   - Typing any email containing `admin` automatically routes to the Admin Desk upon clicking **Sign In**.
   - Any other email routes to the User Portal.

4. **Default Mock Credentials**:
   - **User**: `user@autoticket.com` / `password123`
   - **Admin**: `admin@autoticket.com` / `password123`

---

## Routing & Application Flows

| Route | Page / Component | Description |
| :--- | :--- | :--- |
| `/` | `Landing.jsx` | Landing page with Hero Section and Login/Signup tabs. |
| `/login` | `Landing.jsx` | Alternate route navigating to Landing Sign-In. |
| `/signup` | `Landing.jsx` | Alternate route navigating to Landing Sign-Up. |
| `/faq` | `FAQ.jsx` | User knowledge base with interactive accordion answers. |
| `/create-ticket` | `CreateTicket.jsx` | User ticket creation form with validation & image upload. |
| `/admin` | `AdminDashboard.jsx` | Admin workspace (Active Queue, History, Modal, Status). |
| `/dashboard` | `Dashboard.jsx` | Redirects to `/faq` for a seamless user portal experience. |
| `*` | `Navigate` | Catch-all wildcard redirecting to `/`. |

### User Flow
1. **Landing (`/`)**: Toggle to **User Portal** and click **Sign In as User**.
2. **Help Center & FAQ (`/faq`)**: Browse frequently asked questions with smooth expandable accordions.
3. **Raise Ticket (`/create-ticket`)**: Click the **Create Ticket** button at the bottom of the FAQ page to access the issue submission form:
   - Provide issue title and comprehensive description.
   - Drag-and-drop or browse to upload screenshot evidence (PNG/JPG up to 10MB) with instant live preview.
   - Click **Submit Ticket** to generate a unique ticket ID (`TKT-xxxx`) and add it to the active queue.
   - Cancel button safely returns to `/faq`.

### Admin Flow
1. **Landing (`/`)**: Toggle to **Admin Portal** and click **Sign In as Admin**.
2. **Admin Dashboard (`/admin`)**:
   - **Active Support Queue**: Minimal detail overview displaying only **Ticket ID**, **User ID**, **Issue Title** (prominent, readable font, no description clutter), and **Status Badge**.
   - **Interactive Status Dropdown**: Change ticket status directly between `Processing`, `Reject`, and `Resolved` with immediate UI feedback.
   - **Ticket History & Archive**: Table view showing strictly **Ticket ID**, **User ID**, **Issue Title**, **Status**, and **Action** (no descriptions in the table).
   - **Details Modal (Major Details)**: Click **View Details** or **View** on any card or table row to open the modal containing full details (User Name, Email, User ID, Created Date, Full Description, and Attachment Evidence with image preview & download).
   - **Navigation Actions**: Use **Switch to User Portal** to inspect the customer view, or **Logout** to return to the landing page.

---

## Admin Features & Functionality

1. **State-Driven Ticket Management**:
   - Tickets are stored in `AppContext` and shared between the user submission pipeline and the admin desk.
   - Any ticket created by a user via `/create-ticket` immediately appears in the admin queue.
2. **Interactive Status Dropdown**:
   - Located on each ticket card in the Active Queue.
   - Allows instant status changes: `Processing`, `Reject`, `Resolved`.
   - Changing a status to `Resolved` or `Reject` automatically transitions the ticket into the **Ticket History & Archive** tab.
3. **Ticket Detail Modal**:
   - Accessible via the **View Details** action.
   - Displays User Name, Email, User ID, Created Timestamp, Title, Detailed Description, and Attachment preview with direct download link.
   - Includes quick status update buttons and a clean backdrop-dismiss / close button.
4. **Responsive Layout**:
   - **Desktop (>= 1024px)**: Dedicated left-hand `AdminSidebar` with active/history ticket counter badges.
   - **Mobile (< 1024px)**: Responsive top navigation bar with a collapsible hamburger menu for the admin sidebar.

---

## Design System & Theme Specifications

The Admin pages strictly inherit and harmonize with the **Dark Black & Blue Gradient** design system established by the Landing and FAQ pages:

- **Hero & Section Banners**: Deep black container (`bg-gray-950`) with an ambient radial glow (`bg-[#0084ff]/20 blur-3xl`), crisp white typography, and blue badge accents (`bg-[#0084ff]/15 text-[#0084ff]`).
- **Cards & Surfaces**: Clean white cards (`bg-white border border-gray-200 shadow-sm`), rounded corners (`rounded-2xl`), and subtle background fills (`bg-gray-50`).
- **Brand Accent**: `#0084ff` (hover `#0074e0`, rings `focus:ring-[#0084ff]`).
- **Semantic Status Badges**:
  - **Processing**: `bg-blue-50 text-blue-700 border-blue-200`
  - **Resolved**: `bg-emerald-50 text-emerald-700 border-emerald-200`
  - **Rejected**: `bg-rose-50 text-rose-700 border-rose-200`
  - **Pending**: `bg-amber-50 text-amber-700 border-amber-200`

---

## Code Quality & Standards

- **Zero Inline Styles**: No `style={{...}}` anywhere in the application.
- **Strict `rem`-based Utility Classes**: All arbitrary pixel bracket classes (such as `text-[10px]`, `text-[11px]`, `min-w-[240px]`, `max-w-[140px]`, `p-[1px]`) have been refactored to standard Tailwind utilities (`text-xs`, `min-w-60`, `max-w-36`, `p-0.5`, `rounded-xl`).
- **Clean Codebase**: All unused React imports, dead template CSS files (`App.css`), and empty stub components have been removed.
- **Fast Refresh Compliant**: Context definitions and hooks adhere to Vite React Fast Refresh rules.
- **Zero ESLint Errors**: The project passes `npm run lint` with 0 errors and 0 warnings.
