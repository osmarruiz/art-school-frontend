# Escuela de Bellas Artes "Mariana Sansón Argüello" - Frontend

A modern web application for managing an art school's administrative tasks, student enrollments, payments, and more. This React-based frontend provides a comprehensive interface for administrators, operators, and viewers to interact with the art school's data.

## Features

- **Role-based Access Control**: Different interfaces for administrators, operators, and viewers
- **Student Management**: Enroll, view, and manage student profiles
- **Payment Processing**: Record and track payments
- **Discipline Management**: Manage art disciplines offered by the school
- **Transaction Tracking**: Monitor and report on financial transactions
- **Responsive UI**: Modern interface built with TailwindCSS
- **Interactive Data Grids**: Using AG Grid for powerful data display and manipulation
- **Charts & Analytics**: Visualize data with ApexCharts

## Tech Stack

- **React 18**: Modern frontend library for building user interfaces
- **TypeScript**: Static typing for enhanced development experience
- **Vite**: Next-generation frontend tooling for faster development and building
- **TailwindCSS**: Utility-first CSS framework
- **React Router DOM**: Routing and navigation
- **AG Grid**: Advanced data grid/table component
- **ApexCharts**: Modern charting library
- **Framer Motion**: Animation library
- **React Hot Toast**: Notification system
- **SweetAlert2**: Enhanced popup boxes

## Prerequisites

- Node.js (v16.0.0 or later)
- npm or yarn package manager
- Modern web browser

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd art-school-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with necessary environment variables (if not already present)
   ```
   VITE_API_BASE_URL=your_api_url_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the built application locally

## Project Structure

```
art-school-frontend/
├── public/              # Static assets
├── src/                 # Source files
│   ├── components/      # Reusable UI components
│   ├── layout/          # Layout components (DefaultLayout, OperatorLayout, etc.)
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin-specific pages
│   │   ├── Authentication/ # Login and auth-related pages
│   │   ├── Dashboard/   # Dashboard pages for different roles
│   │   ├── Error/       # Error pages (404, 403, etc.)
│   │   ├── Operator/    # Operator-specific pages
│   │   └── StudentProfile/ # Student profile page
│   ├── routes/          # Route-related components and utilities
│   ├── services/        # API services and data fetching
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.js       # Vite configuration
└── tailwind.config.cjs  # TailwindCSS configuration
```

## Roles and Permissions

The application supports the following user roles:

- **Admin**: Full access to all features and data
- **Operator**: Access to enrollment, payment, and student management
- **Viewer**: Read-only access to certain data

## License

This project is licensed under the terms specified in the [LICENSE.md](LICENSE.md) file.

## Acknowledgements

- TailAdmin for the base admin template
- All open source libraries and tools used in this project

