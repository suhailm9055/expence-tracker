# Expense Tracker & Financial Dashboard

A production-ready expense tracker: Next.js (App Router) + Tailwind on the frontend,
Supabase (PostgreSQL + Auth) on the backend, deployable for free on Vercel + Supabase.

Dark fintech UI matching the reference dashboard: radial monthly-spend gauge, recent
transactions, category bar chart, spending trend line chart, budget donut chart, and
a smart insights panel — plus full expense CRUD, filters, Excel/CSV import & export,
and a basic offline-capable PWA shell.

---

## 1. Project structure

```
expense-tracker/
├── app/
│   ├── login/                # Email OTP + Google sign-in
│   ├── auth/callback/        # OAuth/OTP code exchange
│   ├── dashboard/            # Main dashboard (server component)
│   ├── expenses/             # CRUD + filters + import/export
│   ├── reports/              # Aggregated charts
│   ├── settings/             # Budgets per category
│   ├── layout.tsx / page.tsx / globals.css
├── components/                # All UI building blocks (charts, sidebar, modals...)
├── lib/
│   ├── supabase/              # client.ts, server.ts, middleware.ts
│   ├── excel.ts                # xlsx/csv import + export
│   └── insights.ts             # smart insights logic
├── supabase/migrations/0001_init.sql   # schema + Row Level Security
├── public/sample-data/monthly-spend-sample.xlsx  # your original file, importable from the UI
├── middleware.ts               # route protection (redirects signed-out users to /login)
└── .env.example
```

## 2. Set up Supabase (free tier)

1. Create a project at https://supabase.com (free tier is enough).
2. In **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql` and run it.
   This creates the `expenses` and `budgets` tables and enables **Row Level Security**
   with policies so a user can only ever read/write rows where `user_id = auth.uid()`.
3. In **Authentication → Providers**:
   - Enable Email so users can create an account and sign in with an email and password.
     Magic-link sign-in is also available from the app's login page.
   - To enable Google: turn on the Google provider and paste your Google OAuth
     Client ID/Secret (from Google Cloud Console → OAuth consent screen + Credentials).
4. In **Authentication → URL Configuration**, add your site URL and
   `http://localhost:3000/auth/callback?next=/dashboard` (and your future Vercel URL +
   `/auth/callback?next=/dashboard`)
   to the redirect allow-list.
5. In **Project Settings → API**, copy the **Project URL** and **publishable key**.
   You will only ever use the publishable key in this app — the `service_role` key is never
   referenced anywhere in the code, so it can't leak.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 4. Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 → you'll be redirected to `/login`. Sign in with email OTP
or Google, then land on `/dashboard`. Use **Expenses → Import Excel** and pick
`public/sample-data/monthly-spend-sample.xlsx` (your original file) to load real data,
or just start adding expenses.

## 5. Deploy for free

**Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

**Deploy on Vercel:**
1. Go to https://vercel.com → New Project → import the GitHub repo.
2. Framework preset: Next.js (auto-detected).
3. Add environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy. Vercel serves everything over HTTPS by default.
5. Back in Supabase → Authentication → URL Configuration, add your live
   `https://your-app.vercel.app/auth/callback` to the redirect allow-list.

That's it — both Vercel and Supabase's free tiers are sufficient for this app.

## 6. Security notes

- **RLS is mandatory and already on** — every table policy checks `auth.uid() = user_id`,
  so even with the anon key exposed in the browser (which is normal and expected),
  one user's Supabase queries can never return another user's rows.
- The **service_role key is never used** in this codebase — don't add it to any
  client-side code or `NEXT_PUBLIC_` variable.
- `middleware.ts` redirects any signed-out visitor to `/login` before any page renders.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, referrer policy) are
  set in `next.config.js`.

## 7. Data persistence & Excel

- Every expense is a row in Postgres with `created_at`/`updated_at` timestamps — Supabase's
  free tier includes automated daily backups.
- **Export**: Expenses/Reports pages → "Export .xlsx" / "Export .csv" downloads all
  currently-filtered rows.
- **Import**: "Import Excel" accepts `.xlsx`, `.xls`, or `.csv`. It looks for
  Date / Category / Description / Amount / Payment Method columns (flexible header
  matching — e.g. "Spent" or "Price" both map to Amount), skips blank rows, and reports
  how many rows were imported vs. skipped for missing/invalid data.

## 8. What's a genuine bonus vs. what's stubbed

Implemented: PWA manifest + basic service worker with an offline fallback page,
mobile-responsive layout (sidebar collapses on small screens).

Not implemented (flagged honestly rather than faked): a dark/light theme toggle —
the UI is dark-only per the strict design spec. Say the word if you'd like that added.
