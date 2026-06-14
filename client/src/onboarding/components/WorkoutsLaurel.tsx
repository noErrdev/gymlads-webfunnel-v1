import branchImage from '../assets/workouts-branch.png'

export default function WorkoutsLaurel() {
  return (
    <div className="onboarding__rating-laurel">
      <img
        src={branchImage}
        alt=""
        className="onboarding__rating-laurel-branch onboarding__rating-laurel-branch--left"
        aria-hidden="true"
      />
      <div className="onboarding__rating">
        <strong className="onboarding__rating-score">4.8/5.0</strong>
        <span className="onboarding__stars">★★★★★</span>
        <span className="onboarding__rating-meta">10,000+ workouts gegenereerd</span>
      </div>
      <img
        src={branchImage}
        alt=""
        className="onboarding__rating-laurel-branch onboarding__rating-laurel-branch--right"
        aria-hidden="true"
      />
    </div>
  )
}
