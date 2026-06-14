import { processStripeWebhook } from '../server/stripe-webhook.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' })
    }

    const result = await processStripeWebhook(rawBody, signature)
    return res.status(200).json({ received: true, ...result })
  } catch (error) {
    console.error('[stripe] Webhook failed:', error)
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    })
  }
}
