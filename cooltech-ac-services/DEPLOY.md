# Deploy CoolTech AC Services on Render.com (FREE)

## Step-by-Step Guide (5 minutes)

### Step 1 — Sign Up on Render
1. Open https://render.com in your browser
2. Click **Get Started for Free**
3. Sign up using your **GitHub account** (RThakkar007)
4. Authorize Render to access your repositories

---

### Step 2 — Create a Free PostgreSQL Database
> The app uses MySQL locally but Render's free DB is PostgreSQL. We use an external free MySQL via PlanetScale or you can use Render's free Postgres.

**Easiest option — Use a free MySQL from PlanetScale:**
1. Go to https://planetscale.com → Sign up free
2. Create a new database named `cooltech`
3. Copy the **Connection URL** (looks like: `mysql://user:pass@host/cooltech?ssl={"rejectUnauthorized":true}`)

**OR use Render's free PostgreSQL:**
1. In Render dashboard → **New → PostgreSQL**
2. Name: `cooltech-db` → Plan: **Free** → Click Create
3. Copy the **Internal Database URL**

---

### Step 3 — Deploy the Web Service
1. In Render dashboard → Click **New → Web Service**
2. Connect your GitHub repo: `RThakkar007/rthakkar.github.io`
3. Fill in the settings:
   - **Name:** `cooltech-ac-services`
   - **Root Directory:** `cooltech-ac-services`
   - **Runtime:** `Node`
   - **Build Command:** `npm install -g pnpm && pnpm install && pnpm build`
   - **Start Command:** `node dist/index.js`
   - **Plan:** `Free`

---

### Step 4 — Add Environment Variables
In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(paste your DB connection URL from Step 2)* |
| `JWT_SECRET` | *(any random 32-char string, e.g. `cooltech2024secretkey123456789abc`)* |
| `VITE_APP_TITLE` | `CoolTech AC Services` |
| `STRIPE_SECRET_KEY` | *(from your Stripe dashboard — optional for demo)* |
| `VITE_STRIPE_PUBLISHABLE_KEY` | *(from your Stripe dashboard — optional for demo)* |

---

### Step 5 — Deploy!
1. Click **Create Web Service**
2. Wait ~3-5 minutes for the build to complete
3. Your live URL will be: `https://cooltech-ac-services.onrender.com`

---

## After Deployment

- **First load** may take 30-60 seconds (free tier wakes up from sleep)
- **Share this URL** with your client: `https://cooltech-ac-services.onrender.com`
- Every time you push to GitHub, Render **auto-deploys** the latest code

---

## Quick Free MySQL Database (No Credit Card)

If you need a free MySQL database, use **PlanetScale** (free forever):
1. https://planetscale.com → Sign up
2. Create database → Get connection string
3. Paste it as `DATABASE_URL` in Render

---

## Support
- Render Docs: https://render.com/docs
- Render Free Tier: https://render.com/docs/free
