# Deploy to GitHub + Vercel

Project path on this machine:

`/home/workdir/artifacts/konika-digital-experience`

Git is already initialized on branch **main** with the first commit.

---

## 1. Push to GitHub

### Option A — GitHub CLI (if installed)

```bash
cd /path/to/konika-digital-experience

# Create repo + push (replace YOUR_USERNAME)
gh repo create konika-digital-experience --private --source=. --remote=origin --push
```

### Option B — Manual

1. On GitHub: **New repository** → name e.g. `konika-digital-experience` → **do not** add README/license (repo already has files).
2. Then run:

```bash
cd /path/to/konika-digital-experience

git remote add origin https://github.com/YOUR_USERNAME/konika-digital-experience.git
git branch -M main
git push -u origin main
```

Use SSH if you prefer:

```bash
git remote add origin git@github.com:YOUR_USERNAME/konika-digital-experience.git
git push -u origin main
```

---

## 2. Install & verify locally first

```bash
cd konika-digital-experience
npm install
npm run dev          # test locally
npm run build        # must succeed before Vercel
```

---

## 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. **Import** your GitHub repo `konika-digital-experience`
3. Framework preset: **Vite** (auto-detected)
4. Build settings (defaults are fine):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**

`vercel.json` already rewrites all routes to `index.html` so React Router works (`/admin/saru`, `/product/...`, etc.).

---

## 4. Later updates

```bash
# after code changes
git add -A
git commit -m "Describe your change"
git push origin main
```

Vercel will auto-deploy each push to `main`.

---

## 5. Notes

- This is a **concept / portfolio** site — not the official Konika website.
- Saru emails are **demo-logged** in the browser; wire a real email API on a server for production.
- Do not commit `.env` files with secrets (`.gitignore` already excludes them).
- If the build fails on Vercel, check the build log for missing dependencies and ensure `package-lock.json` is committed after a successful local `npm install`.

### Commit lockfile (recommended)

```bash
npm install
git add package-lock.json
git commit -m "Add package-lock for reproducible installs"
git push
```
