# Vision 20000

A password-protected community platform for **Vision 20000** — an elite AIC group of Amway Independent Business Owners (IBOs). The platform provides a central hub for events, resources, and leadership information, accessible only to authorized members via a shared password.

---

## Tech Stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | React 19, React Router 7, Axios, Tailwind CSS 3  |
| Backend  | Flask 3, Flask-SQLAlchemy, Flask-CORS            |
| Database | SQLite (via SQLAlchemy ORM)                      |
| Auth     | itsdangerous token signing, localStorage         |

---

## Folder Structure

```
aic-vision/
│
├── backend/                            # Flask API server
│   ├── app/
│   │   ├── __init__.py                 # App factory — creates Flask app, registers extensions
│   │   │                               #   (SQLAlchemy, CORS) and route blueprints
│   │   ├── auth_utils.py               # Token validation logic and @require_auth decorator
│   │   │                               #   used to protect POST/DELETE endpoints
│   │   ├── models/
│   │   │   ├── member.py               # Member model: id, name, location, photo_url, badge_type
│   │   │   ├── event.py                # Event model: id, title, date, location, description, image_url
│   │   │   └── resource.py             # Resource model: id, title, description, link, category
│   │   └── routes/
│   │       ├── auth.py                 # POST /api/auth/login
│   │       ├── members.py              # GET/POST /api/members/, DELETE /api/members/<id>
│   │       ├── events.py               # GET/POST /api/events/, DELETE /api/events/<id>
│   │       └── resources.py            # GET/POST /api/resources/, DELETE /api/resources/<id>
│   ├── run.py                          # Entry point — runs the Flask development server
│   ├── requirements.txt                # Python dependencies (pip)
│   └── .env                            # Environment variables — NOT committed to git
│
└── frontend/                           # React single-page application
    ├── src/
    │   ├── App.js                      # Root component — defines all routes and the Layout wrapper
    │   ├── index.css                   # Tailwind CSS directives (@tailwind base/components/utilities)
    │   ├── utils/
    │   │   ├── api.js                  # Axios instance pre-configured with base URL and auto
    │   │   │                           #   auth token injection on every request
    │   │   └── auth.js                 # Helpers: setToken, getToken, isAuthenticated, logout
    │   ├── components/
    │   │   ├── Navbar.jsx              # Sticky top nav bar with responsive hamburger menu
    │   │   ├── Footer.jsx              # Site footer with copyright
    │   │   ├── ProtectedRoute.jsx      # Redirects unauthenticated users to /login
    │   │   ├── MemberCard.jsx          # Circular avatar, name, location, badge type pill overlay
    │   │   ├── EventCard.jsx           # Optional image, date pill, title, description
    │   │   └── ResourceCard.jsx        # Title, description, and external link button
    │   └── pages/
    │       ├── Login.jsx               # Centered card — submits shared password to get a token
    │       ├── Home.jsx                # Hero section, inspirational quote, about section
    │       ├── Events.jsx              # Fetches and displays all events in a responsive grid
    │       ├── Resources.jsx           # Reusable page — accepts a `category` prop (partner|4.0|other)
    │       ├── Leadership.jsx          # Fetches and displays all members in a responsive grid
    │       └── admin/
    │           └── AdminDashboard.jsx  # Tabbed admin UI — add/delete members, events, resources
    ├── tailwind.config.js              # Content paths + custom purple color palette
    ├── postcss.config.js               # PostCSS config — tailwindcss and autoprefixer
    └── package.json                    # Node dependencies and npm scripts
```

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool    | Minimum Version | Download                |
| ------- | --------------- | ----------------------- |
| Node.js | 18+             | https://nodejs.org      |
| Python  | 3.9+            | https://python.org      |
| Git     | any             | https://git-scm.com     |

Verify your installations:

```bash
node --version
python --version
git --version
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd aic-vision
```

---

### 2. Backend Setup

```bash
# Move into the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Windows (Command Prompt):
venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file (copy the example below and fill in your values)
# Then start the Flask server
python run.py
```

The API will be running at **http://localhost:5000**.

> The SQLite database (`app.db`) is created automatically on first run inside the `backend/` folder. No migrations are needed.

---

### 3. Frontend Setup

Open a **new terminal** (keep the backend terminal running):

```bash
# Move into the frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```

The app will open automatically at **http://localhost:3000**.

---

## Running Both Servers Simultaneously

You need **two terminal windows** open at the same time:

| Terminal | Working Directory      | Command         |
| -------- | ---------------------- | --------------- |
| 1        | `aic-vision/backend`   | `python run.py` |
| 2        | `aic-vision/frontend`  | `npm start`     |

> **Tip (VS Code):** Click the `+` icon in the Terminal panel to split into a second terminal, or use the dropdown arrow to open a new terminal tab.

The frontend proxies API requests to `localhost:5000`. Both servers must be running for the app to work correctly.

---

## Environment Variables

Create a file at `backend/.env` with the following:

```env
SECRET_KEY=change-me-in-production
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
SITE_PASSWORD=your-chosen-password
```

| Variable        | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| `SECRET_KEY`    | Used by Flask and itsdangerous to sign auth tokens. Use a long random string in production. |
| `DATABASE_URL`  | SQLAlchemy database URI. The default creates a local `app.db` SQLite file.               |
| `FLASK_ENV`     | Set to `development` for debug mode and auto-reload. Use `production` for live deploys.  |
| `SITE_PASSWORD` | The single shared password all IBOs use to log in. **Change this before deploying.**     |

