# SparkCRM

A comprehensive Customer Relationship Management (CRM) system built with:
- **Backend**: Spring Boot (Java), Spring Security, Spring Data JPA, MySQL
- **Frontend**: React, Vite, Framer Motion

## Features
- User Authentication (Login/Register) with BCrypt encryption
- Role-based Access Control (Dynamic Database-backed)
- Dashboard with Real-time statistics
- Customer Management (Add, Edit, Delete, View All)
- "Recent Activity" tracking

## Setup

### Prerequisites
- Java 17+
- Node.js & npm
- MySQL Server

### Backend Setup
1. Configure database credentials in `src/main/resources/application.properties`.
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend-crm
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
