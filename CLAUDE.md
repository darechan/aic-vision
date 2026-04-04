# Vision 20000 — Developer Onboarding

A password-protected community platform for Vision 20000 IBOs (Amway Independent Business Owners).

**Stack:** React 19 + Tailwind CSS 3 (frontend) · Flask 3 + SQLite via SQLAlchemy 2 (backend)

---

## Project Structure

```
aic-vision/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory: Flask, SQLAlchemy, CORS, blueprint registration,
│   │   │                        # db.create_all(), automatic SQLite column migrations
│   │   ├── auth_utils.py        # Token validation + @require_auth decorator (itsdangerous)
│   │   ├── models/
│   │   │   ├── member.py        # Member (id, name, location, photo_url, badge_type)
│   │   │   ├── event.py         # Event (id, title, date, location, description, image_url)
│   │   │   ├── resource.py      # Resource (id, title, description, link, category)
│   │   │   ├── gallery.py       # GalleryPhoto (id, filename, title, description, caption, uploaded_at)
│   │   │   └── user.py          # User (placeholder, not yet wired to routes)
│   │   ├── routes/
│   │   │   ├── auth.py          # POST /api/auth/login
│   │   │   ├── members.py       # GET/POST /api/members/, DELETE /api/members/<id>
│   │   │   ├── events.py        # GET/POST /api/events/, DELETE /api/events/<id>
│   │   │   ├── resources.py     # GET/POST /api/resources/, DELETE /api/resources/<id>
│   │   │   ├── gallery.py       # GET /api/gallery/, POST /api/gallery/upload,
│   │   │   │                    # DELETE /api/gallery/<id>
│   │   │   └── users.py         # Placeholder, not yet registered
│   │   └── static/
│   │       └── gallery/         # Uploaded photo files (auto-created on first upload)
│   ├── instance/
│   │   └── app.db               # SQLite database file (auto-created on first run)
│   ├── run.py                   # Entry point: python run.py → http://localhost:5000
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (never commit this file)
│
└── frontend/
    ├── src/
    │   ├── App.js               # Router + all route definitions, ThemeProvider wrapper
    │   ├── index.css            # @tailwind directives + .no-scrollbar utility
    │   ├── context/
    │   │   └── ThemeContext.jsx  # Dark/light mode state, persisted to localStorage
    │   ├── utils/
    │   │   ├── api.js           # Axios instance (baseURL: localhost:5000, auto-attaches token)
    │   │   └── auth.js          # localStorage token helpers + logout()
    │   ├── components/
    │   │   ├── Navbar.jsx       # Sticky nav, mobile hamburger, dark/light toggle button
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Button.jsx
    │   │   ├── MemberCard.jsx   # Circular photo, name, location, badge overlay
    │   │   ├── EventCard.jsx    # Optional image, date pill, title, description
    │   │   └── ResourceCard.jsx # Title, description, external link
    │   └── pages/
    │       ├── Login.jsx        # Centered card, single shared password
    │       ├── Home.jsx         # Qualifier Gallery carousel + quote + about
    │       ├── AddPhoto.jsx     # Upload form: file picker, title, description → /api/gallery/upload
    │       ├── Events.jsx       # Fetches GET /api/events/
    │       ├── Resources.jsx    # Reusable, accepts `category` prop (partner|4.0|other)
    │       ├── Leadership.jsx   # Fetches GET /api/members/
    │       └── admin/
    │           └── AdminDashboard.jsx  # Tabbed admin UI (Members / Events / Resources)
    ├── tailwind.config.js       # darkMode: "class", custom purple palette
    └── postcss.config.js        # tailwindcss + autoprefixer
```

---

## Running Locally

### 1 — Backend

```bash
cd backend

# Create and activate a virtual environment (first time only)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac / Linux

# Install dependencies
pip install -r requirements.txt

# Create your .env file (first time only — see Environment Variables section)
copy .env.example .env         # Windows
# cp .env.example .env         # Mac / Linux
# Then edit .env with your preferred values

# Start the server
python run.py
# → Listening on http://localhost:5000
# → SQLite database auto-created at backend/instance/app.db on first run
```

### 2 — Frontend

```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

Both servers must be running simultaneously during development.

---

## Database Setup & Connection

### How it works

This project uses **SQLite** — a file-based database that requires no separate server, no installation, and no configuration beyond the `DATABASE_URL` environment variable. The database file is created automatically when you start the backend for the first time.

**Database file location:**
```
backend/instance/app.db
```

Flask-SQLAlchemy resolves `sqlite:///app.db` (3 leading slashes = relative path) to Flask's instance folder. The `instance/` directory is created automatically by Flask.

