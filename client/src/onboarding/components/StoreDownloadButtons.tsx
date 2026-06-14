import type { ReactNode } from 'react'

const APP_STORE_URL = 'https://apps.apple.com/nl/app/gymlads/id6763741678'
const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.gymlads.app&pcampaignid=web_share'

function AppleIcon() {
  return (
    <svg
      className="checkout-success__store-icon checkout-success__store-icon--apple"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.41-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.274 3.721 1.338.104 2.715-.688 3.559-1.709"
      />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <span className="checkout-success__store-icon-wrap checkout-success__store-icon-wrap--google">
      <svg
        className="checkout-success__store-icon checkout-success__store-icon--google"
        viewBox="10 10 50 48"
        overflow="visible"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="m36.6 34.4-18.9 20a5 5 0 0 0 7.5 3.1h.1l21.2-12.3-10-10.8Z"
        />
        <path
          fill="#FBBC04"
          d="m55.7 31-9.2-5.3-10.3 9.2 10.3 10.3 9.1-5.2a5 5 0 0 0 0-9Z"
        />
        <path
          fill="#4285F4"
          d="m17.7 16.4-.1 1.4V53l.1 1.3L37.2 35 17.7 16.4Z"
        />
        <path
          fill="#34A853"
          d="m36.7 35.4 9.8-9.7-21.2-12.3a5.1 5.1 0 0 0-7.6 3s19 19 19 19Z"
        />
      </svg>
    </span>
  )
}

interface StoreButtonProps {
  href: string
  label: string
  name: string
  icon: ReactNode
}

function StoreButton({ href, label, name, icon }: StoreButtonProps) {
  return (
    <a
      className="checkout-success__store-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <span className="checkout-success__store-copy">
        <span className="checkout-success__store-label">{label}</span>
        <span className="checkout-success__store-name">{name}</span>
      </span>
    </a>
  )
}

export default function StoreDownloadButtons() {
  return (
    <div className="checkout-success__stores">
      <StoreButton
        href={APP_STORE_URL}
        label="Download in de"
        name="App Store"
        icon={<AppleIcon />}
      />
      <StoreButton
        href={GOOGLE_PLAY_URL}
        label="Download via"
        name="Google Play"
        icon={<GooglePlayIcon />}
      />
    </div>
  )
}
