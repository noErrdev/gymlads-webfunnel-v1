import './env.js'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

const PORT = process.env.PORT || 3001
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.join(__dirname, '..', 'client', 'dist')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`n8n webhook: ${N8N_WEBHOOK_URL ? 'configured' : 'not configured (set N8N_WEBHOOK_URL)'}`)
  console.log(
    `Stripe: ${process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID ? 'configured' : 'not configured'}`,
  )
})
