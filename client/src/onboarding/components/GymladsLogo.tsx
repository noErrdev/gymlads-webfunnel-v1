import logoImage from '../assets/gymlads-logo.png'

interface GymladsLogoProps {
  className?: string
}

export default function GymladsLogo({ className = 'onboarding__logo-image' }: GymladsLogoProps) {
  return <img className={className} src={logoImage} alt="Gymlads" />
}
