# AutoTicket — Technical Support Hub

A modern, full-featured Technical Support Hub and Ticket Management application built with **React 19**, **Supabase (PostgreSQL & Auth)**, **React Router (v7)**, and **Tailwind CSS**.

The application provides an integrated experience featuring customer self-service FAQs, an issue submission pipeline, user profiles, real-time ticket state notifications, an admin operations desk, automated duplicate issue clustering across unique users, and an administrative FAQ publishing engine.

---

## Table of Contents
1. [Tech Stack & Architecture](#tech-stack--architecture)
2. [Quick Start & Setup](#quick-start--setup)
3. [Supabase Database & Authentication Configuration](#supabase-database--authentication-configuration)
4. [Key Features](#key-features)
   - [1. User Flow & Self-Service Portal](#1-user-flow--self-service-portal)
   - [2. User Profile Management](#2-user-profile-management)
   - [3. Ticket State Change Notifications](#3-ticket-state-change-notifications)
   - [4. Admin Support Desk](#4-admin-support-desk)
   - [5. Issue Trends & Unique User Clustering](#5-issue-trends--unique-user-clustering)
   - [6. Admin FAQ Publishing Engine](#6-admin-faq-publishing-engine)
5. [Routing Reference](#routing-reference)
6. [Code Quality & Design System](#code-quality--design-system)

---

## Tech Stack & Architecture

- **Frontend**: React 19, Vite 8
- **Database & Auth**: Supabase (`@supabase/supabase-js`) with transparent offline/mock fallback
- **Routing**: `react-router-dom` (v7)
- **Styling**: Tailwind CSS (strict `rem`-based utility classes, no inline styles, no arbitrary pixel brackets)
- **Icons**: Lucide React
- **State Layer**: React Context (`AppContext`) with optimistic local updates and remote Supabase PostgreSQL syncing

---

## Quick Start & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Supabase)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and public Anon Key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Note**: The application has an embedded fallback layer. If `.env` keys are not yet configured, the app runs smoothly in offline mode with sample tickets, clustering, and state management.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Lint and Production Build
```bash
npm run lint
npm run build
```

---

## Supabase Database & Authentication Configuration

To run with your live Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Open the provided schema file: [`supabase/schema.sql`](supabase/schema.sql).
4. Copy its contents and paste into the SQL Editor, then click **Run**.
   - This creates the `profiles`, `tickets`, `faqs`, and `notifications` tables.
   - It sets up Row Level Security (RLS) policies and enables Realtime publication.
5. In your project settings, copy your **Project URL** and **anon public** API key into your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
6. Restart the dev server (`npm run dev`). The application is now connected to live Supabase Postgres!

---

## Key Features

### 1. User Flow & Self-Service Portal
- **Landing Page (`/`)**: Easy role toggle to sign in as **User** (`user@autoticket.com`) or **Admin** (`admin@autoticket.com`).
- **Help Center (`/faq`)**: Browse interactive accordion answers. Includes dynamically added articles published by admins in real time.
- **Raise Ticket Form (`/create-ticket`)**: Customers report problems with issue title, detailed description, and image attachment drag-and-drop. Newly created tickets are stored directly in the database.

### 2. User Profile Management
- Accessible at `/profile` or via the user avatar in the Header.
- Users can update their **Full Name**, **Department/Team**, and **Phone Number**.
- Updates are persisted to the database and reflected across the app.

### 3. Ticket State Change Notifications
- Whenever an Admin updates a ticket's status (`Pending`, `Processing`, `Reject`, `Resolved`), a notification is created for that ticket's user.
- **Header Notification Bell**: Displays an animated unread badge.
- Clicking the bell opens a popover displaying recent ticket status updates with a **"Mark all read"** action.

### 4. Admin Support Desk
- **Active Queue**: High-level overview displaying only essential metadata (**Ticket ID**, **User ID**, **Issue Title**, **Status Badge**, and **Actions**).
- **Status Dropdown**: Change ticket status directly from the card.
- **Ticket History & Archive**: Searchable audit log of resolved and rejected tickets.
- **Major Detail Modal**: Clicking **View Details** opens the full modal with untruncated description, customer details, and evidence attachments.

### 5. Issue Trends & Unique User Clustering
- Located in the Admin Desk under **Issue Trends**.
- Automatically analyzes tickets across the database using keyword and symptom extraction.
- Computes:
  - **Number of same tickets** reported.
  - **Number of distinct unique users affected**.
  - **Top FAQ Candidate** badge for high-frequency bottlenecks.
- Includes a one-click **"Add to Knowledge Base"** action that pre-fills the FAQ publisher with the recurring issue and suggested resolution.

### 6. Admin FAQ Publishing Engine
- Located in the Admin Desk under **FAQ Manager**.
- Admins can draft and publish new FAQ articles directly into the database.
- Published articles immediately appear on the public `/faq` page for all users.
- Includes delete and category management capabilities.

---

## Routing Reference

| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | `Landing.jsx` | Landing page with Hero Section and Sign In / Sign Up tabs. |
| `/faq` | `FAQ.jsx` | Customer Help Center with dynamic Supabase FAQs. |
| `/create-ticket` | `CreateTicket.jsx` | Ticket submission form with validation and upload. |
| `/profile` | `Profile.jsx` | User profile, department, and contact information. |
| `/admin` | `AdminDashboard.jsx` | Admin Desk (Queue, History, Issue Trends, FAQ Manager). |
| `/dashboard` | `Dashboard.jsx` | Redirects to `/faq`. |
| `*` | `Navigate` | Wildcard route redirecting to `/`. |

---

## Code Quality & Design System

- **Zero Inline Styles**: All styling is driven by Tailwind CSS utilities.
- **Zero Arbitrary Pixel Bracket Classes**: Converted to standard `rem`-based Tailwind sizing (`text-xs`, `text-sm`, `min-w-60`, `max-w-36`, `p-0.5`).
- **Dark Black & Blue Gradient Theme**: Ambient glowing hero banners (`bg-gray-950` with `#0084ff/20` blur glow), crisp white cards (`bg-white border border-gray-200`), and curated status badge palettes.
- **Vite Fast Refresh Compliant**: Context definitions and hooks split across clean module boundaries.
- **Zero ESLint Errors**: Verified with `npm run lint` and `npm run build`.
