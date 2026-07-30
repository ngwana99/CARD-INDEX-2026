# GHS Mbonjo Limbe — Staff Card Index

Data-collection form for the 2026 South West regional personnel card index
update. No keys or secrets live in the front-end code — Supabase is only
ever called from two Vercel serverless functions, which read their
credentials from environment variables set in the Vercel dashboard.

```
index.html            ← the form (no secrets)
api/submit.js          ← POST: insert/update one card (uses service_role key)
api/roster.js           ← GET: full roster, gated by ADMIN_ACCESS_CODE
supabase-schema.sql     ← run once in Supabase SQL editor
package.json             ← @supabase/supabase-js dependency
.env.example              ← names of the variables you'll set in Vercel
```

## 1. Supabase

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste in `supabase-schema.sql`, run it.
3. Go to **Project Settings → API** and note down:
   - **Project URL**
   - **service_role secret key** (not the anon/public one)

## 2. GitHub

1. Create a new repository.
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "GHS Mbonjo card index"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
   `.gitignore` already keeps `node_modules`, `.vercel`, and any local
   `.env` out of the repo — the real keys never get committed.

## 3. Vercel

1. On vercel.com, **Add New Project** → import the GitHub repo you just
   pushed. Framework preset can stay "Other" — no build step is needed.
2. Before (or right after) the first deploy, go to
   **Project Settings → Environment Variables** and add, for
   Production *and* Preview:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_ACCESS_CODE` — the passcode the school secretary/HOD will type
     into the "School Secretary / HOD access" panel on the page.
3. Deploy. From then on, every `git push` to `main` auto-redeploys.

## Using it

- Teachers open the Vercel URL and fill the form — it posts to
  `/api/submit`, which writes to Supabase using the service-role key.
- The school secretary taps **School Secretary / HOD access**, enters the
  `ADMIN_ACCESS_CODE`, and the page calls `/api/roster?code=...`. The
  server checks the code before returning any data — nobody can read the
  roster without it, even by inspecting the page's source.
- **Export .xlsx / .csv** in that panel downloads the compiled register in
  the original card-index column order.

## If you'd rather fold this into jodeltech.vercel.app directly

Copy `api/submit.js` and `api/roster.js` into that project's own `api/`
folder, copy `index.html`'s `<body>`/`<script>` content into a page there,
and add the same three environment variables to that project instead of
creating a new one.
