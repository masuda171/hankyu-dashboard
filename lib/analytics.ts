import { PersonRecord, Analytics, CameraData, CameraComparisonRow } from './types'

function yesCount(records: PersonRecord[], key: keyof PersonRecord): number {
  return records.filter(r => r[key] === 'Yes').length
}

export function computeAnalytics(records: PersonRecord[]): Analytics {
  const total = records.length
  if (total === 0) {
    return {
      totalPeople: 0, uniqueImages: 0,
      genderDist: [], ageDist: [], genderAgeDist: [],
      timeSeries: [], attributeFreqs: [], bagFreqs: [],
      directionDist: [], peakMinute: '—', femalePct: 0, age18_60Pct: 0,
    }
  }

  const maleCnt   = records.filter(r => r.gender === 'Male').length
  const femaleCnt = records.filter(r => r.gender === 'Female').length
  const genderDist = [
    { name: '男性', value: maleCnt,   pct: (maleCnt / total) * 100 },
    { name: '女性', value: femaleCnt, pct: (femaleCnt / total) * 100 },
  ]

  const less18  = records.filter(r => r.age === 'AgeLess18').length
  const age1860 = records.filter(r => r.age === 'Age18-60').length
  const over60  = records.filter(r => r.age === 'AgeOver60').length
  const ageDist = [
    { name: '18歳未満', value: less18,  pct: (less18  / total) * 100 },
    { name: '18〜60歳', value: age1860, pct: (age1860 / total) * 100 },
    { name: '60歳超',   value: over60,  pct: (over60  / total) * 100 },
  ]

  const genderAgeDist = [
    {
      age: '18歳未満',
      Male:   records.filter(r => r.age === 'AgeLess18' && r.gender === 'Male').length,
      Female: records.filter(r => r.age === 'AgeLess18' && r.gender === 'Female').length,
    },
    {
      age: '18〜60歳',
      Male:   records.filter(r => r.age === 'Age18-60' && r.gender === 'Male').length,
      Female: records.filter(r => r.age === 'Age18-60' && r.gender === 'Female').length,
    },
    {
      age: '60歳超',
      Male:   records.filter(r => r.age === 'AgeOver60' && r.gender === 'Male').length,
      Female: records.filter(r => r.age === 'AgeOver60' && r.gender === 'Female').length,
    },
  ]

  // Build time series grouped by HH:MM (from image_name)
  const timeGroups = new Map<string, PersonRecord[]>()
  records.forEach(r => {
    const match = r.image_name.match(/_\d{8}_(\d{2})(\d{2})/)
    if (match) {
      const key = `${match[1]}:${match[2]}`
      if (!timeGroups.has(key)) timeGroups.set(key, [])
      timeGroups.get(key)!.push(r)
    }
  })
  const timeSeries = Array.from(timeGroups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, recs]) => ({
      time,
      count:    recs.length,
      male:     recs.filter(r => r.gender === 'Male').length,
      female:   recs.filter(r => r.gender === 'Female').length,
      less18:   recs.filter(r => r.age === 'AgeLess18').length,
      age18_60: recs.filter(r => r.age === 'Age18-60').length,
      over60:   recs.filter(r => r.age === 'AgeOver60').length,
    }))

  const peakPoint = timeSeries.reduce((a, b) => (a.count > b.count ? a : b), timeSeries[0])
  const peakMinute = peakPoint?.time ?? '—'

  const clothingCols: { key: keyof PersonRecord; label: string }[] = [
    { key: 'LongSleeve',        label: '長袖' },
    { key: 'ShortSleeve',       label: '半袖' },
    { key: 'LongCoat',          label: 'ロングコート' },
    { key: 'Trousers',          label: 'ズボン' },
    { key: 'Shorts',            label: 'ショーツ' },
    { key: 'Skirt&Dress',       label: 'スカート/ドレス' },
    { key: 'Hat',               label: '帽子' },
    { key: 'Glasses',           label: 'メガネ' },
    { key: 'UpperLogo',         label: 'ロゴ入り上着' },
    { key: 'UpperPlaid',        label: 'チェック柄' },
    { key: 'UpperSplice',       label: 'バイカラー/切替' },
    { key: 'UpperStride',       label: 'ストライプ上着' },
    { key: 'LowerStripe',       label: 'ストライプ下着' },
    { key: 'LowerPattern',      label: '柄物下着' },
  ]
  const attributeFreqs = clothingCols
    .map(({ key, label }) => ({
      name: key,
      label,
      pct: (yesCount(records, key) / total) * 100,
    }))
    .filter(a => a.pct > 0)
    .sort((a, b) => b.pct - a.pct)

  const bagCols: { key: keyof PersonRecord; label: string }[] = [
    { key: 'ShoulderBag',         label: 'ショルダーバッグ' },
    { key: 'Backpack',            label: 'リュックサック' },
    { key: 'HandBag',             label: 'ハンドバッグ' },
    { key: 'HoldObjectsInFront',  label: '前抱え荷物' },
  ]
  const bagFreqs = bagCols.map(({ key, label }) => ({
    name: key,
    label,
    value: yesCount(records, key),
    pct: (yesCount(records, key) / total) * 100,
  }))

  const frontCnt = yesCount(records, 'Front')
  const sideCnt  = yesCount(records, 'Side')
  const backCnt  = yesCount(records, 'Back')
  const directionDist = [
    { name: '正面',  value: frontCnt, pct: (frontCnt / total) * 100 },
    { name: '側面',  value: sideCnt,  pct: (sideCnt  / total) * 100 },
    { name: '背面',  value: backCnt,  pct: (backCnt  / total) * 100 },
  ]

  const uniqueImages = new Set(records.map(r => r.image_name)).size

  return {
    totalPeople: total,
    uniqueImages,
    genderDist,
    ageDist,
    genderAgeDist,
    timeSeries,
    attributeFreqs,
    bagFreqs,
    directionDist,
    peakMinute,
    femalePct:   (femaleCnt / total) * 100,
    age18_60Pct: (age1860   / total) * 100,
  }
}

export function computeCameraComparison(cameras: Map<number, CameraData>): CameraComparisonRow[] {
  return Array.from(cameras.entries())
    .sort(([a], [b]) => a - b)
    .map(([id, cam]) => {
      const r = cam.records
      const total = r.length || 1
      const timeSeries = computeAnalytics(r).timeSeries
      const peak = timeSeries.reduce((a, b) => (a.count > b.count ? a : b), timeSeries[0])
      return {
        camera:          `カメラ${id}`,
        total:           r.length,
        femalePct:       (r.filter(x => x.gender === 'Female').length / total) * 100,
        backpackPct:     (r.filter(x => x.Backpack === 'Yes').length / total) * 100,
        shoulderBagPct:  (r.filter(x => x.ShoulderBag === 'Yes').length / total) * 100,
        less18Pct:       (r.filter(x => x.age === 'AgeLess18').length / total) * 100,
        over60Pct:       (r.filter(x => x.age === 'AgeOver60').length / total) * 100,
        sidePct:         (r.filter(x => x.Side === 'Yes').length / total) * 100,
        peakMinute:      peak?.time ?? '—',
      }
    })
}
