import logoImage from '../assets/gymlads-logo.jpeg'

interface GymladsLogoProps {
  className?: string
}

export default function GymladsLogo({ className = 'onboarding__logo-image' }: GymladsLogoProps) {
  return <img className={className} src={logoImage} alt="Gymlads" />
}
