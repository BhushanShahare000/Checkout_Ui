# Ecoyaan Checkout MVP

A modern, responsive, and performant multi-step checkout flow built with Next.js, GraphQL, and Prisma.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) (Server Components & SSR)
- **API**: [Apollo Server](https://www.apollographql.com/docs/apollo-server/) with Next.js API Routes (via `@as-integrations/next`)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite (local) / PostgreSQL (production ready)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- **DB**: Neon Database Used

## Architecture Choices

1. **Next.js App Router**: Utilizes React Server Components for efficient data fetching and minimal client-side JavaScript.
2. **GraphQL API**: Provides a strongly typed schema and flexible data fetching. The mock backend is integrated directly into Next.js API routes.
3. **Multi-step Flow**:
   - **Cart**: Server-side rendered using Apollo for instant data availability.
   - **Shipping**: Client-side form with robust validation for address details.
   - **Payment**: Summary view for final confirmation and simulated secure payment.
   - **Success**: Final order confirmation state with generated order details.
4. **Context API**: Efficiently manages shared state (cart, shipping address) across the entire checkout layout without the overhead of heavier libraries like Redux.
5. **Modular UI**: Reusable components (`Card`, `InputField`, `CheckoutLayout`) ensure consistency and maintainability.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and seed data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## Requirements Compliance

- [x] **SSR Demonstration**: `CartPage` uses Server Components and Apollo to fetch data on the server.
- [x] **Modular Architecture**: Clean separation of concerns between API, components, and pages.
- [x] **Form Validation**: Robust client-side validation for the shipping address.
- [x] **Responsive Design**: Fully optimized for mobile and desktop views using Tailwind CSS.
- [x] **State Persistence**: Context API handles state transitions smoothly throughout the checkout process.
- [x] **Premium Visuals**: Custom-generated high-quality assets replace standard placeholders for a professional feel.
