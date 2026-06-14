import './env.js'
import cors from 'cors'
import express from 'express'
import { createCheckoutSession, getCheckoutRedeemInfo } from './stripe.js'
import { processStripeWebhook } from './stripe-webhook.js'
import { buildN8nPayload, forwardToN8n, metadataToFields } from './submission.js'

const app = express()
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

app.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const signature = req.headers['stripe-signature']
      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' })
      }

      const result = await processStripeWebhook(req.body, signature)
      return res.status(200).json({ received: true, ...result })
    } catch (error) {
      console.error('[stripe] Webhook failed:', error)
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      })
    }
  },
)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    n8nConfigured: Boolean(N8N_WEBHOOK_URL),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
    stripeWebhookConfigured: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
    ),
  })
})

app.post('/api/create-checkout-session', async (req, res) => {
  const metadata = req.body?.metadata

  if (!metadata || typeof metadata !== 'object') {
    return res.status(400).json({ error: 'metadata is required' })
  }

  try {
    const result = await createCheckoutSession(metadata)
    return res.json(result)
  } catch (error) {
    console.error('[stripe] Checkout failed:', error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to create checkout session. Please try again later.'
    return res.status(502).json({ error: message })
  }
})

app.get('/api/checkout-redeem', async (req, res) => {
  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : ''

  try {
    const result = await getCheckoutRedeemInfo(sessionId || null)
    return res.json(result)
  } catch (error) {
    console.error('[stripe] Redeem lookup failed:', error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to load redeem details. Please try again later.'
    return res.status(502).json({ error: message })
  }
})

app.post('/api/confirm-demo-checkout', async (req, res) => {
  const { email, metadata } = req.body ?? {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  if (!metadata || typeof metadata !== 'object') {
    return res.status(400).json({ error: 'metadata is required' })
  }

  try {
    const fields = metadataToFields(metadata)
    const payload = buildN8nPayload({
      fields,
      email,
      subscribedInt: 1,
      submissionId: metadata.submissionId,
      submittedAt: metadata.submittedAt,
    })

    await forwardToN8n(payload)

    return res.status(201).json({
      success: true,
      submissionId: payload.submissionId,
    })
  } catch (error) {
    console.error('[demo-checkout] Forward failed:', error)
    return res.status(502).json({
      error: 'Failed to complete demo checkout. Please try again later.',
    })
  }
})

app.use((error, _req, res, _next) => {
  console.error('[api] Unhandled error:', error)
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default app