> **Important:** Never commit `.env` to git. It is already listed in `.gitignore`.

---

## API Endpoints

Base URL: `http://localhost:5000`

Endpoints marked **Required** need an `Authorization: Bearer <token>` header. The Axios instance in `src/utils/api.js` attaches this automatically for all frontend requests.

### Authentication

| Method | Endpoint          | Auth | Request Body           | Response           |
| ------ | ----------------- | ---- | ---------------------- | ------------------ |
| POST   | `/api/auth/login` | None | `{ "password": "…" }` | `{ "token": "…" }` |

### Members

| Method | Endpoint            | Auth     | Body / Notes                                          |
| ------ | ------------------- | -------- | ----------------------------------------------------- |
| GET    | `/api/members/`     | None     | Returns array of all members                          |
| POST   | `/api/members/`     | Required | `{ name, location, badge_type, photo_url? }`          |
| DELETE | `/api/members/<id>` | Required | Deletes the member with the given id                  |

### Events

| Method | Endpoint            | Auth     | Body / Notes                                            |
| ------ | ------------------- | -------- | ------------------------------------------------------- |
| GET    | `/api/events/`      | None     | Returns array of all events                             |
| POST   | `/api/events/`      | Required | `{ title, date, location, description?, image_url? }`  |
| DELETE | `/api/events/<id>`  | Required | Deletes the event with the given id                     |

### Resources

| Method | Endpoint               | Auth     | Body / Notes                                         |
| ------ | ---------------------- | -------- | ---------------------------------------------------- |
| GET    | `/api/resources/`      | None     | Optional query param: `?category=partner\|4.0\|other` |
| POST   | `/api/resources/`      | Required | `{ title, category, description?, link? }`           |
| DELETE | `/api/resources/<id>`  | Required | Deletes the resource with the given id               |

**Valid `category` values:** `partner`, `4.0`, `other`

Fields marked `?` are optional.

---

## Pages & Routes

| Path                  | Component        | Auth     | Description                                   |
| --------------------- | ---------------- | -------- | --------------------------------------------- |
| `/login`              | Login            | None     | Shared password entry                         |
| `/`                   | Home             | Required | Hero, quote, and about section                |
| `/events`             | Events           | Required | Grid of all AIC events                        |
| `/resources/partner`  | Resources        | Required | New Partner Resources                         |
| `/resources/4.0`      | Resources        | Required | Resources 4.0                                 |
| `/resources/other`    | Resources        | Required | Other Resources                               |
| `/leadership`         | Leadership       | Required | Member grid with badge overlays               |
| `/admin`              | AdminDashboard   | Required | Add and delete members, events, and resources |

Unauthenticated users are automatically redirected to `/login` by `ProtectedRoute`.

---

## Auth Flow

1. User submits the site password at `/login`
2. Backend validates it against `SITE_PASSWORD` in `.env`
3. On success, a signed token is returned (signed with `SECRET_KEY` via `itsdangerous`)
4. Token is stored in `localStorage` as `vision_token`
5. All Axios requests automatically attach `Authorization: Bearer <token>`
6. `ProtectedRoute` checks `isAuthenticated()` before rendering any protected page
7. Mutation endpoints (POST/DELETE) verify the token server-side via `@require_auth`

---

## Admin Dashboard

The admin dashboard at `/admin` lets you add and delete content across three tabs: **Members**, **Events**, and **Resources**.

**How to access it:**

1. Log in at `/login` using the `SITE_PASSWORD` from your `.env`
2. Navigate to `/admin` in the browser, or click **Admin** in the navbar (small link, bottom-right of nav)

There is no separate admin password — any authenticated user can access the dashboard. For production, consider adding a separate admin role or IP restriction.

### Member Badge Types

| Badge             | Color   |
| ----------------- | ------- |
| New BBI           | Blue    |
| Requalified BBI   | Emerald |
| Founders Platinum | Indigo  |
| Emerald           | Teal    |
| Diamond           | Cyan    |
| Any other value   | Gray    |

---

## Contributing

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the existing code style:**
   - React components use functional components with hooks — no class components
   - All styling uses Tailwind utility classes — no separate `.css` files
   - Flask routes are organized into blueprints under `backend/app/routes/`
   - Keep components small and focused — extract reusable UI into `components/`

3. **Test your changes** by running both servers and verifying the affected pages work correctly.

4. **Commit** with a clear message:
   ```bash
   # Prefixes: Add | Fix | Refactor | Update | Remove
   git commit -m "Add: brief description of what you changed"
   ```

5. **Push** your branch and open a Pull Request against `main`:
   ```bash
   git push origin feature/your-feature-name
   ```

6. In your Pull Request description, include:
   - What changed and why
   - Any new environment variables added to `.env`
   - Screenshots if the change affects the UI

---

## Common Issues

**`npm start` fails with "cannot find package.json"**
→ You are in the wrong directory. Run `cd frontend` first, then `npm start`.

**`python run.py` fails with "No such file or directory"**
→ You are in the wrong directory. Run `cd backend` first, then `python run.py`.

**Frontend shows a blank page or API errors**
→ Make sure the backend is running at `localhost:5000`. Both servers must be active simultaneously.

**Login says "Invalid password"**
→ Check the `SITE_PASSWORD` value in `backend/.env`. Make sure there are no extra spaces or quotes around the value.

**Tailwind styles not appearing**
→ Ensure you ran `npm install` inside the `frontend/` folder. Restart `npm start` after any changes to `tailwind.config.js`.
