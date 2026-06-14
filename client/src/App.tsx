import OnboardingWizard from './onboarding/OnboardingWizard'
import {
  CheckoutCancelled,
  CheckoutSuccess,
  DemoCheckout,
} from './onboarding/CheckoutResult'
import './index.css'

export default function App() {
  const checkout = new URLSearchParams(window.location.search).get('checkout')

  if (checkout === 'success') return <CheckoutSuccess />
  if (checkout === 'cancelled') return <CheckoutCancelled />
  if (checkout === 'demo') return <DemoCheckout />

  return <OnboardingWizard />
}
