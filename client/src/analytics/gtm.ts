declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function pushGtmEvent(event: string, data?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...data })
}
