import { randomUUID } from 'crypto'

const TRAIN_DAYS = [
  'train_maandag',
  'train_dinsdag',
  'train_woensdag',
  'train_donderdag',
  'train_vrijdag',
  'train_zaterdag',
  'train_zondag',
]

const GYM_DAYS = [
  'maandag_sportschool_trainen',
  'dinsdag_sportschool_trainen',
  'woensdag_sportschool_trainen',
  'donderdag_sportschool_trainen',
  'vrijdag_sportschool_trainen',
  'zaterdag_sportschool_trainen',
  'zondag_sportschool_trainen',
]

const HOME_DAYS = [
  'maandag_thuis_trainen',
  'dinsdag_thuis_trainen',
  'woensdag_thuis_trainen',
  'donderdag_thuis_trainen',
  'vrijdag_thuis_trainen',
  'zaterdag_thuis_trainen',
  'zondag_thuis_trainen',
]

const HOME_EQUIPMENT = [
  'dumbbells_thuis',
  'benchpress_thuis',
  'squatrek_thuis',
  'pullup_bar_thuis',
  'dipstation_thuis',
  'abwheel_thuis',
  'springtouw_thuis',
]

const BOOLEAN_FIELDS = new Set([...TRAIN_DAYS, ...GYM_DAYS, ...HOME_DAYS, ...HOME_EQUIPMENT])

const NUMERIC_FIELDS = new Set(['leeftijd', 'sessies_per_week', 'subscribed_int'])

const STRING_FIELDS = [
  'geslacht',
  'lengte',
  'gewicht',
  'doel',
  'grootste_uitdaging',
  'ervaring_krachttraining',
  'gewenste_trainingsduur',
  'focus_spiergroepen',
  'locatie_training',
  'dagelijkse_activiteit',
  'source',
]

function asBoolean(value) {
  if (typeof value === 'boolean') return value
  return value === 'true' || value === true || value === 1 || value === '1'
}

function parseMetadataValue(key, value) {
  if (BOOLEAN_FIELDS.has(key)) return asBoolean(value)
  if (NUMERIC_FIELDS.has(key)) {
    if (value === '' || value === null || value === undefined) return null
    const num = Number(value)
    return Number.isNaN(num) ? null : num
  }
  return value ?? ''
}

export function metadataToFields(metadata) {
  const fields = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'submissionId' || key === 'submittedAt') continue
    fields[key] = parseMetadataValue(key, value)
  }

  return fields
}

export function buildN8nPayload({
  fields,
  email,
  subscribedInt = 1,
  submissionId = randomUUID(),
  submittedAt = new Date().toISOString(),
  stripeCustomerId = null,
  stripeSubscriptionId = null,
  stripeSessionId = null,
}) {
  const payload = {
    submissionId,
    submittedAt,
    source: fields.source || 'training-onboarding-form',
    email: email.trim().toLowerCase(),
    subscribed_int: subscribedInt,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    stripe_session_id: stripeSessionId,
    geslacht: fields.geslacht ?? '',
    leeftijd: fields.leeftijd != null ? Number(fields.leeftijd) : null,
    lengte: String(fields.lengte ?? '').trim(),
    gewicht: String(fields.gewicht ?? '').trim(),
    doel: fields.doel ?? '',
    grootste_uitdaging: fields.grootste_uitdaging ?? '',
    ervaring_krachttraining: fields.ervaring_krachttraining ?? '',
    sessies_per_week: fields.sessies_per_week != null ? Number(fields.sessies_per_week) : null,
    gewenste_trainingsduur: fields.gewenste_trainingsduur ?? '',
    focus_spiergroepen: fields.focus_spiergroepen ?? '',
    locatie_training: fields.locatie_training ?? '',
    dagelijkse_activiteit: fields.dagelijkse_activiteit ?? '',
  }

  for (const day of TRAIN_DAYS) {
    payload[day] = asBoolean(fields[day])
  }

  for (const day of GYM_DAYS) {
    payload[day] = asBoolean(fields[day])
  }

  for (const day of HOME_DAYS) {
    payload[day] = asBoolean(fields[day])
  }

  for (const item of HOME_EQUIPMENT) {
    payload[item] = asBoolean(fields[item])
  }

  return payload
}

export function buildN8nPayloadFromMetadata(metadata, extras) {
  const fields = metadataToFields(metadata)

  for (const key of STRING_FIELDS) {
    if (fields[key] === undefined) fields[key] = ''
  }

  return buildN8nPayload({
    fields,
    email: extras.email,
    subscribedInt: extras.subscribedInt ?? 1,
    submissionId: metadata.submissionId || extras.submissionId,
    submittedAt: metadata.submittedAt || extras.submittedAt,
    stripeCustomerId: extras.stripeCustomerId ?? null,
    stripeSubscriptionId: extras.stripeSubscriptionId ?? null,
    stripeSessionId: extras.stripeSessionId ?? null,
  })
}

export async function forwardToN8n(payload) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

  if (!n8nWebhookUrl) {
    console.log('[n8n] N8N_WEBHOOK_URL not set — skipping forward')
    console.log('[n8n] Payload:', JSON.stringify(payload, null, 2))
    return { forwarded: false }
  }

  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`n8n webhook failed (${response.status}): ${text}`)
  }

  return { forwarded: true }
}
