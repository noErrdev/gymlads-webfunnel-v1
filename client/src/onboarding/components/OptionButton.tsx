interface OptionButtonProps {
  selected?: boolean
  multi?: boolean
  onClick: () => void
  children: React.ReactNode
}

export default function OptionButton({ selected, multi, onClick, children }: OptionButtonProps) {
  const selectedClass = selected
    ? multi
      ? ' onboarding__option--border-selected'
      : ' onboarding__option--selected'
    : ''

  return (
    <button type="button" className={`onboarding__option${selectedClass}`} onClick={onClick}>
      {children}
    </button>
  )
}
