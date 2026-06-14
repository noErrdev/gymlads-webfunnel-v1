import './env.js'
import Stripe from 'stripe'
import { buildN8nPayloadFromMetadata, forwardToN8n } from './submission.js'

let stripe = null

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) return null
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey)
  }
  return stripe
}

async function handleCheckoutCompleted(session) {
  const metadata = session.metadata ?? {}
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    metadata.email ??
    ''

  if (!email) {
    throw new Error('Checkout session completed without customer email')
  }

  const payload = buildN8nPayloadFromMetadata(metadata, {
    email,
    subscribedInt: 1,
    stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
    stripeSubscriptionId:
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null,
    stripeSessionId: session.id,
  })

  await forwardToN8n(payload)
  return payload
}

export async function processStripeWebhook(rawBody, signature) {
  const client = getStripe()
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!client || !stripeWebhookSecret) {
    throw new Error('Stripe webhook is not configured')
  }

  const event = client.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.mode !== 'subscription') {
      return { handled: false, type: event.type }
    }

    const payload = await handleCheckoutCompleted(session)
    return { handled: true, type: event.type, submissionId: payload.submissionId }
  }

  return { handled: false, type: event.type }
}
