# Matii Architects

Website for Matii Architects — React (Vite) frontend + FastAPI backend.

```
MatiiArchitects/
├── backend/                  # FastAPI (Python 3.9+)
│   ├── app/
│   │   ├── main.py           # App factory, CORS, startup
│   │   ├── api/
│   │   │   ├── router.py     # Mounts all routes under /api
│   │   │   └── routes/       # projects.py, services.py, contact.py
│   │   ├── core/config.py    # Settings (env vars)
│   │   ├── db/database.py    # SQLite connection + schema
│   │   ├── models/schemas.py # Pydantic request/response models
│   │   ├── repositories/     # Data access (JSON content, contact messages)
│   │   └── data/             # projects.json, services.json
│   ├── requirements.txt
│   └── run.py
└── frontend/                 # React 18 + Vite + React Router
    ├── index.html
    ├── vite.config.js        # Proxies /api -> http://127.0.0.1:8000
    └── src/
        ├── main.jsx, App.jsx # Entry + routes
        ├── api/              # fetch client + useApi hook
        ├── assets/hero/      # ma / माती / tii hero images
        ├── components/       # Header, Hero, Footer, Layout, HoverSlideshow, TeamMember, …
        ├── sections/         # Intro, Projects, Services, About, Contact (stacked on Home)
        ├── pages/            # Home (single scrolling page), NotFound
        └── styles/global.css # Palette + shared styles
```

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # optional
python run.py               # http://127.0.0.1:8000  (docs at /docs)
```

### API

| Method | Path                    | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| GET    | `/api/health`           | Health check                              |
| GET    | `/api/projects`         | List projects (`?category=Residential`)   |
| GET    | `/api/projects/{slug}`  | Single project                            |
| GET    | `/api/services`         | List services                             |
| POST   | `/api/contact`          | Save a contact message (SQLite)           |

## Run the frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Run both at the same time; the Vite dev server forwards `/api` requests to the backend.
For production, `npm run build` and set `VITE_API_URL` to the deployed backend URL.

## Deploy to Vercel (free Hobby plan)

The repo deploys as **one Vercel project**: the React build is served as static files and
`api/index.py` runs the FastAPI app as a serverless function under `/api` (see `vercel.json`).

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Leave **Root Directory** as the
   repo root — `vercel.json` already sets the build command and output folder. Click **Deploy**.
3. **Contact form storage:** Vercel's disk is temporary, so add a free Postgres database:
   Project → **Storage** → **Create Database** → **Neon** (free) → connect it to the project.
   This sets `DATABASE_URL` automatically. Redeploy once afterwards.
   Messages can then be read in the Neon console (`SELECT * FROM contact_messages;`).

Python dependencies for the function live in the root `requirements.txt`.

## Contact form notifications (email + SMS)

Every contact form submission is saved to the database **and** sent to you by email (SMTP) and
text message (SMS). Each channel is optional — it is skipped if its settings are blank.
Settings go in `backend/.env` locally and in Vercel → Project → **Settings → Environment Variables**
in production (see `backend/.env.example` for the full list).

| Variable | Example |
| --- | --- |
| `CONTACT_NOTIFY_EMAIL` | `you@gmail.com` — where enquiries are emailed |
| `SMTP_USER` / `SMTP_PASSWORD` | Gmail address + a Gmail **App Password** |
| `CONTACT_NOTIFY_PHONE` | `+919876543210` — where enquiries are texted |
| `SMS_PROVIDER` | `twilio` (default) or `fast2sms` |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM` | from the Twilio console |
| `FAST2SMS_API_KEY` | from the Fast2SMS dashboard |

**Gmail App Password:** turn on 2-Step Verification for the sending Google account, then create one
at <https://myaccount.google.com/apppasswords> and use the 16-character code as `SMTP_PASSWORD`.
