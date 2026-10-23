# ParkSense AI — Agent Guide

## Project Overview

This repository contains the **frontend** of **ParkSense AI**, an AI-Based Smart Parking Management System. The application is a Next.js (React) web client named `ParkSense AI`. It provides a dark-themed dashboard where users can log in, view real-time parking slot availability, book parking slots, register vehicles, and review their booking history.

The frontend does not store parking data itself. It proxies all business logic, authentication, slot state, vehicles, and bookings to a separate **Laravel backend API** over HTTP. The AI/computer vision service (Python + OpenCV + FastAPI) that updates slot occupancy is expected to live outside this repository and communicate with the Laravel backend.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 13.5.1 (App Router) |
| Language | TypeScript 5.2.2 |
| Styling | Tailwind CSS 3.3.3 |
| UI Components | shadcn/ui (installed under `components/ui`) |
| Icons | lucide-react |
| HTTP Client | axios |
| Forms / Validation | react-hook-form, zod, @hookform/resolvers |
| State | React hooks (no global state library) |
| Charts / Analytics | recharts (installed, currently unused) |
| Auth Token Storage | HTTP-only cookie named `auth_token` |
| Deployment | Netlify via `@netlify/plugin-nextjs` |

## Project Structure

```text
/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Next.js Route Handlers (proxy to Laravel)
│   ├── dashboard/          # Real-time parking dashboard
│   ├── history/            # Past bookings with CSV export
│   ├── login/              # Login page
│   ├── my-bookings/        # Active and completed bookings
│   ├── register/           # Registration page
│   ├── vehicles/           # Vehicle management
│   ├── globals.css         # Tailwind directives + ParkSense custom styles
│   ├── layout.tsx          # Root layout (Inter font, dark background)
│   └── page.tsx            # Landing page; redirects to /login
├── backend-reference/      # Empty directory; reserved for backend reference
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── BookingModal.tsx    # Modal to book a selected parking slot
│   ├── FilterBar.tsx       # Status filter + search input
│   ├── Footer.tsx          # Global footer
│   ├── Navbar.tsx          # Global responsive navigation
│   ├── ParkingGrid.tsx     # Zone-grouped grid of parking spot cards
│   ├── ParkingSpotCard.tsx # Individual spot card with status + book action
│   ├── RecentActivity.tsx  # Recent bookings table on dashboard
│   └── StatsBar.tsx        # Free / booked / active booking counters
├── hooks/
│   └── use-toast.ts        # shadcn/ui toast hook (currently unused)
├── lib/
│   ├── laravel.ts          # Laravel API request helper + auth cookie reader
│   ├── mappers.ts          # Transform Laravel API shapes to frontend types
│   ├── parkingData.ts      # Constants such as HOURLY_RATE
│   ├── types.ts            # Shared TypeScript types
│   └── utils.ts            # `cn()` Tailwind class helper
├── components.json         # shadcn/ui configuration
├── netlify.toml            # Netlify build settings
├── next.config.js          # Next.js config (ESLint ignored during build)
├── package.json            # Scripts and dependencies
├── postcss.config.js       # PostCSS config for Tailwind
├── tailwind.config.ts      # Tailwind theme with ParkSense color palette
└── tsconfig.json           # TypeScript configuration
```

## Environment Variables

The frontend expects the following environment variable at runtime:

| Variable | Purpose | Default |
| --- | --- | --- |
| `LARAVEL_API_URL` | Base URL of the Laravel backend API | `http://127.0.0.1:8000` |

Create a `.env.local` file in the project root to override it:

```bash
LARAVEL_API_URL=http://your-laravel-backend.test
```

No other secrets are referenced by the current code.

## Build and Development Commands

Install dependencies once:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check without emitting files:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Start the production server (after build):

```bash
npm start
```

The `next.config.js` disables ESLint during the production build (`ignoreDuringBuilds: true`) and uses unoptimized images for static export compatibility.

## Runtime Architecture

### Frontend as an API Proxy

The Next.js app contains server-side Route Handlers under `app/api/*`. These handlers forward requests to the Laravel backend using `lib/laravel.ts`. They also manage the `auth_token` HTTP-only cookie.

### Authentication Flow

1. The user submits credentials to `POST /api/login` (Next.js route).
2. The route forwards them to Laravel `POST /api/signin`.
3. On success, Laravel returns a Bearer token.
4. The Next.js route stores the token in an HTTP-only cookie named `auth_token`.
5. Subsequent authenticated requests read the cookie and attach it as `Authorization: Bearer <token>`.
6. `POST /api/logout` clears the cookie even if Laravel is unreachable.

