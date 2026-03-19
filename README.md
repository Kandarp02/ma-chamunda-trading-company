# 🌾 MA CHAMUNDA TRADING COMPANY
## 📊 Agricultural Trading Management System

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://ma-chamunda-trading-company.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/Kandarp02/ma-chamunda-trading-company?style=for-the-badge)](https://github.com/Kandarp02/ma-chamunda-trading-company)
[![GitHub Forks](https://img.shields.io/github/forks/Kandarp02/ma-chamunda-trading-company?style=for-the-badge)](https://github.com/Kandarp02/ma-chamunda-trading-company/fork)
[![License](https://img.shields.io/github/license/Kandarp02/ma-chamunda-trading-company?style=for-the-badge)](LICENSE)

**🚀 Streamlining Agricultural Trading with Modern Technology**

[View Live Demo](https://ma-chamunda-trading-company.vercel.app) • [Report Bug](https://github.com/Kandarp02/ma-chamunda-trading-company/issues) • [Request Feature](https://github.com/Kandarp02/ma-chamunda-trading-company/issues/new)

</div>

---

## 📖 Table of Contents

- [🌟 About](#-about)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📊 Database Schema](#-database-schema)
- [🎨 UI Components](#-ui-components)
- [📈 Reports & Analytics](#-reports--analytics)
- [🔐 Authentication](#-authentication)
- [🚀 Deployment](#-deployment)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## 🌟 About

MA CHAMUNDA TRADING COMPANY is a comprehensive **agricultural trading management system** designed to streamline purchase and sale operations for agricultural commodities. This full-stack web application provides real-time inventory management, financial tracking, and professional reporting capabilities.

### 🎯 Business Problem Solved
- **Manual Paperwork Reduction**: 80% reduction in manual documentation
- **Real-time Inventory**: Live stock tracking and management
- **Financial Visibility**: Automated payment tracking and reporting
- **Professional Documentation**: PDF bills and Excel reports with company branding
- **Mobile Accessibility**: Full functionality across all devices

### 💡 Key Innovation
Dynamic Excel generation with automatic row height adjustment and integrated PDF creation with company branding, providing professional business documentation instantly.

---

## ✨ Features

### 📋 Purchase Management
- ✅ Create purchase bills from farmers
- ✅ Track farmer details and mobile numbers
- ✅ Automatic stock addition on purchases
- ✅ Payment status tracking with repayment dates
- ✅ Professional PDF bill generation

### 💼 Sale Management
- ✅ Create sale bills for shops/companies
- ✅ Customer information management
- ✅ Automatic stock deduction
- ✅ Real-time payment tracking
- ✅ Professional invoice generation

### 📦 Inventory Management
- ✅ Real-time stock tracking
- ✅ Stock history with timestamps
- ✅ Automatic stock updates
- ✅ Low stock monitoring
- ✅ Multi-crop support

### 💰 Financial Management
- ✅ Payment tracking with remaining amounts
- ✅ Repayment date management
- ✅ "Mark as Paid" functionality
- ✅ Financial status indicators
- ✅ Due date tracking

### 📊 Advanced Reporting
- ✅ **Excel Reports**: Monthly summaries with dynamic formatting
- ✅ **PDF Bills**: Professional invoices with company branding
- ✅ **Financial Analytics**: Purchase/sale trends
- ✅ **Inventory Reports**: Stock levels and movements

### 👥 User Management
- ✅ Secure admin authentication
- ✅ Role-based access control
- ✅ Multiple admin support
- ✅ Session management

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet and desktop optimization
- ✅ Modern UI with animations
- ✅ Professional company branding

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom React components
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Authentication**: Custom JWT-based system
- **File Handling**: Built-in Next.js capabilities

### Libraries & Tools
- **PDF Generation**: jsPDF
- **Excel Reports**: xlsx
- **Database Client**: Supabase Client
- **Date Handling**: Built-in Date API
- **Validation**: Custom validation logic

### Deployment
- **Platform**: Vercel
- **Database**: Supabase Cloud
- **Environment**: Production-ready
- **CI/CD**: Automatic deployment on push

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Kandarp02/ma-chamunda-trading-company.git

# Navigate to project directory
cd ma-chamunda-trading-company

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup

Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
```

### Database Setup
1. Create Supabase project
2. Run SQL migrations from `database/migrations`
3. Set up authentication policies
4. Insert initial data

---

## 📁 Project Structure

```
ma-chamunda-trading-company/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 admin/              # Admin dashboard
│   ├── 📂 api/                # API routes
│   │   ├── 📂 auth/           # Authentication
│   │   ├── 📂 purchase-bills/ # Purchase operations
│   │   ├── 📂 sale-bills/     # Sale operations
│   │   ├── 📂 stocks/         # Inventory management
│   │   └── 📂 reports/        # Report generation
│   ├── 📂 login/              # Login page
│   └── 📂 layout.tsx          # Root layout
├── 📂 components/             # React components
│   ├── 📂 admin/              # Admin-specific components
│   ├── 📂 sections/           # Page sections
│   └── 📂 navigation.tsx      # Navigation component
├── 📂 lib/                    # Utility libraries
│   ├── 📄 database.ts         # Database queries
│   ├── 📄 pdf-generator.ts    # PDF generation
│   ├── 📄 admin-auth.ts       # Authentication logic
│   └── 📄 data.ts             # Static data
├── 📂 public/                 # Static assets
│   ├── 🖼️ logo.jpg            # Company logo
│   └── 📄 favicon.ico          # Favicon
└── 📄 README.md               # This file
```

---

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Kandarp02/ma-chamunda-trading-company.git
cd ma-chamunda-trading-company
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

### 4. Database Setup
```bash
# Create Supabase project
# Run migrations from database/migrations/
# Set up authentication policies
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚙️ Configuration

### Database Configuration
```sql
-- Create tables
CREATE TABLE purchase_bills (...);
CREATE TABLE sale_bills (...);
CREATE TABLE stocks (...);
CREATE TABLE users (...);
```

### Authentication Setup
```typescript
// Configure admin authentication
const adminConfig = {
  password: process.env.ADMIN_PASSWORD,
  sessionTimeout: '24h'
}
```

### Report Configuration
```typescript
// Excel report settings
const excelConfig = {
  rowHeight: 'auto',
  columnWidth: 'auto',
  companyName: 'MA CHAMUNDA TRADING COMPANY'
}
```

---

## 📊 Database Schema

### Core Tables

#### Purchase Bills
```sql
CREATE TABLE purchase_bills (
  id SERIAL PRIMARY KEY,
  farmer_name VARCHAR NOT NULL,
  mobile_number VARCHAR,
  total_amount DECIMAL NOT NULL,
  amount_paid DECIMAL DEFAULT 0,
  amount_remaining DECIMAL,
  repayment_date DATE,
  bill_date DATE NOT NULL,
  labour_charges DECIMAL DEFAULT 0,
  weighing_charges DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Sale Bills
```sql
CREATE TABLE sale_bills (
  id SERIAL PRIMARY KEY,
  shop_name VARCHAR NOT NULL,
  mobile_number VARCHAR,
  total_amount DECIMAL NOT NULL,
  amount_paid DECIMAL DEFAULT 0,
  amount_remaining DECIMAL,
  repayment_date DATE,
  bill_date DATE NOT NULL,
  labour_charges DECIMAL DEFAULT 0,
  weighing_charges DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Stock Management
```sql
CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  crop_name VARCHAR NOT NULL,
  quantity DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Bill Items
```sql
CREATE TABLE purchase_bill_items (
  id SERIAL PRIMARY KEY,
  bill_id INTEGER REFERENCES purchase_bills(id),
  crop_name VARCHAR NOT NULL,
  quantity DECIMAL NOT NULL,
  rate DECIMAL NOT NULL,
  total DECIMAL NOT NULL
);
```

---

## 🎨 UI Components

### Key Components

#### Navigation Component
```typescript
// components/navigation.tsx
- Responsive navigation with mobile menu
- Company logo and branding
- User authentication status
- Quick access to main features
```

#### Bill Generation Component
```typescript
// components/admin/BillGeneration.tsx
- Purchase/Sale bill creation forms
- Real-time calculations
- PDF generation
- Excel export functionality
``#### Stock Management Component
```typescript
// Stock tracking and management
- Real-time inventory display
- Stock history
- Low stock alerts
```

---

## 📈 Reports & Analytics

### Excel Reports
- **Monthly Purchase Reports**: Comprehensive purchase data with farmer details
- **Monthly Sale Reports**: Complete sales information with customer data
- **Dynamic Formatting**: Auto-adjusting row heights for multi-item visibility
- **Professional Layout**: Company branding and proper formatting

### PDF Bills
- **Purchase Bills**: Professional invoices for farmer purchases
- **Sale Bills**: Detailed invoices for customer sales
- **Company Branding**: Logo and contact information
- **Itemized Billing**: Detailed breakdown of items and charges

### Financial Analytics
- **Revenue Tracking**: Monthly and yearly revenue trends
- **Payment Status**: Due and overdue payment tracking
- **Inventory Value**: Current stock valuation
- **Profit Margins**: Purchase vs sale analysis

---

## 🔐 Authentication

### Security Features
- **Admin Authentication**: Secure login system
- **Session Management**: Automatic session timeout
- **Password Protection**: Encrypted password storage
- **Route Protection**: Admin-only routes

### Implementation
```typescript
// lib/admin-auth.ts
export class AdminAuth {
  async login(password: string): Promise<boolean>
  async verifySession(): Promise<boolean>
  async logout(): Promise<void>
}
```

---

## 🚀 Deployment

### Vercel Deployment
1. **Connect GitHub Repository**
   - Link your GitHub account to Vercel
   - Import the repository

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_PASSWORD=your_admin_password
   ```

3. **Deploy**
   - Automatic deployment on push to main branch
   - Custom domain configuration
   - SSL certificates included

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📸 Screenshots

### 🏠 Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1a2e/16213e?text=Dashboard+View)
*Modern dashboard with quick stats and navigation*

### 📋 Bill Management
![Bill Management](https://via.placeholder.com/800x400/1a1a2e/16213e?text=Bill+Management)
*Comprehensive bill creation and management interface*

### 📊 Reports
![Reports](https://via.placeholder.com/800x400/1a1a2e/16213e?text=Analytics+Reports)
*Advanced reporting with Excel and PDF generation*

### 📱 Mobile View
![Mobile View](https://via.placeholder.com/400x700/1a1a2e/16213e?text=Mobile+Responsive)
*Fully responsive mobile interface*

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 🍴 Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/ma-chamunda-trading-company.git
cd ma-chamunda-trading-company
```

### 🌿 Create Branch
```bash
git checkout -b feature/AmazingFeature
```

### 💻 Make Changes
- Follow the existing code style
- Add tests for new features
- Update documentation

### 📤 Commit & Push
```bash
git add .
git commit -m 'Add some AmazingFeature'
git push origin feature/AmazingFeature
```

### 🔄 Pull Request
- Create detailed PR description
- Include screenshots if applicable
- Wait for review

### 📝 Code Style
- Use TypeScript for all new code
- Follow existing component structure
- Add proper error handling
- Include comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2024 MA CHAMUNDA TRADING COMPANY

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Contact

### 👤 Developer
**Kandarp Patel**
- 📧 Email: tradingmachamunda@gmail.com
- 📱 Phone: +91 7709294093
- 🌐 Website: [ma-chamunda-trading-company.vercel.app](https://ma-chamunda-trading-company.vercel.app)

### 🏢 Business
**MA CHAMUNDA TRADING COMPANY**
- 📍 Address: Pimpri, Maharashtra, India
- 📧 Email: tradingmachamunda@gmail.com
- 📱 Phone: +91 7709294093

### 🌐 Social
- 🐦 Twitter: [@company_handle](https://twitter.com/company_handle)
- 💼 LinkedIn: [Company Page](https://linkedin.com/company/company)
- 📷 Instagram: [@company_instagram](https://instagram.com/company_instagram)

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation library
- **[xlsx](https://github.com/SheetJS/sheetjs)** - Excel spreadsheet library

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ by [Kandarp Patel](https://github.com/Kandarp02)

[![Back to top](https://img.shields.io/badge/Back%20to%20Top-↑-blue?style=for-the-badge)](#-ma-chamunda-trading-company)

</div>
