import type { StepId } from '../onboarding/useOnboardingSteps'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function pushGtmEvent(event: string, data?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...data })
}

function getStepType(stepId: StepId): 'question' | 'info' | 'conversion' {
  if (stepId === 'plan-ready' || stepId === 'paywall') return 'conversion'
  if (stepId.startsWith('info-')) return 'info'
  return 'question'
}

export function trackOnboardingStepView(
  stepId: StepId,
  stepIndex: number,
  stepTotal: number,
  progress: { current: number; total: number },
) {
  pushGtmEvent('onboarding_step_view', {
    step_id: stepId,
    step_type: getStepType(stepId),
    step_index: stepIndex >= 0 ? stepIndex + 1 : undefined,
    step_total: stepTotal,
    progress_current: progress.current > 0 ? progress.current : undefined,
    progress_total: progress.total,
  })
}
