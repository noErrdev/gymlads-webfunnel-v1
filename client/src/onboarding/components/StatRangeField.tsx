interface StatRangeFieldProps {
  id: string
  label: string
  min: number
  max: number
  step?: number
  unit?: string
  value: number
  onChange: (value: number) => void
}

export default function StatRangeField({
  id,
  label,
  min,
  max,
  step = 1,
  unit,
  value,
  onChange,
}: StatRangeFieldProps) {
  const unitSuffix = unit ? ` ${unit}` : ''

  return (
    <div className="onboarding__stat-range">
      <div className="onboarding__stat-range-header">
        <label htmlFor={id}>{label}</label>
        <span className="onboarding__stat-range-value">
          {value}
          {unitSuffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="onboarding__stat-range-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="onboarding__stat-range-limits">
        <span>
          {min}
          {unitSuffix}
        </span>
        <span>
          {max}
          {unitSuffix}
        </span>
      </div>
    </div>
  )
}
