interface NextButtonProps {
  label?: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export default function NextButton({
  label = 'Volgende',
  onClick,
  disabled,
  loading,
}: NextButtonProps) {
  return (
    <button
      type="button"
      className="onboarding__btn"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Laden...' : label}
    </button>
  )
}
