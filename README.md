# AlumniConnect

Alumni Networking & Mentorship Platform.

## Backend

```bash
cd alumniconnect-backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`.

## Frontend

```bash
cd alumniconnect-frontend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5173`.

Make sure the backend is running first so the frontend can connect to it.
