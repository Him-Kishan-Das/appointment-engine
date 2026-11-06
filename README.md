# 🩺 Appointment Engine

An enterprise-ready, multi-tenant appointment scheduling and clinic management platform built with **Node.js, Express, MongoDB, React 19, Vite, and Tailwind CSS**.

The system provides dedicated role-based experiences for **Healthcare Providers (Hosts)**, **Front Desk Receptionists (Staff)**, and **Patients (Clients)**, alongside a standalone **Public Booking Portal**.

---

## 🚀 Key Features by Role

### 👨‍⚕️ 1. Host (Doctor / Practitioner)
- **Practice Dashboard:** Comprehensive appointment metrics, upcoming consultation queues, and quick-copy public booking URLs.
- **Dynamic Slot & Buffer Engine:** Configure consultation durations (15m, 30m, 45m, 60m) with custom inter-patient buffer gaps (5m–20m).
- **Working Hours & Split Shifts:** Full control over weekly recurring schedules, multi-window shifts (morning & afternoon sessions with lunch breaks).
- **Date Overrides & Vacations:** Block specific holidays, conferences, or set date-specific custom working shifts.
- **Appointments Manager:** Confirm, reschedule, complete, or cancel consultations.

### 👩‍💼 2. Staff (Clinic Reception & Front Desk)
- **Reception Desk Dashboard:** Real-time patient arrival queue with 1-click status updates (`Mark Arrived`, `In Room`, `Completed`).
- **Clinic-Wide Booking Monitor:** Track patient appointments across multiple on-duty doctors (*Dr. Sarah Connor*, *Dr. James Wilson*).
- **Walk-in Patient Intake:** Fast-track registration for walk-in arrivals directly from the desk.
- **Role Safeguards:** Staff accounts are strictly prevented from altering doctor availability and personal doctor settings.

### 🧑‍💼 3. Client (Patient Portal)
- **Patient Dashboard & Sidebar:** Quick metrics on upcoming visits, completed consultations, and active clinical care notes.
- **Next Appointment Highlight:** Prominently highlights the immediate next visit with clinic directions, Google Calendar export, and cancellation options.
- **Consultation Records & Prescriptions:** Digital access to clinical summaries, prescribed medications with dosages, and downloadable visit reports.
- **Clinic Care Team Directory:** Explore doctors by specialty, review experience and ratings, and book consultations directly.
- **Patient Health Profile:** Manage personal info, emergency contacts, insurance policy numbers, and 24h SMS/Email reminder preferences.

### 🌐 4. Public Booking Website
- Standalone patient booking flow with real-time calendar picker and slot slicing.
- Automatic conflict detection to prevent double-booking.
- Instant booking confirmations with Google Calendar integration.

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5
- **Database:** MongoDB via Mongoose v9
- **Validation:** Zod schema validation
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt password hashing
- **Date & Timezone:** `date-fns` & `date-fns-tz`
- **Caching & Queues:** Redis (ioredis) & BullMQ

### Frontend
- **Framework:** React 19
- **Bundler:** Vite v8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **HTTP Client:** Axios with JWT interceptors
- **Routing:** Role-aware client-side state routing with URL hash synchronization

---

## 📁 Repository Structure

```text
appointment-engine/
├── backend/
│   ├── src/
│   │   ├── config/          # Database (MongoDB) and Redis configurations
│   │   ├── controllers/     # Auth, Availability, and Booking controllers
│   │   ├── middlewares/     # JWT authentication, role authorization, tenant context
│   │   ├── models/          # User, Tenant, Availability, and Booking Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Slot generation and availability slicing algorithms
│   │   ├── app.js           # Express app setup and middleware pipeline
│   │   ├── seed.js          # Database seeder (Host, Staff, Client, and sample bookings)
│   │   └── server.js        # Server entry point
│   ├── .env.example         # Template for environment variables
│   ├── .gitignore           # Backend-specific ignore rules
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client instance
│   │   ├── components/      # UI components:
│   │   │   ├── AppointmentsList.jsx    # Host appointment management table
│   │   │   ├── AvailabilityEditor.jsx  # Doctor working hours & slot slicing
│   │   │   ├── ClientDashboard.jsx     # Patient portal with sidebar & records
│   │   │   ├── DashboardOverview.jsx   # Doctor practice dashboard
│   │   │   ├── LoginView.jsx           # Unified authentication screen
│   │   │   ├── PublicBookingPage.jsx   # Public booking website
│   │   │   ├── Sidebar.jsx             # Doctor & Staff workspace navigation
│   │   │   └── StaffDashboard.jsx      # Front desk reception queue
│   │   ├── App.jsx          # Main application container & RBAC view guard
│   │   ├── index.css        # Tailwind CSS v4 styles
│   │   └── main.jsx         # React application root
│   ├── .gitignore           # Frontend-specific ignore rules
│   ├── vite.config.js       # Vite & Tailwind configuration
│   └── package.json
│
├── .gitignore               # Root gitignore (protects secrets, builds, and dependencies)
└── README.md                # Project documentation
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/appointment-engine.git
cd appointment-engine
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/appointment_engine
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

5. Seed the database with initial roles and test data:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be running at `http://localhost:5173` (or `http://localhost:5174`).*

---

## 🔑 Demo Login Credentials

The database seeder (`npm run seed`) provisions three test accounts with different roles:

| Role | Email | Password | Assigned View |
| :--- | :--- | :--- | :--- |
| **Host (Doctor)** | `sarah.connor@apexhealth.com` | `Password123!` | Host Practice Workspace (Hours, Slots, Schedule) |
| **Staff (Reception)** | `staff@apexhealth.com` | `Password123!` | Staff Reception Workspace (Check-ins, Queue) |
| **Client (Patient)** | `michael.vance@gmail.com` | `Password123!` | Patient Appointment Portal (Records, Care Team) |

> 💡 **Quick Login:** The unified login screen features 1-click test credential fill buttons for each role.

---

## 🔒 Role-Based Access Control (RBAC)

The application enforces strict client-side view permissions and server-side authorization:

```
┌─────────────────┬───────────────────┬───────────────────┬────────────────────┐
│ Role            │ Practice Wkspace  │ Patient Portal    │ Availability Edit  │
├─────────────────┼───────────────────┼───────────────────┼────────────────────┤
│ Host (Doctor)   │        ✅         │        🚫         │         ✅         │
│ Staff           │        ✅         │        🚫         │         🚫         │
│ Client          │        🚫         │        ✅         │         🚫         │
│ Public / Guest  │    (Login req)    │    (Login req)    │         🚫         │
└─────────────────┴───────────────────┴───────────────────┴────────────────────┘
```

Unauthorized navigation attempts (such as clients trying to access `#host` or staff attempting to edit doctor working hours) are intercepted by safety guards that display an access-restricted screen and redirect the user back to their authorized workspace.

---

## 📜 Available NPM Scripts

### Backend (`/backend`)
- `npm run dev` — Starts the Express server with Nodemon live-reload.
- `npm run start` — Starts the Express server in production mode.
- `npm run seed` — Populates MongoDB with default tenants, users, schedules, and bookings.

### Frontend (`/frontend`)
- `npm run dev` — Starts the Vite development server.
- `npm run build` — Bundles production assets into `dist/`.
- `npm run preview` — Locally previews the production build.
- `npm run lint` — Runs ESLint code quality checks.

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use and adapt it for personal or commercial projects.

