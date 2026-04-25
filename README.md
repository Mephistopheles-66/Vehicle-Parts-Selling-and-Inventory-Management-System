# Vehicle Parts Selling and Inventory Management System

Coursework project for CS6004NI Application Development, Islington College.

## Team

| London Met ID | Name | Responsibilities (Milestone 1) |
|---------------|------|-------------------------------|
| 23050184 | Prasanna Mahat | Parts CRUD, Vendor CRUD, Purchase invoices |
| 23047614 | Sushant Tamang | Auth/JWT, Staff registration, Loyalty discount |
| 23050340 | Mahan Shrestha | Customer registration, Sales invoices, Customer search |
| 23049012 | Aditi Adhikari | Customer self-registration, Appointments, Reviews |

## Repository structure

This is a monorepo containing both backend and frontend.

\`\`\`
vehicle-parts-system/
├── backend/      ASP.NET Core Web API (.NET 10) - Clean Architecture
│   └── src/
│       ├── VehicleParts.Api/
│       ├── VehicleParts.Application/
│       ├── VehicleParts.Domain/
│       └── VehicleParts.Infrastructure/
├── frontend/     Blazor WebAssembly (.NET 10)
└── docs/         ERD, design docs, screenshots
\`\`\`

## Branch convention

- \`main\` — protected, releases only
- \`develop\` — integration branch
- \`feature/be-<name>\` — backend feature branches
- \`feature/fe-<name>\` — frontend feature branches

## Tech stack

- .NET 10 SDK
- ASP.NET Core Web API
- Blazor WebAssembly
- Entity Framework Core
- PostgreSQL 14+
- JWT Bearer authentication

## Local setup

### Prerequisites
- .NET 10 SDK
- PostgreSQL 14 or later running locally
- Git

### Database setup
\`\`\`
psql -U postgres -c "CREATE DATABASE vehicleparts_dev;"
\`\`\`

The default development connection string expects:
- Host: localhost
- Port: 5432
- User: postgres
- Password: devpassword
- Database: vehicleparts_dev

### Run the backend
\`\`\`
cd backend
dotnet run --project src/VehicleParts.Api
\`\`\`

### Run the frontend
*To be added when frontend is scaffolded.*
