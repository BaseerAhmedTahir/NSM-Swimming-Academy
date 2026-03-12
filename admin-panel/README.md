# NSM Swimming Academy - Admin Panel Prototype

This is the frontend prototype for the NSM Swimming Academy Admin Panel. It is built with Next.js 14, React, Tailwind CSS, and shadcn/ui. 

## Features
- Dashboard with key metrics and daily schedule summary
- Interactive Schedule Grid for marking attendance
- Complete Student Management directory and detail views
- Financial tracking, custom invoice generation, and payment processing
- Broadcast Notification Center with live mobile preview
- Settings and pricing package configuration

*Note: This is a frontend-only prototype powered by local mock data. It does not connect to a real backend database. Data changes will not persist after a page refresh.*

## Prerequisites
- Node.js (v18.x or later)
- npm (Node Package Manager)

## How to Run Locally

1. **Install dependencies**
   Ensure you are in the `admin-panel` directory, then run:
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **View the Application**
   Open your browser and navigate to `http://localhost:3000`. 
   You will automatically be routed to the `/dashboard` page.

## Project Structure
- `src/app/(admin)` - Contains the main dashboard, pages, and layouts.
- `src/components/` - Reusable UI components (shadcn ui) and layout wrappers.
- `src/lib/` - Utilities and the central `mockData.ts` file holding the prototype's hardcoded states.

## Tech Stack
- Next.js 14 (App Router)
- React
- Tailwind CSS (v4)
- shadcn/ui (Radix Primitives)
- lucide-react (Iconography)
