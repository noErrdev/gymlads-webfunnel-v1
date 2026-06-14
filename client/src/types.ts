export type Geslacht = 'Man' | 'Vrouw' | 'Zeg ik liever niet'

export type Doel =
  | 'Afvallen'
  | 'Spieropbouw'
  | 'Kracht opbouwen'
  | 'Onderhouden'
  | 'Fit voelen'

export type GrootsteUitdaging =
  | 'Consistentie'
  | 'Motivatie'
  | 'Niet weten wat te doen'
  | 'Geen resultaat'
  | 'Weinig tijd'

export type ErvaringKrachttraining =
  | 'Ik begin net'
  | 'Ik train soms (niet consistent)'
  | '6-12 maanden consistent'
  | '1+ jaar consistent'

export type LocatieTraining = 'Sportschool' | 'Thuis' | 'Beide'

export type GewensteTrainingsduur =
  | '30 minuten'
  | '45 minuten'
  | '60 minuten'
  | '75 minuten'
  | '90 minuten'

export type SpiergroepFocus =
  | 'Borst'
  | 'Rug'
  | 'Schouder'
  | 'Biceps'
  | 'Triceps'
  | 'Billen/Benen'
  | 'Ik wil alles gelijk trainen'

export type DagelijkseActiviteit =
  | 'Meestal zittend'
  | 'Veel staan'
  | 'Een combinatie van zitten en staan'
  | 'Het verschilt elke dag'

export interface OnboardingData {
  geslacht: Geslacht | ''
  leeftijd: number | null
  lengte: string
  gewicht: string
  doel: Doel | ''
  grootste_uitdaging: GrootsteUitdaging | ''
  ervaring_krachttraining: ErvaringKrachttraining | ''
  sessies_per_week: number | null
  gewenste_trainingsduur: GewensteTrainingsduur | ''
  focus_spiergroepen: SpiergroepFocus | ''
  locatie_training: LocatieTraining | ''
  dagelijkse_activiteit: DagelijkseActiviteit | ''
  train_maandag: boolean
  train_dinsdag: boolean
  train_woensdag: boolean
  train_donderdag: boolean
  train_vrijdag: boolean
  train_zaterdag: boolean
  train_zondag: boolean
  maandag_sportschool_trainen: boolean
  dinsdag_sportschool_trainen: boolean
  woensdag_sportschool_trainen: boolean
  donderdag_sportschool_trainen: boolean
  vrijdag_sportschool_trainen: boolean
  zaterdag_sportschool_trainen: boolean
  zondag_sportschool_trainen: boolean
  maandag_thuis_trainen: boolean
  dinsdag_thuis_trainen: boolean
  woensdag_thuis_trainen: boolean
  donderdag_thuis_trainen: boolean
  vrijdag_thuis_trainen: boolean
  zaterdag_thuis_trainen: boolean
  zondag_thuis_trainen: boolean
  dumbbells_thuis: boolean
  benchpress_thuis: boolean
  squatrek_thuis: boolean
  pullup_bar_thuis: boolean
  dipstation_thuis: boolean
  abwheel_thuis: boolean
  springtouw_thuis: boolean
  source: string
  subscribed_int: number
}

export type BooleanFieldKey = {
  [K in keyof OnboardingData]: OnboardingData[K] extends boolean ? K : never
}[keyof OnboardingData]

export const WEEKDAYS = [
  { day: 'maandag', label: 'Maandag', train: 'train_maandag', gym: 'maandag_sportschool_trainen', home: 'maandag_thuis_trainen' },
  { day: 'dinsdag', label: 'Dinsdag', train: 'train_dinsdag', gym: 'dinsdag_sportschool_trainen', home: 'dinsdag_thuis_trainen' },
  { day: 'woensdag', label: 'Woensdag', train: 'train_woensdag', gym: 'woensdag_sportschool_trainen', home: 'woensdag_thuis_trainen' },
  { day: 'donderdag', label: 'Donderdag', train: 'train_donderdag', gym: 'donderdag_sportschool_trainen', home: 'donderdag_thuis_trainen' },
  { day: 'vrijdag', label: 'Vrijdag', train: 'train_vrijdag', gym: 'vrijdag_sportschool_trainen', home: 'vrijdag_thuis_trainen' },
  { day: 'zaterdag', label: 'Zaterdag', train: 'train_zaterdag', gym: 'zaterdag_sportschool_trainen', home: 'zaterdag_thuis_trainen' },
  { day: 'zondag', label: 'Zondag', train: 'train_zondag', gym: 'zondag_sportschool_trainen', home: 'zondag_thuis_trainen' },
] as const satisfies ReadonlyArray<{
  day: string
  label: string
  train: BooleanFieldKey
  gym: BooleanFieldKey
  home: BooleanFieldKey
}>

export const HOME_EQUIPMENT = [
  { key: 'springtouw_thuis', label: 'Springtouw' },
  { key: 'benchpress_thuis', label: 'Benchpress' },
  { key: 'squatrek_thuis', label: 'Squatrek' },
  { key: 'abwheel_thuis', label: 'Abwheel' },
  { key: 'dumbbells_thuis', label: 'Dumbells' },
  { key: 'pullup_bar_thuis', label: 'Pull-up bar' },
] as const satisfies ReadonlyArray<{
  key: BooleanFieldKey
  label: string
}>

export const initialOnboardingData: OnboardingData = {
  geslacht: '',
  leeftijd: null,
  lengte: '',
  gewicht: '',
  doel: '',
  grootste_uitdaging: '',
  ervaring_krachttraining: '',
  sessies_per_week: null,
  gewenste_trainingsduur: '',
  focus_spiergroepen: '',
  locatie_training: '',
  dagelijkse_activiteit: '',
  train_maandag: false,
  train_dinsdag: false,
  train_woensdag: false,
  train_donderdag: false,
  train_vrijdag: false,
  train_zaterdag: false,
  train_zondag: false,
  maandag_sportschool_trainen: false,
  dinsdag_sportschool_trainen: false,
  woensdag_sportschool_trainen: false,
  donderdag_sportschool_trainen: false,
  vrijdag_sportschool_trainen: false,
  zaterdag_sportschool_trainen: false,
  zondag_sportschool_trainen: false,
  maandag_thuis_trainen: false,
  dinsdag_thuis_trainen: false,
  woensdag_thuis_trainen: false,
  donderdag_thuis_trainen: false,
  vrijdag_thuis_trainen: false,
  zaterdag_thuis_trainen: false,
  zondag_thuis_trainen: false,
  dumbbells_thuis: false,
  benchpress_thuis: false,
  squatrek_thuis: false,
  pullup_bar_thuis: false,
  dipstation_thuis: false,
  abwheel_thuis: false,
  springtouw_thuis: false,
  source: 'web',
  subscribed_int: 0,
}

export function toStripeMetadata(data: OnboardingData): Record<string, string> {
  const metadata: Record<string, string> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'boolean') {
      metadata[key] = value ? 'true' : 'false'
    } else if (value === null || value === '') {
      metadata[key] = ''
    } else {
      metadata[key] = String(value)
    }
  }

  return metadata
}