All tables are created on startup via `db.create_all()` inside `create_app()`. If new columns are added to existing models, the app also runs lightweight `ALTER TABLE` migrations on startup — you don't need to delete and recreate the database.

### Inspect the database

**Option A — SQLite CLI** (built into most systems):
```bash
cd backend
sqlite3 instance/app.db

# Inside the SQLite shell:
.tables                          -- list all tables
.schema gallery_photos           -- show columns for a table
SELECT * FROM gallery_photos;    -- query rows
.quit
```

**Option B — DB Browser for SQLite** (GUI, recommended):
1. Download from https://sqlitebrowser.org/
2. Open → select `backend/instance/app.db`
3. Browse Data tab → pick any table

**Option C — VS Code extension:**
Install "SQLite Viewer" by Florian Klampfer, then open `backend/instance/app.db` directly in the editor.

### Current tables

| Table | Model | Description |
| ----- | ----- | ----------- |
| `members` | `Member` | Leadership profiles |
| `events` | `Event` | AIC event listings |
| `resources` | `Resource` | Categorised resource links |
| `gallery_photos` | `GalleryPhoto` | Uploaded qualifier photos (metadata only — files in `app/static/gallery/`) |
| `users` | `User` | Placeholder, not yet in use |

### Reset the database (wipe all data)

```bash
# Stop the Flask server first, then:
cd backend
del instance\app.db            # Windows
# rm instance/app.db           # Mac / Linux

# Also remove uploaded photo files if needed:
rmdir /s /q app\static\gallery  # Windows
# rm -rf app/static/gallery     # Mac / Linux

# Restart the server — tables are recreated automatically:
python run.py
```

### Use a different database (PostgreSQL etc.)

Set `DATABASE_URL` in `.env` to any SQLAlchemy-compatible URI:

```
# PostgreSQL example
DATABASE_URL=postgresql://user:password@localhost:5432/vision20000

# MySQL example
DATABASE_URL=mysql+pymysql://user:password@localhost/vision20000
```

Install the matching driver (`psycopg2-binary` for Postgres, `pymysql` for MySQL) and add it to `requirements.txt`. No code changes needed — SQLAlchemy handles the rest.

---

## Environment Variables

Create `backend/.env` by copying the example below. **Never commit `.env` to version control.**

```dotenv
# .env — copy this file and fill in real values

SECRET_KEY=change-me-in-production
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
SITE_PASSWORD=vision2000
```

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `SECRET_KEY` | Flask secret key and token signing key (itsdangerous) | `change-me-in-production` |
| `DATABASE_URL` | SQLAlchemy database URI | `sqlite:///app.db` |
| `FLASK_ENV` | Flask environment (`development` enables debug mode) | `development` |
| `SITE_PASSWORD` | Single shared password that grants access to the whole site | `vision2000` |

**Before deploying to production:**
- Set `SECRET_KEY` to a long random string (e.g. `python -c "import secrets; print(secrets.token_hex(32))"`)
- Set a strong `SITE_PASSWORD`
- Set `FLASK_ENV=production`
- Switch `DATABASE_URL` to a production-grade database

---

## API Reference

All mutation endpoints (POST / DELETE) require an `Authorization: Bearer <token>` header.
Token is obtained from `POST /api/auth/login` and stored in `localStorage` as `vision_token`.

### Auth

| Method | Endpoint | Auth | Body | Returns |
| ------ | -------- | ---- | ---- | ------- |
| POST | `/api/auth/login` | — | `{ "password": "…" }` | `{ "token": "…" }` |

### Members

| Method | Endpoint | Auth | Body / Query |
| ------ | -------- | ---- | ------------ |
| GET | `/api/members/` | — | — |
| POST | `/api/members/` | Required | `{ name, location, badge_type, photo_url? }` |
| DELETE | `/api/members/<id>` | Required | — |

### Events

| Method | Endpoint | Auth | Body / Query |
| ------ | -------- | ---- | ------------ |
| GET | `/api/events/` | — | — |
| POST | `/api/events/` | Required | `{ title, date, location, description?, image_url? }` |
| DELETE | `/api/events/<id>` | Required | — |

### Resources