### Route-to-Backend Mapping

| Frontend Route Handler | Laravel Endpoint | Purpose |
| --- | --- | --- |
| `POST /api/login` | `POST /api/signin` | Authenticate and set cookie |
| `POST /api/register` | `POST /api/signup` | Create account and set cookie |
| `POST /api/logout` | `POST /api/logout` | Clear session cookie |
| `GET /api/me` | `GET /api/user` | Get current user profile |
| `GET /api/parking-slots` | `GET /api/parking-slots` | List all parking slots |
| `GET /api/bookings` | `GET /api/bookings` | List current user's bookings |
| `POST /api/booking/:slotId` | `POST /api/booking/:slotId` | Create a booking |
| `GET /api/vehicles` | `GET /api/vehicles` | List user's vehicles |
| `POST /api/vehicles` | `POST /api/vehicle` | Create a vehicle |
| *(client direct)* | `DELETE /api/vehicle/:id` | Delete a vehicle (called directly from `VehiclesPage`) |

## Application Pages

| Path | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Redirects to `/login` |
| `/login` | `app/login/page.tsx` | User login |
| `/register` | `app/register/page.tsx` | Account registration with password strength meter |
| `/dashboard` | `app/dashboard/page.tsx` | Main dashboard: stats, filter, grid, recent activity |
| `/vehicles` | `app/vehicles/page.tsx` | Add/remove vehicles |
| `/my-bookings` | `app/my-bookings/page.tsx` | View active/completed bookings |
| `/history` | `app/history/page.tsx` | Filtered history with CSV export |

## Code Style Guidelines

- Use TypeScript for all new code. Strict mode is enabled.
- Prefer functional components with hooks.
- Use the `cn()` utility from `lib/utils.ts` for conditional Tailwind classes.
- Use the ParkSense design tokens in `tailwind.config.ts` under `colors.ps` (for example `bg-ps-bg`, `text-ps-primary`, `text-ps-available`).
- Keep components in `components/`. Reusable UI primitives from shadcn/ui live in `components/ui/`.
- Use path aliases such as `@/components`, `@/lib`, and `@/hooks` instead of relative paths.
- All pages that fetch data use `'use client'` and axios.
- API route handlers use `NextResponse` and live under `app/api/*`.

## Key Domain Types

Defined in `lib/types.ts`:

- `ParkingSpot` — UI-facing slot (`id`, `slotId`, `zone`, `status`, `floor`).
- `Booking` — UI-facing reservation with cost, duration, and status.
- `Vehicle` — UI-facing vehicle (`id`, `name`, `number`).
- `ApiSlot`, `ApiBooking`, `ApiVehicle` — raw Laravel API shapes.

Mapping from API shapes to UI shapes is done in `lib/mappers.ts`. The hourly rate used for cost estimation is `HOURLY_RATE` in `lib/parkingData.ts` (currently `$2.50`).

## Testing

There are currently **no automated tests** in this repository. The project relies on manual testing and the `typecheck` script for compile-time verification.

If you add tests, match the project's default toolchain (no testing framework is installed). A common choice for Next.js projects is:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

## Deployment

The project is configured for **Netlify**:

- `netlify.toml` runs `npx next build` and publishes `.next`.
- `@netlify/plugin-nextjs` is listed as a dependency.

To deploy, push the repository to a Git provider connected to Netlify and set the `LARAVEL_API_URL` environment variable in the Netlify dashboard.

## Security Considerations

- Authentication tokens are stored in HTTP-only cookies (`httpOnly: true`, `sameSite: 'lax'`) and are not accessible to client-side JavaScript.
- All Laravel requests that require authentication attach the token via the `Authorization: Bearer` header.
- The application trusts the Laravel backend for password storage, validation, and session management.
- There is no Content Security Policy or CSRF token handling currently implemented.
- Environment variables are not bundled into the client except where explicitly used in server-side code.

## Backend / AI Dependencies

This frontend cannot function end-to-end without:

1. A running Laravel backend at `LARAVEL_API_URL` exposing the endpoints listed above.
2. (Optionally) a Python/FastAPI/OpenCV service that updates slot occupancy in the Laravel backend.

The `backend-reference/` directory is empty in the current checkout and is not wired into the build.

## Team / Context

This is a team project for an academic course. The repository currently contains only the Next.js frontend implementation. Refer to `readme.md` for the original project proposal and team information.
