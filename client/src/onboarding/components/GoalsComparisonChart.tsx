export default function GoalsComparisonChart() {
  return (
    <div
      className="onboarding__goals-chart"
      role="img"
      aria-label="Zonder Gymlads 20%, Met Gymlads 76%"
    >
      <div className="onboarding__goals-chart-card">
        <div className="onboarding__goals-chart-label onboarding__goals-chart-label--without">
          Zonder Gymlads
        </div>
        <div className="onboarding__goals-chart-header-fill" />
        <div className="onboarding__goals-chart-bar onboarding__goals-chart-bar--without">
          <span>20%</span>
        </div>
      </div>
      <div className="onboarding__goals-chart-card">
        <div className="onboarding__goals-chart-label onboarding__goals-chart-label--with">
          Met Gymlads
        </div>
        <div className="onboarding__goals-chart-header-fill" />
        <div className="onboarding__goals-chart-bar onboarding__goals-chart-bar--with">
          <span>76%</span>
        </div>
      </div>
    </div>
  )
}