| Method | Endpoint | Auth | Body / Query |
| ------ | -------- | ---- | ------------ |
| GET | `/api/resources/` | — | `?category=partner\|4.0\|other` (optional filter) |
| POST | `/api/resources/` | Required | `{ title, category, description?, link? }` |
| DELETE | `/api/resources/<id>` | Required | — |

`category` must be one of: `partner`, `4.0`, `other`

### Gallery

| Method | Endpoint | Auth | Body / Notes |
| ------ | -------- | ---- | ------------ |
| GET | `/api/gallery/` | — | Returns all photos, newest first |
| POST | `/api/gallery/upload` | Required | `multipart/form-data`: `file` (image), `title?` (string), `description?` (string) |
| DELETE | `/api/gallery/<id>` | Required | Deletes DB row + file from disk |

**Allowed file types:** PNG, JPG, JPEG, GIF, WEBP

**How files are stored:**
- Uploaded files are saved to `backend/app/static/gallery/<uuid>.<ext>`
- The API returns a relative URL: `{ "url": "/static/gallery/<filename>", … }`
- On the frontend, the full URL is constructed as `http://localhost:5000` + `photo.url`
- Flask serves these files automatically via its built-in static file handler

**Example gallery photo response:**
```json
{
  "id": 1,
  "url": "/static/gallery/3f8a1c2d.jpg",
  "title": "Annual Conference 2024",
  "description": "Team photo from the main stage",
  "uploaded_at": "2024-11-15T09:32:00"
}
```

---

## Auth Flow

1. User POSTs password to `/api/auth/login`
2. Server validates against `SITE_PASSWORD` env var; returns a signed token (`itsdangerous.URLSafeSerializer`)
3. Token stored in `localStorage` as `vision_token`
4. Every Axios request automatically attaches `Authorization: Bearer <token>` (wired in `utils/api.js`)
5. `ProtectedRoute` redirects unauthenticated users to `/login`
6. POST / DELETE endpoints validate the token server-side via `@require_auth` decorator in `auth_utils.py`

---

## Pages & Routes

| Path | Component | Auth | Description |
| ---- | --------- | ---- | ----------- |
| `/login` | Login | — | Password entry |
| `/` | Home | ✓ | Qualifier Gallery carousel + quote + about |
| `/gallery/add` | AddPhoto | ✓ | Upload photo with title and description |
| `/events` | Events | ✓ | AIC event listings |
| `/resources/partner` | Resources | ✓ | New Partner Resources |
| `/resources/4.0` | Resources | ✓ | Resources 4.0 |
| `/resources/other` | Resources | ✓ | Other Resources |
| `/leadership` | Leadership | ✓ | Member grid |
| `/admin` | AdminDashboard | ✓ | Add / delete members, events, resources |

---

## Dark / Light Mode

The site ships with a **light mode default** and a toggle in the navbar (sun/moon icon).

- Implemented via Tailwind's `darkMode: "class"` strategy
- `ThemeContext.jsx` manages the `dark` boolean in React state, persists the user's choice to `localStorage`
- On mount, `ThemeContext` adds or removes the `dark` CSS class on `<html>`
- All components use paired Tailwind classes: e.g. `text-gray-900 dark:text-white`, `bg-white dark:bg-purple-950`
- First-time visitors always see light mode; returning visitors see their last-used preference

---

## Gallery / File Uploads

The qualifier gallery is the first section on the landing page (`/`). It renders as a horizontally scrollable row of cards (multi-item carousel, not a full-screen banner).

**Upload flow:**
1. Authenticated user clicks **Add Photo** (header of gallery section or navbar)
2. Navigates to `/gallery/add`
3. Picks a file (drag & drop or click), enters a title (required) and description (optional)
4. Submits → `POST /api/gallery/upload` (multipart/form-data)
5. Backend saves file to `app/static/gallery/`, creates a `gallery_photos` row
6. User is redirected to `/` where the new card appears at the front of the carousel

**Card design:**
- Fixed width: 220 px (`w-[220px] flex-shrink-0`)
- Image area: `aspect-[3/4]` portrait ratio with `object-cover object-center`
- Title overlaid at the bottom of the image with a dark gradient
- Description shown in the card body below the image (only if present)

---

## Badge Types (MemberCard)

Supported values for `badge_type` with colour coding:

| Value | Colour |
| ----- | ------ |
| `New BBI` | Blue |
| `Requalified BBI` | Emerald |
| `Founders Platinum` | Indigo |
| `Emerald` | Teal |
| `Diamond` | Cyan |
| Any other string | Gray |
