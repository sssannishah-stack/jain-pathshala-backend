# Jain Pathshala Backend API

## Setup
1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure Firebase credentials
4. Run `npm run dev` for development
5. Run `npm run setup` to add sample data

## API Endpoints

### Auth
- POST /api/auth/register
- GET /api/auth/profile
- PUT /api/auth/profile

### Attendance
- POST /api/attendance
- GET /api/attendance
- POST /api/attendance/bulk

### Gathas
- GET /api/gathas
- GET /api/gathas/:id
- POST /api/gathas
- PUT /api/gathas/:id
- DELETE /api/gathas/:id

### Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id
- POST /api/admin/classes
- GET /api/admin/classes

### Reports
- GET /api/reports/attendance
- GET /api/reports/student/:studentId/progress
- GET /api/reports/attendance/export

### User
- GET /api/user/dashboard
- GET /api/user/progress
- GET /api/user/attendance
