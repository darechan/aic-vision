# Vision 20000 — Developer Onboarding

A password-protected community platform for Vision 20000 IBOs (Amway Independent Business Owners).

**Stack:** React 19 + Tailwind CSS 3 (frontend) · Flask + SQLite via SQLAlchemy (backend)

---

## Project Structure

```
aic-vision/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory (Flask, SQLAlchemy, CORS)
│   │   ├── auth_utils.py        # Token validation + @require_auth decorator
│   │   ├── models/
│   │   │   ├── member.py        # Member model (id, name, location, photo_url, badge_type)
│   │   │   ├── event.py         # Event model (id, title, date, location, description, image_url)
│   │   │   └── resource.py      # Resource model (id, title, description, link, category)
│   │   └── routes/
│   │       ├── auth.py          # POST /api/auth/login
│   │       ├── members.py       # GET/POST /api/members/, DELETE /api/members/<id>
│   │       ├── events.py        # GET/POST /api/events/, DELETE /api/events/<id>
│   │       └── resources.py     # GET/POST /api/resources/, DELETE /api/resources/<id>
│   ├── run.py                   # Entry point: python run.py
│   ├── requirements.txt
│   └── .env                     # Environment variables (see below)
│
└── frontend/
    ├── src/
    │   ├── App.js               # Router + route definitions
    │   ├── index.css            # @tailwind directives
    │   ├── utils/
    │   │   ├── api.js           # Axios instance (baseURL: localhost:5000, auto-attaches token)
    │   │   └── auth.js          # localStorage token helpers + logout()
    │   ├── components/
    │   │   ├── Navbar.jsx       # Sticky nav with mobile hamburger menu
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── MemberCard.jsx   # Circular photo, name, location, badge overlay
    │   │   ├── EventCard.jsx    # Optional image, date pill, title, description
    │   │   └── ResourceCard.jsx # Title, description, external link
    │   └── pages/
    │       ├── Login.jsx        # Centered card, single shared password
    │       ├── Home.jsx         # Hero, quote, about section
    │       ├── Events.jsx       # Fetches GET /api/events/
    │       ├── Resources.jsx    # Reusable — accepts `category` prop (partner|4.0|other)
    │       ├── Leadership.jsx   # Fetches GET /api/members/
    │       └── admin/
    │           └── AdminDashboard.jsx  # Tabbed admin UI (Members / Events / Resources)
    ├── tailwind.config.js       # content: ["./src/**/*.{js,jsx,ts,tsx}"]
    └── postcss.config.js        # tailwindcss + autoprefixer
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python run.py
# → http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## Environment Variables (`backend/.env`)

| Variable        | Description                           | Default                   |
| --------------- | ------------------------------------- | ------------------------- |
| `SECRET_KEY`    | Flask secret & token signing key      | `change-me-in-production` |
| `DATABASE_URL`  | SQLAlchemy DB URI                     | `sqlite:///app.db`        |
| `FLASK_ENV`     | Flask environment                     | `development`             |
| `SITE_PASSWORD` | Single shared password for all access | `vision2000`              |

**Change `SITE_PASSWORD` and `SECRET_KEY` before deploying.**

---

## API Reference

### Auth

| Method | Endpoint        | Auth | Body                  | Returns            |
| ------ | --------------- | ---- | --------------------- | ------------------ |
| POST   | /api/auth/login | —    | `{ "password": "…" }` | `{ "token": "…" }` |

### Members

| Method | Endpoint            | Auth     | Body / Query                                 |
| ------ | ------------------- | -------- | -------------------------------------------- |
| GET    | /api/members/       | —        | —                                            |
| POST   | /api/members/       | Required | `{ name, location, badge_type, photo_url? }` |
| DELETE | /api/members/\<id\> | Required | —                                            |

### Events

| Method | Endpoint           | Auth     | Body / Query                                          |
| ------ | ------------------ | -------- | ----------------------------------------------------- |
| GET    | /api/events/       | —        | —                                                     |
| POST   | /api/events/       | Required | `{ title, date, location, description?, image_url? }` |
| DELETE | /api/events/\<id\> | Required | —                                                     |

### Resources

| Method | Endpoint              | Auth     | Body / Query                                      |
| ------ | --------------------- | -------- | ------------------------------------------------- |
| GET    | /api/resources/       | —        | `?category=partner\|4.0\|other` (optional filter) |
| POST   | /api/resources/       | Required | `{ title, category, description?, link? }`        |
| DELETE | /api/resources/\<id\> | Required | —                                                 |

`category` must be one of: `partner`, `4.0`, `other`

---

## Auth Flow

1. User POSTs password to `/api/auth/login`
2. Server validates against `SITE_PASSWORD` env var, returns a signed token (via `itsdangerous`)
3. Token stored in `localStorage` as `vision_token`
4. All axios requests automatically attach `Authorization: Bearer <token>` header
5. `ProtectedRoute` redirects unauthenticated users to `/login`
6. Mutation endpoints (POST/DELETE) validate the token server-side via `@require_auth`

---

## Pages & Routes

| Path                 | Component      | Description                           |
| -------------------- | -------------- | ------------------------------------- |
| `/login`             | Login          | Password entry                        |
| `/`                  | Home           | Hero, quote, about                    |
| `/events`            | Events         | AIC event listings                    |
| `/resources/partner` | Resources      | New Partner Resources                 |
| `/resources/4.0`     | Resources      | Resources 4.0                         |
| `/resources/other`   | Resources      | Other Resources                       |
| `/leadership`        | Leadership     | Member grid                           |
| `/admin`             | AdminDashboard | Add/delete members, events, resources |

---

## Badge Types (MemberCard)

Supported values with color coding:

- `New BBI` — blue
- `Requalified BBI` — emerald
- `Founders Platinum` — indigo
- `Emerald` — teal
- `Diamond` — cyan
- Any other string — gray
