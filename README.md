# Gymlads Web Funnel

A multi-step onboarding wizard built with React. After onboarding, users complete **Stripe Checkout** (email + payment). On successful checkout, the API forwards onboarding data, email, and subscription status to **n8n** for storage in **Supabase**.

**Repository:** [github.com/noErrdev/gymlads-webfunnel-v1](https://github.com/noErrdev/gymlads-webfunnel-v1)

## Flow

```
Onboarding wizard → Paywall → Stripe Checkout (email + subscription)
                                    ↓
                          Stripe webhook (checkout.session.completed)
                                    ↓
                              n8n → Supabase
```

Without Stripe keys configured locally, the app uses a **demo checkout** page so you can still test the n8n workflow.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React + TypeScript + Vite     |
| API      | Express (Node.js)             |
| Payments | Stripe Checkout (subscription)|
| Workflow | n8n (you configure)           |
| Database | Supabase (you configure)      |

## Quick start

```bash
# Install dependencies
npm install
npm install --prefix client
npm install --prefix server

# Configure environment
cp server/.env.example server/.env
# Edit server/.env (see Stripe + n8n sections below)

# Run frontend + backend together
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Health: http://localhost:3001/api/health

## Stripe setup

### 1. Create a Stripe account

Use [Stripe Dashboard](https://dashboard.stripe.com) in **Test mode** while developing.

### 2. Create a product and price

1. Go to **Product catalog** → **Add product**
2. Name it e.g. "Gymlads jaarlijks"
3. Add a **Recurring** price (e.g. €60/year)
4. Copy the **Price ID** (`price_...`) → set as `STRIPE_PRICE_ID`

### 3. API keys

1. Go to **Developers** → **API keys**
2. Copy **Secret key** (`sk_test_...`) → set as `STRIPE_SECRET_KEY`

### 4. Webhook (local development with Stripe CLI)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe login
stripe listen --forward-to localhost:3001/api/stripe-webhook
```

Copy the webhook signing secret (`whsec_...`) from the CLI output → set as `STRIPE_WEBHOOK_SECRET` in `server/.env`.

### 5. Webhook (production on Vercel)

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-project.vercel.app/api/stripe-webhook`
3. Events: select **`checkout.session.completed`**
4. Copy the **Signing secret** → add as `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 6. Environment variables

Add to `server/.env` (local) and Vercel project settings (production):

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_PRICE_ID` | Price ID for the subscription |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `CLIENT_URL` | App URL for Stripe redirects (e.g. `http://127.0.0.1:5173` local, `https://your-app.vercel.app` prod) |
| `N8N_WEBHOOK_URL` | n8n webhook URL (see below) |

## n8n workflow setup (Stripe + Supabase only)

**RevenueCat is not used.** Subscription status lives in Supabase (`subscribed_int`). The app reads Supabase, not RevenueCat.

### Architecture

```
FLOW 1 — Web checkout (Stripe Trigger)
  checkout.session.completed
    → Parse metadata → Save funnel_staging (source=web, subscribed_int=1)
    → STOP (do not delete staging here)

FLOW 2 — App signup (Link User webhook from Adalo)
  email + adalo user_id
    → GET funnel_staging
    → Create users + onboarding → Delete staging

FLOW 3 — App Stripe checkout (Stripe Trigger, metadata has adalo_user_id)
  → PATCH users subscribed_int=1, source=app

FLOW 4 — Cancellation (Stripe Trigger)
  customer.subscription.deleted
    → PATCH users subscribed_int=0
```

### Remove from your existing n8n workflow

Delete or disable these RevenueCat-related nodes:

| Node | Action |
|------|--------|
| `Webhook` (RevenueCat) | Delete |
| `Parse Event` | Delete |
| `Is Active or Inactive?` | Delete |
| `Has Funnel Data?` | Delete |
| `Parse Funnel Data` | Delete |
| `Activate subscription` | Delete |
| `Activate App User` (RC path) | Delete |
| `POST RevenueCat Receipt` | Delete |
| `Upsert User (Stripe)` (old path) | Delete |
| `Delete Staging Row (Stripe)` (old path) | Delete |

Remove `revenuecat_user_id` from all Supabase HTTP node bodies (`Save To Staging`, `Create User`, etc.).

### Stripe Trigger — web checkout branch

On `checkout.session.completed`, if metadata has **no** `adalo_user_id`:

1. **Code** `Parse Web Metadata` — read onboarding from `session.metadata`
2. **HTTP** `Save To Staging (Web)` — POST to `funnel_staging?on_conflict=email`
3. Do **not** delete staging until Link User runs

### Stripe Trigger — app checkout branch

If metadata contains `adalo_user_id`:

- **PATCH** `users?id=eq.{{ adalo_user_id }}` → `subscribed_int: 1`, `source: app`

### Link User webhook (Adalo)

When user signs up in app with email:

- Staging exists → create `users` + `onboarding` with Adalo `id`, `source: web`
- No staging → create app user with `source: app`, `subscribed_int: 0`

### Subscription cancellation

Add Stripe Trigger event `customer.subscription.deleted`:

- **PATCH** `users?email=eq.{{ email }}` → `subscribed_int: 0`

### Example payload from this app (server → n8n, if used)

```json
{
  "submissionId": "uuid",
  "submittedAt": "2026-06-12T12:00:00.000Z",
  "source": "training-onboarding-form",
  "email": "jan@example.com",
  "subscribed_int": 1,
  "stripe_customer_id": "cus_...",
  "stripe_subscription_id": "sub_...",
  "stripe_session_id": "cs_...",
  "geslacht": "Man",
  "leeftijd": 28,
  "lengte": "180",
  "gewicht": "75",
  "doel": "Spieropbouw",
  "grootste_uitdaging": "Consistentie",
  "ervaring_krachttraining": "Ik begin net",
  "sessies_per_week": 3,
  "gewenste_trainingsduur": "60 minuten",
  "focus_spiergroepen": "Ik wil alles gelijk trainen",
  "locatie_training": "Beide",
  "dagelijkse_activiteit": "Meestal zittend",
  "train_maandag": true,
  "train_woensdag": true,
  "dumbbells_thuis": true
}
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check (n8n + Stripe config status) |
| `POST` | `/api/create-checkout-session` | Creates Stripe Checkout session with onboarding metadata |
| `POST` | `/api/stripe-webhook` | Stripe webhook (forwards to n8n on `checkout.session.completed`) |
| `POST` | `/api/confirm-demo-checkout` | Demo checkout without Stripe (local testing) |

## Demo mode (no Stripe keys)

If `STRIPE_SECRET_KEY` or `STRIPE_PRICE_ID` is missing:

1. Complete onboarding → click **Start nu** on paywall
2. You are redirected to a demo checkout page
3. Enter email → data is sent to n8n with `subscribed_int: 1`

Use this to test n8n/Supabase before Stripe is configured.

## Deploy on Vercel

1. Push this repo to GitHub: [noErrdev/gymlads-webfunnel-v1](https://github.com/noErrdev/gymlads-webfunnel-v1)
2. Import the repo in [Vercel](https://vercel.com) → **Add New Project**
2. Add environment variables:
   - `N8N_WEBHOOK_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`
   - `CLIENT_URL` = `https://your-project.vercel.app`
3. Deploy

- App: `https://your-project.vercel.app`
- Health: `https://your-project.vercel.app/api/health`
- Stripe webhook: `https://your-project.vercel.app/api/stripe-webhook`

## Local production test

```bash
npm run build
NODE_ENV=production npm run start --prefix server
```

Set all env vars in `server/.env` including `CLIENT_URL=http://localhost:3001`.
