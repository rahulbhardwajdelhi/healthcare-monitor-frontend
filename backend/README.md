# Healthcare Monitor Backend

A simple Node.js/Express API for managing patient health monitoring data.

## Quick Start

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000` by default.

## API Documentation

### Health Check
- **GET** `/health` - Check if API is running
- Response: `{ "status": "ok", "timestamp": "..." }`

### Patients CRUD

#### List all patients
- **GET** `/api/patients`
- Response: `[{ id, name, status, lastChecked, vitals }, ...]`

#### Get one patient
- **GET** `/api/patients/:id`
- Response: `{ id, name, status, lastChecked, vitals }`

#### Create patient
- **POST** `/api/patients`
- Body: `{ "name": "string", "status": "stable|monitored|critical|discharged", "vitals": { "heartRate": number } }`
- Response: Created patient object with `id` and `lastChecked`

#### Update patient
- **PUT** `/api/patients/:id`
- Body: `{ "name"?: "string", "status"?: "...", "vitals"?: { ... } }`
- Response: Updated patient object

#### Delete patient
- **DELETE** `/api/patients/:id`
- Response: Deleted patient object

## Environment Variables

Create a `.env` file (copy from `.env.example`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: development)
- `LOG_LEVEL` - Logging level (default: info)

## Project Structure

```
backend/
├── server.js           # Main entry point
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── routes/
│   └── patients.js     # Patient API endpoints
├── models/
│   └── patient.js      # Patient validation
└── middleware/
    └── index.js        # Logging and error handling
```

