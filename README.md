# NexCRM — Streaming Industry Intelligence Platform

A production-ready, full-stack CRM platform built specifically for streaming & media companies.

## 🏗️ Architecture

```
NexCRM/
├── backend/          — Spring Boot 3.2 API (Java 21)
├── client-admin/     — NexCRM Admin Dashboard (React + Vite)
└── client-gflix/     — Gflix Subscriber Portal (React + Vite)
```

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
./mvnw.cmd clean spring-boot:run
```
Backend starts at **http://localhost:8080**
H2 Console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:nexcrm`)

### 2. Start Admin Dashboard
```bash
cd client-admin
npm install
npm run dev
```
Admin Panel: **http://localhost:5173**

### 3. Start Gflix Portal
```bash
cd client-gflix
npm install
npm run dev
```
Gflix Portal: **http://localhost:5174**

---

## 🔑 Demo Credentials

### Admin Panel (NexCRM)
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Super Admin |
| `agent1` | `agent123` | CRM Agent |
| `support1` | `support123` | Support Rep |

### Gflix Portal (Customers)
| Email | Password |
|-------|----------|
| `emma@techcorp.com` | `pass123` |
| `liam@designco.io` | `pass123` |
| `olivia@fintech.co` | `pass123` |

---

## ✨ Features

### Admin Dashboard (NexCRM)
- **Dashboard** — KPI cards, subscriber growth charts, MRR analytics, pie charts
- **Customers** — Full table with search, pagination, add/delete, status badges
- **Requests** — Approve/reject new subscriber requests → auto-creates customer
- **Analytics** — Churn analysis, revenue trends, geographic breakdown
- **Support Tickets** — Manage tickets with priority, category, status updates
- **Plans** — Create and manage subscription plan tiers
- **Settings** — Profile, security info, system details

### Gflix Portal
- **Browse** — Netflix-grade UI with hero banner, content carousels, My List
- **Login** — Email-based customer authentication
- **Request Access** — Live plan selection + onboarding form
- **My Account** — Profile, subscription plan, ticket history
- **Support** — Submit support tickets with priority/category

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| Auth | JWT (JJWT 0.12.5) — stateless, secure |
| Database | H2 (dev) / PostgreSQL (prod) |
| Admin Frontend | React 18, Vite, TailwindCSS, Recharts, React Query v5, Zustand |
| Customer Portal | React 18, Vite, Framer Motion, React Query v5, Zustand |
| Icons | Lucide React |

---

## 🗄️ Database

Development uses **H2 in-memory** — zero configuration needed.

For PostgreSQL in production, create `application-prod.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexcrm
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

Run with: `./mvnw spring-boot:run -Dspring.profiles.active=prod`

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → JWT |
| POST | `/api/auth/register` | Register admin user |
| GET | `/api/auth/me` | Get current admin |
| POST | `/api/customer-auth/login` | Customer login → JWT |
| GET | `/api/customer-auth/me` | Get current customer |
| GET | `/api/dashboard/stats` | KPI statistics |
| GET | `/api/customers` | List customers (search, paginate) |
| GET | `/api/plans/active` | Public plan list |
| GET | `/api/requests` | All access requests |
| PUT | `/api/requests/{id}/approve` | Approve → create customer |
| PUT | `/api/requests/{id}/reject` | Reject request |
| GET/POST | `/api/tickets` | Support tickets |

---

Built with ❤️ as NexCRM — filling the gap no existing CRM covers for streaming businesses.
