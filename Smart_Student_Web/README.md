<<<<<<< HEAD
# student-activity-manager
A C/C++ based student activity management system that organizes assignments, exams, attendance, library activities, events, and placement opportunities with deadline-based task prioritization using data structures and OOP.
=======


# SmartCampus — Smart Student Life Assistant

A student life web app built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Local setup

Use Node.js 22 or newer. Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in
`.env.local` using values from your Supabase project. Never use or expose a
service-role key in this application.

Run the SQL files in `supabase/migrations/` in timestamp order in the Supabase
SQL editor. They create student profiles, tasks, attendance records, and
student-owned library reminders, a profile creation trigger, and Row Level
Security policies.
Earlier library catalog migrations are retained but are not used by the
current Library page. New accounts receive the `student` role. Semester values
are limited to 1–8. Admin roles must be assigned deliberately in Supabase;
students cannot set or update their own role.
The attendance target defaults to 75%; override it with
`NEXT_PUBLIC_ATTENDANCE_THRESHOLD` (an integer from 1 to 100) when your
institution uses a different target.

Enable email/password authentication in Supabase and turn off **Confirm email**
in the email provider settings. With confirmation disabled, Supabase creates
the session immediately and the app sends a new student to `/dashboard`.

Then start the app:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public homepage.
Choose **Get started** or **Sign in** to open `/login`, or use `/register` to
create an account with an email address, full name, branch, and semester.
Sign-in uses the email address configured in Supabase; the current profile
schema does not include a roll-number field. Successful sign-in opens the
protected dashboard at `/dashboard`. Workspace routes redirect signed-out
visitors to `/login`.
Profiles and tasks from the original console application's text files are not
imported.
Sign-in is kept in browser-session cookies rather than long-lived persistent
cookies, so users are asked to sign in again after the browser session ends.

## Current implementation

- Public SmartCampus landing page, responsive authenticated app shell, and
  protected student dashboard.
- Supabase email/password sign-up and sign-in, server-managed sessions, and
  sign-out. Email confirmation must be disabled in Supabase for immediate
  sign-up.
- Protected profile page with the signed-in email and student details. Passwords
  are managed by Supabase and cannot be retrieved; sign-in and sign-up forms
  include a show/hide password control.
- Student profile creation and student-owned task storage protected by RLS.
- Subject-wise attendance records with student/admin RLS policies, CRUD actions,
  percentage calculations, and a configurable target.
- Student-owned library reminder records with a manually entered book name,
  borrow date, and submission deadline.
- Task creation and listing with HIGH (due today, tomorrow, or overdue),
  MEDIUM (2–5 days), and LOW (more than 5 days) priority. Dashboard alerts show
  only overdue, due-today, and next-three-day tasks.
- Deadline calculations use the `Asia/Kolkata` calendar date.
- Transient exam priority checker using the source thresholds; exam entries are
  not persisted because no exam table exists yet.
- College events and placement pages are ready for real feeds, but no events,
  opportunities, or registrations are fabricated while those backend
  integrations are unavailable.
- Notifications are currently generated from saved task deadlines; persistent
  read state, notification preferences, and push delivery are not implemented.

## Checks

```powershell
npm run lint
npm run build
```
>>>>>>> recover-web
