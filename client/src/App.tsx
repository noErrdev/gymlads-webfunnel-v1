import OnboardingWizard from './onboarding/OnboardingWizard'
import {
  CheckoutCancelled,
  CheckoutSuccess,
  DemoCheckout,
} from './onboarding/CheckoutResult'
import './index.css'

function getCheckoutView() {
  const { pathname, search } = window.location
  const checkout = new URLSearchParams(search).get('checkout')

  if (pathname === '/checkout/success' || checkout === 'success') return 'success'
  if (pathname === '/checkout/cancelled' || checkout === 'cancelled') return 'cancelled'
  if (pathname === '/checkout/demo' || checkout === 'demo') return 'demo'

  return null
}

export default function App() {
  const view = getCheckoutView()

  if (view === 'success') return <CheckoutSuccess />
  if (view === 'cancelled') return <CheckoutCancelled />
  if (view === 'demo') return <DemoCheckout />

  return <OnboardingWizard />
}
