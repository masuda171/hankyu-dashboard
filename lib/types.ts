export interface PersonRecord {
  image_name: string
  timestamp: string
  frame_index: number
  person_id: number
  x1: number
  y1: number
  width: number
  height: number
  score: number
  Hat: string
  Glasses: string
  ShortSleeve: string
  LongSleeve: string
  UpperStride: string
  UpperLogo: string
  UpperPlaid: string
  UpperSplice: string
  LowerStripe: string
  LowerPattern: string
  LongCoat: string
  Trousers: string
  Shorts: string
  'Skirt&Dress': string
  boots: string
  HandBag: string
  ShoulderBag: string
  Backpack: string
  HoldObjectsInFront: string
  age: string
  gender: string
  Front: string
  Side: string
  Back: string
}

export interface TimePoint {
  time: string
  count: number
  male: number
  female: number
  less18: number
  age18_60: number
  over60: number
}

export interface CameraData {
  cameraId: number
  records: PersonRecord[]
  filename: string
}

export interface Analytics {
  totalPeople: number
  uniqueImages: number
  genderDist: { name: string; value: number; pct: number }[]
  ageDist: { name: string; value: number; pct: number }[]
  genderAgeDist: { age: string; Male: number; Female: number }[]
  timeSeries: TimePoint[]
  attributeFreqs: { name: string; label: string; pct: number }[]
  bagFreqs: { name: string; label: string; value: number; pct: number }[]
  directionDist: { name: string; value: number; pct: number }[]
  peakMinute: string
  femalePct: number
  age18_60Pct: number
}

export interface CameraComparisonRow {
  camera: string
  total: number
  femalePct: number
  backpackPct: number
  shoulderBagPct: number
  less18Pct: number
  over60Pct: number
  sidePct: number
  peakMinute: string
}
