# Employee Leave Management System — Frontend

React + Vite + Axios frontend for the Employee Leave Management System Spring Boot backend.

## Requirements
- Node.js 20 or later (Node 24 should also work)
- npm
- Backend running at `http://localhost:8080`
- MySQL configured for the backend

## Install and run
Open PowerShell in this frontend folder and run:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo login
- Employee: `employee` / `employee123`
- Admin: `admin` / `admin123`

These demo credentials work only if the backend starter project has seeded these users.

## Backend integration
By default, Axios calls `http://localhost:8080`. To override it, create `.env` based on `.env.example` and set `VITE_API_BASE_URL`.

Expected backend endpoints:
- `POST /api/auth/login` — `{ "username": "...", "password": "..." }`
- `GET /api/leaves?username=employee`
- `POST /api/leaves` — `{ username, leaveType, startDate, endDate, reason }`
- `GET /api/leave-balance?username=employee`
- `GET /api/admin/leaves`
- `PATCH /api/admin/leaves/{id}` — `{ "status": "APPROVED" }` or `{ "status": "REJECTED", "comment": "..." }`

The UI includes an employee dashboard, leave balance cards, apply-for-leave form, request history, and an admin approval dashboard.

## Important
This is a learning project. Frontend route visibility is not security. The backend must enforce authorization for every admin endpoint before production use.
