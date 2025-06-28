````markdown
# Forex Bureau Full-Stack Application

A modern online Forex bureau web application that allows users to sign up, upload KYC documents, view live currency rates, place and track exchange orders, manage rate alerts, and browse FAQs. This README covers project overview, setup, migrations, running server and client, and deployment configuration.

---

## Project Overview

**Domain:** Modern Forex Bureau (online portal)

**Primary Users:** Customers who want to sign up, exchange currency, and track orders.

**Core MVP Features:**

- User signup/login with KYC document upload
- View live buy/sell exchange rates
- Place exchange orders (e.g., USD⇄KES)
- View order history (pending and past)

**Stretch Features:**

- Rate-threshold alerts
- Profile settings page
- FAQ integration

**Timeline:** June 24–27, 2025

---

## Tech Stack

**Backend:**

- Python 3.10+
- Flask, Flask-RESTful, Flask-CORS, Flask-Migrate
- Authentication: JWT via `flask-jwt-extended`
- Database: PostgreSQL, SQLAlchemy, Alembic
- File uploads: Werkzeug
- Environment variables: `DATABASE_URL`, `FLASK_SECRET_KEY`, `JWT_SECRET_KEY`

**Frontend:**

- React 18+, React Router DOM
- Formik + Yup for forms & validation
- Bootstrap for styling (replaced Tailwind CSS)
- HTTP client: Axios or Fetch with localStorage for token persistence
- Auth context for JWT stored in localStorage
- Environment variable: `REACT_APP_API_URL` (or `VITE_API_BASE_URL`)

---

## Prerequisites

- Node.js (v16+ for other versions, but see NVM instructions below for v20.19)
- npm (v8+)
- Python (3.10+)
- PostgreSQL database (local or remote)
- `virtualenv` or `venv` for Python

### NVM & Node.js

Before running the frontend, ensure you have Node.js **v20.19.0** installed via NVM:

```bash
# Install and switch to Node 20.19
nvm install 20.19
nvm use 20.19
````

---

## Installation & Setup

### Backend

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jerome-Chauncey/Forex-Bureau.git
   cd Forex-Bureau
   ```
2. **Initialize Pipenv and install dependencies**

   ```bash
   pipenv shell
   pipenv install
   ```
3. **Install Python dependencies**

   ```bash
   pip install --upgrade pip
   pip install -r server/requirements.txt
   ```
4. **Create `.env` file** in project root or `server/` with:

   ```dotenv
   DATABASE_URL=postgresql://<user>:<password>@<host>:5432/forex_bureau
   FLASK_SECRET_KEY=<your_flask_secret>
   JWT_SECRET_KEY=<your_jwt_secret>
   ```

### Frontend

1. **Navigate to client folder**

   ```bash
   cd client
   ```
2. **Install npm packages**

   ```bash
   npm install
   ```
3. **Create `.env` file** in `client/`:

   ```env
   VITE_API_BASE_URL=http://localhost:5555/api
   ```

---

## Database Migrations & Seeding

1. **Activate environment** (via Pipenv)

   ```bash
   pipenv shell
   ```

2. **Initialize & upgrade database**

   ```bash
   # from project root
   export FLASK_APP=server/app.py
   flask db init           # only first time
   flask db migrate -m "initial schema"
   flask db upgrade
   ```

3. **Seed the database**

   ```bash
   # ensure server package is on PYTHONPATH
   PYTHONPATH=. python server/seed.py
   ```

---

## Running the Application

### Server (Backend)

From the project root:

```bash
PYTHONPATH=. python server/app.py
```

The API will be available at `http://localhost:5555/api/`.

### Client (Frontend)

From the `client/` directory (after installing and activating NVM v20.19):

```bash
npm run dev
```

The React app will run at `http://localhost:3000` by default.

---

## API Reference

See [API Documentation](./forex-bureau.postman_collection.json) or the table below:

| Method | Endpoint          | Auth? | Description                             |
| ------ | ----------------- | ----- | --------------------------------------- |
| POST   | `/api/signup`     | No    | Create user + upload KYC                |
| POST   | `/api/login`      | No    | Authenticate, return JWT/session        |
| GET    | `/api/rates`      | Yes   | List currency pairs with buy/sell rates |
| POST   | `/api/orders`     | Yes   | Place new exchange order                |
| GET    | `/api/orders`     | Yes   | List user’s orders                      |
| GET    | `/api/orders/:id` | Yes   | Order detail / receipt                  |
| DELETE | `/api/orders/:id` | Yes   | Cancel pending order                    |
| GET    | `/api/alerts`     | Yes   | List user’s rate alerts                 |
| POST   | `/api/alerts`     | Yes   | Create rate alert                       |
| PATCH  | `/api/alerts/:id` | Yes   | Activate/deactivate alert               |
| DELETE | `/api/alerts/:id` | Yes   | Delete alert                            |
| GET    | `/api/faqs`       | No    | Fetch static FAQs                       |
| GET    | `/api/users/me`   | Yes   | Get current user profile                |
| PATCH  | `/api/users/me`   | Yes   | Update user info / password             |
| GET    | `/api/health`     | No    | Health check endpoint                   |

---

## Deployment (Render.com)

Use the following `render.yaml` in the repo root for automated free‑tier deployment:

```yaml
# Forex Bureau - Free Tier Deployment
# … (see provided render.yaml snippet above) …
```

Key notes:

* The `buildCommand` installs dependencies, runs migrations (`flask db upgrade`), and seeds the DB.
* The `startCommand` launches Gunicorn on the specified `$PORT`.
* Ensure your `UPLOAD_FOLDER` env var points to `./uploads` under `server/`.

---

Happy coding! 🚀

```
```
