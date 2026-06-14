import './env.js'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'
import Stripe from 'stripe'

let stripe = null

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) return null
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey)
  }
  return stripe
}

function sanitizeStripeMetadata(metadata) {
  const sanitized = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (Object.keys(sanitized).length >= 50) break
    sanitized[String(key).slice(0, 40)] = String(value ?? '').slice(0, 500)
  }

  return sanitized
}

export async function createCheckoutSession(metadata) {
  const client = getStripe()
  const stripePriceId = process.env.STRIPE_PRICE_ID
  const clientUrl = process.env.CLIENT_URL || 'http://127.0.0.1:5173'
  const submissionId = randomUUID()
  const enrichedMetadata = sanitizeStripeMetadata({
    ...metadata,
    submissionId,
    submittedAt: new Date().toISOString(),
    subscribed_int: '0',
  })

  if (!client || !stripePriceId) {
    return { demo: true, submissionId }
  }

  const session = await client.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${clientUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}?checkout=cancelled`,
    subscription_data: {
      trial_period_days: 7,
    },
    metadata: enrichedMetadata,
  })

  return { url: session.url, submissionId }
}

export async function getCheckoutRedeemInfo(sessionId) {
  const clientUrl = (process.env.CLIENT_URL || 'http://127.0.0.1:5173').replace(/\/$/, '')
  const redeemBase = (process.env.REDEEM_URL || `${clientUrl}/redeem`).replace(/\/$/, '')
  const client = getStripe()

  let email = null
  let redeemUrl = redeemBase

  if (client && sessionId) {
    const session = await client.checkout.sessions.retrieve(sessionId)
    email = session.customer_details?.email ?? session.customer_email ?? null
    const params = new URLSearchParams({ session_id: sessionId })
    if (email) params.set('email', email)
    redeemUrl = `${redeemBase}?${params.toString()}`
  } else if (sessionId) {
    redeemUrl = `${redeemBase}?session_id=${encodeURIComponent(sessionId)}`
  } else {
    redeemUrl = `${redeemBase}?demo=1`
  }

  const qrDataUrl = await QRCode.toDataURL(redeemUrl, {
    margin: 1,
    width: 220,
    color: { dark: '#000000', light: '#ffffff' },
  })

  return {
    redeemUrl,
    qrDataUrl,
    email,
    demo: !client || !sessionId,
  }
}
